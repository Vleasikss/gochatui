const TOKEN_KEY = "token"
const USERNAME_KEY = "userInfo"



export const setCredentials = (token, username) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USERNAME_KEY, username)
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

export const hasToken = () => {
    return !!localStorage.getItem(TOKEN_KEY)
}

export const clearCredentials = () => {
    localStorage.clear()
}

export const getUsername = () => {
    return localStorage.getItem(USERNAME_KEY)
}