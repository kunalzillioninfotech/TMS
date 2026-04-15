import API from "./api";

export const createTask = (data) => API.post("/tasks", data);

export const getTasks = () => API.get("/tasks");

export const updateTaskStatus = (id, status) => API.put(`/tasks/${id}/status`, { status });