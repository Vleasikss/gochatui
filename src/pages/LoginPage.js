import React, {useState} from 'react';

import {postLogin} from "../service/api_service";
import {setCredentials} from "../service/token_storage";
import {useNavigate} from "react-router-dom";
import {Checkbox, FormControlLabel, Grid, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {HOME_PAGE} from "../pages";


const LoginPage = () => {
    const [checked, setChecked] = useState(true);
    const [data, setData] = useState({username: "", password: ""})
    const navigate = useNavigate();

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    const handleUsername = event => {
        setData({...data, username: event.target.value})
    }
    const handlePassword = event => {
        setData({...data, password: event.target.value})
    }
    const handleSubmit = () => {
        postLogin(
            {username: data.username, password: data.password},
            (data) => {
                setCredentials(data.token, data.username)
                navigate(HOME_PAGE)
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
                    <Grid item xs={12}>
                        <TextField label="Username" value={data.username} onChange={handleUsername}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Password" type={'password'} value={data.password}
                                   onChange={handlePassword}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    label={'Keep me logged in'}
                                    inputProps={{'aria-label': 'primary checkbox'}}
                                />
                            }
                            label="Keep me logged in"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth onClick={handleSubmit}> Login </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default LoginPage;
