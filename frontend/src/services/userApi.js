import API from "./api";

export const getUsers = () => API.get("/users");
export const getProfile = () => API.get("/profile");
export const updateProfile = (data) =>
    API.put("/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
});
export const changePassword = (data) => {
    return API.put("/change-password", data);
};

export const updateUserStatus = (data) => API.put("/user-status", data);