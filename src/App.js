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
import {BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import LoginPage from "./pages/LoginPage";

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
    const host = process.env.REACT_APP_HOST_IP_ADDRESS
    const socket = useWebSocket(`ws://${host}/api/ws`, {
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

    useEffect(() => {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", `http://${host}/api/history`, false); // false for synchronous request
        xmlHttp.send(null);
        const response = JSON.parse(xmlHttp.responseText)
        setMessages(response.data)
        setLoading(false)
    }, [])

    if (loading) {
        return <>LOADING...</>
    }

    return (<div>
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
                        <ListItemText primary="John Wick"></ListItemText>
                    </ListItem>
                </List>
                <Divider/>
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth/>
                </Grid>
                <Divider/>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                            <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg"/>
                        </ListItemIcon>
                        <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                        <ListItemText secondary="online" align="right"></ListItemText>
                    </ListItem>
                    <ListItem button key="Alice">
                        <ListItemIcon>
                            <Avatar alt="Alice" src="https://material-ui.com/static/images/avatar/3.jpg"/>
                        </ListItemIcon>
                        <ListItemText primary="Alice">Alice</ListItemText>
                    </ListItem>
                    <ListItem button key="CindyBaker">
                        <ListItemIcon>
                            <Avatar alt="Cindy Baker" src="https://material-ui.com/static/images/avatar/2.jpg"/>
                        </ListItemIcon>
                        <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
                    </ListItem>
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
                {/*<Route path='/about' element={<About/>}/>*/}
                {/*<Route path='/contact' element={<Contact/>}/>*/}
                {/*<Route path='/blogs' element={<Blogs/>}/>*/}
                {/*<Route path='/sign-up' element={<SignUp/>}/>*/}
            </Routes>
        </Router>
    );
}

export default Chat;