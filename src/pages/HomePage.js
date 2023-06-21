import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {deleteChatById, fetchAllUserChats, fetchChatHistory} from "../service/api_service";
import {clearCredentials, getUsername, hasToken} from "../service/token_storage";
import ChatComponent from "../component/ChatComponent";
import NewChatComponent from "../component/NewChatComponent";
import {
    Avatar,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@mui/material/Button";
import useSound from 'use-sound';

import {
    CHAT_CREATED_EVENT_TYPE,
    CHAT_DELETED_EVENT_TYPE,
    DeleteChatHandler,
    MESSAGE_CREATED_EVENT_TYPE,
    NewChatHandler,
    NewMessageHandler,
    useMessagesSocket
} from "../service/websocket_service";
import {CHAT_PAGE, HOME_PAGE, LOGIN_PAGE} from "../pages";
import {Sounds} from "../sounds/sounds";
import {forward} from "../service/page_navigation";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});


export default function Home(props) {
    const classes = useStyles();

    const {chatId} = useParams()
    const [soundInfo] = useSound(Sounds.NOTIFICATION)
    const [soundSuccess] = useSound(Sounds.SUCCESS)

    const [chatIdState, setChatIdState] = useState(chatId)

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState([])
    const navigate = useNavigate()

    const messagesSocket = useMessagesSocket((payload) => {
        if (payload.eventType === CHAT_CREATED_EVENT_TYPE) {
            const maybeNewChat = NewChatHandler(soundInfo)(payload.message)
            maybeNewChat && setChats([...chats, maybeNewChat])
        }
        else if (payload.eventType === MESSAGE_CREATED_EVENT_TYPE) {
            const maybeNewMessage = NewMessageHandler(soundInfo)(payload.message)
            maybeNewMessage && setMessages([...messages, maybeNewMessage])
        }
        else if (payload.eventType === CHAT_DELETED_EVENT_TYPE) {
            const maybeDeletedChat = DeleteChatHandler(chats, soundSuccess)(payload.message)
            maybeDeletedChat && setChats(chats.filter(ch => ch.chatId !== maybeDeletedChat.chatId))
        }
    })


    useEffect(() => {
        if (!hasToken()) {
            return navigate(LOGIN_PAGE)
        }
        const history = fetchChatHistory(chatId)
        setMessages(history || [])
    }, [chatId, navigate, chatIdState])

    useEffect(() => {
        if (!hasToken()) {
            return navigate(LOGIN_PAGE)
        }
        const chats = fetchAllUserChats()
        setChats(chats || [])
        setLoading(false)
    }, [navigate])

    const onSendingMessage = (data) => {
        const result = {
            eventType: MESSAGE_CREATED_EVENT_TYPE,
            message: {...data, chatId: chatIdState}
        }
        messagesSocket.sendMessage(JSON.stringify(result))
    }

    const handleSignOut = () => {
        clearCredentials()
        navigate(LOGIN_PAGE)
    }

    const handleChatClick = (newChatId) => {
        const history = fetchChatHistory(newChatId)
        if (!history) {
            setMessages([])
        } else {
            setMessages(history)
        }
        setChatIdState(newChatId)
        forward(CHAT_PAGE.replace(':chatId', newChatId))
        return true
    }

    const handleDeleteChatClick = (chatId) => {
        return () => {
            deleteChatById(chatId)
                .then(() => {
                    const payload = {
                        eventType: CHAT_DELETED_EVENT_TYPE,
                        message: {chatId: chatId}
                    }
                    console.log(JSON.stringify(payload))
                    setChatIdState(undefined)
                    forward(HOME_PAGE)
                    messagesSocket.sendMessage(JSON.stringify(payload))
                })
        }
    }

    const addNewChat = (payload) => {
        messagesSocket.sendMessage(JSON.stringify({
            eventType: CHAT_CREATED_EVENT_TYPE,
            message: {
                chatId: payload.chatId,
                name: payload.name,
                assignedTo: payload.assignedTo,
                participants: payload.participants
            }
        }))

        return handleChatClick(payload.chatId)
    }

    const getChats = () => {
        const deleteButton = (chat) => {
            if (chat.assignedTo === getUsername()) {
                return <Button onClick={handleDeleteChatClick(chat.chatId)}>Delete</Button>
            }
        }

        return <>
            <NewChatComponent onNewChatCreated={addNewChat}/>
            {chats.map(u => (<ListItem button key={u.chatId} onClick={() => handleChatClick(u.chatId)}>
                        <ListItemIcon>
                            <Avatar alt={u.name} src="https://material-ui.com/static/images/avatar/1.jpg"/>
                        </ListItemIcon>
                        {deleteButton(u)}
                        <ListItemText primary={u.name}>{u.name}</ListItemText>
                        <ListItemText secondary="online" align="right"></ListItemText>
                    </ListItem>
                )
            )}
        </>
    }


    if (loading) {
        return <>LOADING...</>
    }


    return (<div>
            <Button onClick={handleSignOut}>Sign out</Button>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" className="header-message">Chat</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        <ListItem button key="RemySharp">
                            <ListItemIcon>
                                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg"/>
                            </ListItemIcon>
                            <ListItemText primary={getUsername()}></ListItemText>
                        </ListItem>
                    </List>
                    <Divider/>
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth/>
                    </Grid>
                    <Divider/>
                    <List>
                        {getChats()}
                    </List>
                </Grid>
                <ChatComponent disabled={!chatIdState} messages={messages} sendMessageHandler={onSendingMessage}/>
            </Grid>
        </div>
    )
}
