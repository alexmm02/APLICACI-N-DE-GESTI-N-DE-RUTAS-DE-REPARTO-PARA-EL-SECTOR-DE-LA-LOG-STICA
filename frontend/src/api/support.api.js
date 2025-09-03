import axios from "./axios";

export const createSupportMessageRequest = (data) => axios.post("/support", data);

