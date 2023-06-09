import React, {useState} from 'react';
import {
    Checkbox,
    Grid,
    TextField,
    FormControlLabel,
    Paper,
    Button
} from '@material-ui/core';
import {postLogin, postRegister} from "../service/api_service";
import {useNavigate} from "react-router-dom";


const SignupPage = () => {
    const [data, setData] = useState({username: "", password: ""})
    const [hasError, setError] = useState(false)
    const navigate = useNavigate()

    const handleUsername = event => {
        setData({...data, username: event.target.value})
    }
    const handlePassword = event => {
        setData({...data, password: event.target.value})
    }
    const handleSubmit = () => {
        postRegister(
            {username: data.username, password: data.password},
            (data) => {
                if (!data.message) {
                    setError(true)
                }
                if (data.message === "registration success") {
                    setError(false)
                    navigate("/login")
                }
            }
        )
            .catch(s => console.log(s))
    }

    return (
        <div style={{padding: 30}}>
            <Paper>
                <Grid
                    container
                    spacing={3}
                    direction={'column'}
                    justify={'center'}
                    alignItems={'center'}
                >
                    {hasError && <h3>Invalid Login or Password</h3>}

                    <Grid item xs={12}>
                        <TextField label="Username" value={data.username} onChange={handleUsername}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Password" type={'password'} value={data.password}
                                   onChange={handlePassword}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth onClick={handleSubmit}> Sign up </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default SignupPage;
