import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import {fetchAllUsers, postNewChat} from "../service/api_service";
import {useEffect} from "react";
import MultiSelect from "./MultiSelect";
import {getUsername} from "../service/token_storage";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

export default function NewChatComponent(props) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true)
    const [users, setUsers] = React.useState([])
    const [selectedUsers, setSelectedUsers] = React.useState([])
    const [payload, setPayload] = React.useState({
        name: ""
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        const users = fetchAllUsers() || []
        const mapped = users
            .filter(u => u.username !== getUsername())
            .map(u => ({key: u.username, value: u.username}))

        console.log(mapped)
        setUsers(mapped)
        setLoading(false)
    }, [])

    const handleClose = (actionType) => {
        if (actionType === "CLOSE") {
            return () => setOpen(false)
        }
        if (actionType === "APPEND") {
            return () => {
                postNewChat({...payload, participants: selectedUsers}, (result) => {
                    props.onNewChatCreated({...payload, participants: selectedUsers, chatId: result.chatId})
                    setOpen(false)
                })
            }
        }
    }

    const handleName = (e) => {
        const value = e.target.value
        setPayload({...payload, name: value})
    }

    const handleSelect = (values) => {
        setSelectedUsers(values)
    }

    if (loading) {
        return <>LOADING...</>
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>Create new Chat</Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Participant"}</DialogTitle>
                <MultiSelect data={users} selected={selectedUsers} onSelect={handleSelect}/>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">Set participants</DialogContentText>
                </DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    value={payload.name}
                    onChange={handleName}
                    label="Chat Name"
                    fullWidth
                />
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">Chat name</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose("CLOSE")}>Close</Button>
                    <Button onClick={handleClose("APPEND")}>Append</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}