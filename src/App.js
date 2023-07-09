import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/HomePage";
import {ThemeProvider} from "@mui/styles";
import {createTheme} from "@mui/material";
import './App.css'
import {injectStyle} from "react-toastify/inject-style";
import {CHAT_PAGE, HOME_PAGE, LOGIN_PAGE, SIGNUP_PAGE} from "./pages";
import {ToastContainer} from "react-toastify";

const theme = createTheme();

if (typeof window !== "undefined") {
    injectStyle();
}

const Chat = () => {

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Router>
                <Routes>
                    <Route path={CHAT_PAGE} exact element={<Home/>}/>
                    <Route path={HOME_PAGE} exact element={<Home/>}/>
                    <Route path={LOGIN_PAGE} exact element={<LoginPage/>}/>
                    <Route path={SIGNUP_PAGE} exact element={<SignupPage/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default Chat;