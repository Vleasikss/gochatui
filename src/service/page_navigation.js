import {CHAT_PAGE} from "../pages";

export const forward = (page) => {
    return window.history.replaceState(null,
        "Chat",
        page
    )
}
export const forwardToChat = chatId => {
    return forward(CHAT_PAGE.replace(':chatId', chatId))
}