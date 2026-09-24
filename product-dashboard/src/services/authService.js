import api from "../api/axios";

export const loginUser = async (username, password) => {
    const response = await api.post("/auth/login", {
        username,
        password,
    });

    return response.data;
};
export const logoutUser = () => {
    localStorage.removeItem("accessToken");
};