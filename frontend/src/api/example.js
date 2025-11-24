// Example API file
// This is how we should define ALL API functions in future.
// No React hooks here. Only pure async functions.

import axios from "axios";

export const getItems = async () => {
    const { data } = await axios.get("/api/example-items");
    return data;
};

export const createItem = async (payload) => {
    const { data } = await axios.post("/api/example-items", payload);
    return data;
};

export const deleteItem = async (id) => {
    await axios.delete(`/api/example-items/${id}`);
};