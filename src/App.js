import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/HomePage";
import {ThemeProvider} from "@mui/styles";
import {createTheme} from "@mui/material";


const theme = createTheme();

const Chat = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path='/home/:chatId' exact element={<Home/>}/>
                    <Route path='/home/' exact element={<Home/>}/>
                    <Route path='/login' exact element={<LoginPage/>}/>
                    <Route path='/signup' exact element={<SignupPage/>}/>
                    {/*<Route path='/about' element={<About/>}/>*/}
                    {/*<Route path='/contact' element={<Contact/>}/>*/}
                    {/*<Route path='/blogs' element={<Blogs/>}/>*/}
                    {/*<Route path='/sign-up' element={<SignUp/>}/>*/}
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default Chat;