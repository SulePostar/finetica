import apiClient from './axios';

/**
 * Send a message to the chatbot
 * @param {string} message - The user's message
 * @returns {Promise<{message: string}>} - The assistant's response
 */
export const sendChatMessage = async (message) => {
    const response = await apiClient.post('/chat', { message });
    return response.data.data;
};

/**
 * Get conversation history
 * @returns {Promise<{history: Array}>} - The conversation history
 */
export const getChatHistory = async () => {
    const response = await apiClient.get('/chat/history');
    return response.data.data;
};

/**
 * Clear conversation history
 * @returns {Promise<void>}
 */
export const clearChatHistory = async () => {
    await apiClient.delete('/chat/history');
};
