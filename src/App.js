import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/HomePage";
import {ThemeProvider} from "@mui/styles";
import {createTheme} from "@mui/material";
import './App.css'
import {injectStyle} from "react-toastify/inject-style";

const theme = createTheme();

if (typeof window !== "undefined") {
    injectStyle();
}

const Chat = () => {

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path='/home/:chatId' exact element={<Home/>}/>
                    <Route path='/home/' exact element={<Home/>}/>
                    <Route path='/login' exact element={<LoginPage/>}/>
                    <Route path='/signup' exact element={<SignupPage/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default Chat;