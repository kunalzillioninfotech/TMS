import API from "./api";

export const getNotifications = () => API.get("/notifications");

export const markNotificationAsRead = (id) => API.patch(`/notifications/${id}/read`);

export const saveFcmToken = (token) => {
  return API.post("/notifications/save-token", { token });
};