import {getToken} from "./token_storage";

const host = process.env.REACT_APP_HOST_IP_ADDRESS || "localhost"

const apiHost = `http://${host}/api`

export const fetchChatHistory = (chatId) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `${apiHost}/history/${chatId}`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Authorization", "Bearer " + getToken())
    xmlHttp.send(null);
    const response = JSON.parse(xmlHttp.responseText)
    return response.data
}

export const fetchAllUserChats = () => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `${apiHost}/chat`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Authorization", "Bearer " + getToken())
    xmlHttp.send(null);
    const response = JSON.parse(xmlHttp.responseText)
    return response.data
}

export const fetchAllUsers = () => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `${apiHost}/users`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Authorization", "Bearer " + getToken())
    xmlHttp.send(null);
    const response = JSON.parse(xmlHttp.responseText)
    return response.data
}

/**
 *
 * @param {{username: string, password: string}} user
 * @param {function} callback
 * @return {Promise<Response>}
 */
export const postLogin = (user, callback) => {
    const userJson = JSON.stringify(user)
    return fetch(`${apiHost}/login`, {
        method: "POST",
        body: userJson,
    })
        .then(response => response.json())
        .then(response => callback(response))
}

export const deleteChatById = (chatId, callback) => {
    const userJson = JSON.stringify({chatId})
    return fetch(`${apiHost}/chat/${userJson}`, {
        method: "DELETE",
        body: userJson,
        headers: {"Authorization": "Bearer " + getToken()}
    })
}

export const postRegister = (user, callback) => {
    const userJson = JSON.stringify(user)
    return fetch(`${apiHost}/register`, {method: "POST", body: userJson})
        .then(response => response.json())
        .then(response => callback(response))
        .catch(s => console.log(s))
}

/**
 *
 * @param chatInfo {{name: string, participants: [string]}}
 * @param callback
 * @return {Promise<* | void>}
 */
export const postNewChat = (chatInfo, callback) => {
    const info = JSON.stringify(chatInfo)
    return fetch(`${apiHost}/chat`, {
        method: "POST",
        body: info,
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(response => response.json())
        .then(response => callback(response))
        .catch(s => console.log(s))
}

export const WEBSOCKET_HOST = `ws://${host}/api/ws`