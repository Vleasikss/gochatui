
export const isUserInChat = (chats, chatId) => {
    return chats.map(s => s.chatId).includes(chatId)
}