import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import {fetchAllUserChats, fetchChatHistory, WEBSOCKET_HOST} from "../service/api_service";
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
    Paper, TextField,
    Typography
} from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@mui/material/Button";

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
    const [chatIdState, setChatIdState]= useState(chatId)

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState([])
    const navigate = useNavigate()

    const socket = useWebSocket(WEBSOCKET_HOST, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        shouldReconnect: (closeEvent) => true,
        onMessage: (event) => {
            setMessages([...messages, JSON.parse(event.data)])
        }
    });

    const onSendingMessage = (data) => {
        const result = {...data, chatId: chatIdState}
        socket.sendMessage(JSON.stringify(result))
    }

    const handleSignOut = () => {
        clearCredentials()
        navigate("/login")
    }

    const handleChatClick = (newChatId) => {
        return () => {
            const history = fetchChatHistory(newChatId)
            if (!history) {
                return setMessages([])
            }
            setMessages(history)
            setChatIdState(newChatId)
            window.history.replaceState(null, "New Page Title", `/home/${chatIdState}`)
        }
    }

    const addNewChat = (payload) => {
        setChats([...chats, payload])
        handleChatClick(payload.chatId)
    }

    useEffect(() => {
        if (!hasToken()) {
            return navigate("/login")
        }

        const history = fetchChatHistory(chatId)
        setMessages(history || [])
        const chats = fetchAllUserChats()
        setChats(chats || [])
        setLoading(false)
    }, [navigate, chatId])

    if (loading) {
        return <>LOADING...</>
    }

    const getChats = () => {

        return <>
            <NewChatComponent onNewChatCreated={addNewChat}/>
            {chats.map(u => (<ListItem button key={u.name} onClick={handleChatClick(u.chatId)}>
                        <ListItemIcon>
                            <Avatar alt={u.name} src="https://material-ui.com/static/images/avatar/1.jpg"/>
                        </ListItemIcon>
                        <ListItemText primary={u.name}>{u.name}</ListItemText>
                        <ListItemText secondary="online" align="right"></ListItemText>
                    </ListItem>
                )
            )}
        </>
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
                <ChatComponent messages={messages} sendMessageHandler={onSendingMessage}/>
            </Grid>
        </div>
    )
}
