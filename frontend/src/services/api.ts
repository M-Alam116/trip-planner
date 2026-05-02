import axios from "axios";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export const calculateLogs = (data: any) => {
    return api.post("/api/logs/calculate/", data);
};