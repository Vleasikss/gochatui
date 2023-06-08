import React, {useState} from 'react';
import {
    Checkbox,
    Grid,
    TextField,
    FormControlLabel,
    Paper,
    Button
} from '@material-ui/core';


const LoginPage = () => {
    const [checked, setChecked] = useState(true);
    const [data, setData] = useState({username: "", password: ""})

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    const handleUsername = event => {
        setData({...data, username: event.target.value})
    }
    const handlePassword = event => {
        setData({...data, password: event.target.value})
    }
    const handleSubmit = (event) => {
        console.log(data)
    }

    return (
        <div style={{ padding: 30 }}>
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
                        <TextField label="Password" type={'password'} value={data.password} onChange={handlePassword}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    label={'Keep me logged in'}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
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
