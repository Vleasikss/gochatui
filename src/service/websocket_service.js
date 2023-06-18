import useWebSocket from "react-use-websocket";
import {getUsername} from "./token_storage";
import {isUserInChat} from "./chat_service";
import {showInfoMessage} from "./notification_service";

const host = process.env.REACT_APP_HOST_IP_ADDRESS || "localhost"
const WEBSOCKET_HOST = `ws://${host}/api/ws`

export const useMessagesSocket = (onMessageAction)  => useWebSocket(WEBSOCKET_HOST, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => {
        const message = JSON.parse(event.data)
        onMessageAction(message)
    }
});

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
        // if (isUserInChat(chats, chatId)) {
        //
        // }
    }
}