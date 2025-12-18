import axios from 'axios';

// Centralized axios instance with default configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        return apiClient(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${apiClient.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { token } = response.data;

                if (!token) {
                    throw new Error("No token returned from refresh");
                }

                localStorage.setItem('authToken', token);
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                processQueue(null, token);

                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);

            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('authToken');
                window.location.href = '/login';

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
