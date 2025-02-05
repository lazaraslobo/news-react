import axios from 'axios';
import {deleteAllCookies} from "../helpers/cookies";
import pagePaths from "../routes/page-paths";

const csrfCookieEndPoint = '/sanctum/csrf-cookie';
const domainBaseUrl = process.env.REACT_APP_API_DOMAIN_PATH || 'http://localhost';

const axiosInstance = axios.create({
    baseURL: `${domainBaseUrl}/api/`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        if (config.url && ![csrfCookieEndPoint, '/logout'].includes(config.url)) {
            try {
                await axios.get(`${domainBaseUrl}${csrfCookieEndPoint}`, { withCredentials: true });
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        }

        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('auth_token='))
            ?.split('=')[1];

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error('Request Error => ', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        const token = response.data.access_token;
        if (token) {
            document.cookie = `auth_token=${token}; path=/; SameSite=Lax; Secure`;
        }
        return response;
    },
    (error) => {
        if(error.status === 401){
            deleteAllCookies();
            window.location.href = window.location.origin + pagePaths.LOGIN_PAGE;
        }
        console.error('API ERROR => ', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
