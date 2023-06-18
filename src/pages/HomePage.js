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
import {ToastContainer} from "react-toastify";
import useSound from 'use-sound';
import notificationSound from '../sounds/toast_sound.mp3';
import {NewMessageHandler, useMessagesSocket} from "../service/websocket_service";
import {CHAT_PAGE, LOGIN_PAGE} from "../pages";

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
    const [sound] = useSound(notificationSound)

    const [chatIdState, setChatIdState] = useState(chatId)

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState([])
    const navigate = useNavigate()

    const messagesSocket = useMessagesSocket(NewMessageHandler(setMessages, messages, chats, chatId, sound))

    useEffect(() => {
        if (!hasToken()) {
            return navigate(LOGIN_PAGE)
        }

        const history = fetchChatHistory(chatId)
        setMessages(history || [])
        const chats = fetchAllUserChats()
        setChats(chats || [])
        setLoading(false)
    }, [navigate, chatId])

    const onSendingMessage = (data) => {
        const result = {...data, chatId: chatIdState}
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
        window.history.replaceState(null, "Chat", CHAT_PAGE.replace(':chatId', newChatId))
    }

    const handleDeleteChatClick = (chatId) => {
        return () => {
            deleteChatById(chatId).then(() => setChats(chats.filter(s => s.chatId !== chatId)))
        }
    }

    const addNewChat = (payload) => {
        setChats([...chats, payload])
        handleChatClick(payload.chatId)
    }

    const getChats = () => {
        const deleteButton = (chat) => {
            if (chat.assignedTo === getUsername()) {
                return <Button onClick={handleDeleteChatClick(chat.chatId)}>Delete</Button>
            }
        }

        return <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <NewChatComponent onNewChatCreated={addNewChat}/>
            {chats.map(u => (<ListItem button key={u.name} onClick={() => handleChatClick(u.chatId)}>
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
