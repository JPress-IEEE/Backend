const createMessage = async (chatId: string, senderId: string, content: string): Promise<void> => {};

const getMessageForChat = async (chatId: string): Promise<void> => {};

const editMessage = async (messageId: string, newContent: string): Promise<void> => {};

const deleteMessage = async (messageId: string): Promise<void> => {};

const markMessageAsRead = async (messageId: string): Promise<void> => {};

export { createMessage, getMessageForChat, editMessage, deleteMessage, markMessageAsRead };
