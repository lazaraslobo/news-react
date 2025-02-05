import type {LoginPayload, CreateNewAccountPayload} from "../redux/auth/dataTypes"
import axiosInstance from "../helpers/axiosSetup";

export const handleApiRequest = async <T>(apiFunction: () => Promise<T>): Promise<T | null> => {
    try {
        return await apiFunction();
    } catch (error) {
        console.error("API request error:", error);
        return null;
    }
};

export const postApi_logUserIn = async ({ userEmail, userPassword }: LoginPayload) => {
    return handleApiRequest(() =>
        axiosInstance.post('/login', { email: userEmail, password: userPassword })
    );
};

export const getApi_userInfo = async () => {
    return handleApiRequest(() => axiosInstance.get('/user'));
};

export const postApi_logUserOut = async () => {
    return handleApiRequest(() => axiosInstance.post('/logout'));
};

export const postApi_createNewAccount = async (payload: CreateNewAccountPayload) => {
    return await axiosInstance.post('/register', {...payload, password_confirmation: payload.password});
};

export const getApi_getAllArticles = async () => {
    return handleApiRequest(() => axiosInstance.get('/get-all-articles'));
};

export const postApi_updateInsertUserPreferences = async (props: { key: string, value: any }) => {
    return handleApiRequest(() => axiosInstance.post('/update-preferences', props));
};

