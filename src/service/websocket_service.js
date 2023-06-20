import useWebSocket from "react-use-websocket";
import {getUsername} from "./token_storage";
import {showDeleteMessage, showInfoMessage} from "./notification_service";
import {fetchChatHistory} from "./api_service";
import {CHAT_PAGE} from "../pages";

const host = process.env.REACT_APP_HOST_IP_ADDRESS || "localhost"
const WEBSOCKET_HOST = `ws://${host}/api/ws`

export const useMessagesSocket = (onMessageAction) => useWebSocket(WEBSOCKET_HOST, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => {
        const message = JSON.parse(event.data)
        onMessageAction(message)
    }
});

export const CHAT_CREATED_EVENT_TYPE = "CHAT_CREATED"
export const CHAT_DELETED_EVENT_TYPE = "CHAT_DELETED"
export const MESSAGE_CREATED_EVENT_TYPE = "MESSAGE_CREATED"


export const DeleteChatHandler = (setChats, chats, sound) => {
    return chat => {

        const founded = chats.find(s => s.chatId === chat.chatId);
        if (!founded) {
            return undefined
        }
        const notificationMessage = `${founded.name} has been deleted`
        showDeleteMessage(notificationMessage, sound)
        return chat
    }
}

export const NewChatHandler = (setChatIdState, setMessages, setChats, chats, sound) => {
    return chat => {
        const thisUserName = getUsername()
        const participant = chat.participants.includes(thisUserName)

        if (!participant) {
            return undefined
        }

        const notificationMessage = `${chat.name} has been created`
        showInfoMessage(notificationMessage, sound)
        return chat
    }
}
/**
 * TODO: Use redux to store messages, chats
 */
export const NewMessageHandler = (setMessages, messages, chats, chatId, sound) => {
    const thisUserName = getUsername()
    return (message) => {
        setMessages([...messages, message])
        if (thisUserName === message.from) {
            return
        }
        const notificationMessage = `${message.chatName} - ${message.from}: ${message.payload}`
        showInfoMessage(notificationMessage, sound)
    }
}