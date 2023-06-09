import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ChatComponent from "./component/ChatComponent";
import useWebSocket from "react-use-websocket";
import {BrowserRouter as Router, Routes, Route, useNavigate}
    from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import {fetchChatHistory, fetchAllUsers, WEBSOCKET_HOST} from "./service/api_service";
import SignupPage from "./pages/SignupPage";
import {clearCredentials, getUsername, hasToken} from "./service/token_storage";
import {Button} from "@material-ui/core";

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

function Home() {
    const classes = useStyles();

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    const socket = useWebSocket(WEBSOCKET_HOST, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        shouldReconnect: (closeEvent) => true,
        onMessage: (event) => {
            console.log(event)
            console.log(event.data)
            setMessages([...messages, JSON.parse(event.data)])
        }
    });

    const onSendingMessage = (data) => {
        socket.sendMessage(JSON.stringify(data))
    }
    const handleSignOut = () => {
        clearCredentials()
        navigate("/login")
    }

    useEffect(() => {
        if (!hasToken()) {
            return navigate("/login")
        }
        const history = fetchChatHistory()
        setMessages(history)
        const users = fetchAllUsers()
        setUsers(users)
        setLoading(false)
    }, [])

    if (loading) {
        return <>LOADING...</>
    }

    const getUsers = () => {
        return users.map(u => (<ListItem button key="RemySharp">
                    <ListItemIcon>
                        <Avatar alt={u.username} src="https://material-ui.com/static/images/avatar/1.jpg"/>
                    </ListItemIcon>
                    <ListItemText primary={u.username}>Remy Sharp</ListItemText>
                    <ListItemText secondary="online" align="right"></ListItemText>
                </ListItem>
            )
        )
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
                        {getUsers()}
                    </List>
                </Grid>
                <ChatComponent messages={messages} sendMessageHandler={onSendingMessage}/>
            </Grid>
        </div>
    )
}

const Chat = () => {
    return (
        <Router>
            <Routes>
                <Route path='/home' exact element={<Home/>}/>
                <Route path='/login' exact element={<LoginPage/>}/>
                <Route path='/signup' exact element={<SignupPage/>}/>
                {/*<Route path='/about' element={<About/>}/>*/}
                {/*<Route path='/contact' element={<Contact/>}/>*/}
                {/*<Route path='/blogs' element={<Blogs/>}/>*/}
                {/*<Route path='/sign-up' element={<SignUp/>}/>*/}
            </Routes>
        </Router>
    );
}

export default Chat;