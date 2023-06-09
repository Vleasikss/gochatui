import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {getUsername} from "../service/token_storage";

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


/**
 * @param {{messages: [], ws, sendMessageHandler}} props
 * @constructor
 */
const ChatComponent = (props) => {
    const classes = useStyles();
    const [message, setMessage] = useState("")

    const getMessages = () => {
        return props.messages.map((m, index) => <ListItem key={index}>
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align="right" primary={m.payload}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align="right" secondary={m.from}></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
        )
    }

    const sendMessage = () => {
        props.sendMessageHandler({payload: message, from: getUsername()})
        setMessage("")
    }

    const onTextFieldUpdate = (event) => {
        setMessage(event.target.value)
    }

    return <Grid item xs={9}>
        <List className={classes.messageArea}>
            {getMessages()}
        </List>
        <Divider/>
        <Grid container style={{padding: '20px'}}>
            <Grid item xs={11}>
                <TextField id="outlined-basic-email" value={message} onChange={onTextFieldUpdate} label="Type Something" fullWidth/>
            </Grid>
            <Grid xs={1} align="right">
                <Fab color="primary" aria-label="add" onClick={sendMessage}><SendIcon/></Fab>
            </Grid>
        </Grid>
    </Grid>
}

export default ChatComponent