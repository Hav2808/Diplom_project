import axios, { AxiosInstance } from 'axios';

// Определите базовый URL
const API_URL = 'http://95.163.237.111:8000';

//const API_URL ='http://127.0.0.1:8000/';


/**
 * Экземпляр Axios для взаимодействия с сервером.
 */
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Устанавливает токен аутентификации в заголовке запросов.
 * @param token Токен для аутентификации.
 */
export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

/**
 * Получает список пользователей с сервера.
 * @returns Промис, который разрешается массивом объектов TypeUser.
 */
export const fetchUsers = async (): Promise<TypeUser[]> => {
    setAuthToken(localStorage.getItem('token')); // Установить токен из localStorage
    const { data } = await axiosInstance.get('/api/v1/admin/users/');
    return data;
};




/**
 * Удаляет пользователя с указанным идентификатором.
 * @param userId Идентификатор пользователя.
 * @returns Промис без возвращаемого значения.
 */
export const deleteUser = async (userId: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/admin/users/${userId}/`);
};

/**
 * Меняет статус администратора для пользователя с указанным идентификатором.
 * @param userId Идентификатор пользователя.
 * @returns Промис без возвращаемого значения.
 */
export const toggleAdminStatus = async (userId: number): Promise<void> => {
    await axiosInstance.patch(`/api/v1/admin/users/${userId}/`);
};

/**
 * Получает список файлов для определенного пользователя.
 * @param userId Идентификатор пользователя.
 * @returns Промис, который разрешается массивом объектов TypeFile.
 */
export const fetchUserFiles = async (userId: string | undefined | number): Promise<TypeFile[]> => {
    const { data } = await axiosInstance.get(`/api/v1/admin/users/${userId}/files/`);
    return data;
};

/**
 * Выход пользователя и сброс токена для Djoser.
 * @returns Промис без возвращаемого значения.
 */
export const getLogout = async (): Promise<void> => {
    try {
        // Устанавливаем токен из localStorage в заголовки
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token); // Устанавливаем токен в заголовки
        }

        // Выполняем запрос на выход
        await axiosInstance.post('/auth/token/logout/');
    } catch (error) {
        console.error("Ошибка при выходе:", error); // Логируем ошибку
        // Здесь можно добавить уведомление для пользователя о том, что выход не удался
    } finally {
        // Удаляем токен из localStorage и заголовков
        localStorage.removeItem('token');
        setAuthToken(null); // Удаляем токен из заголовков
    }
};

/**
 * Получает список файлов с сервера.
 * @returns Промис, который разрешается объектом TypeAnswerFileList.
 */
export const getFiles = async (): Promise<TypeAnswerFileList> => {
    setAuthToken(localStorage.getItem('token')); // Установить токен из localStorage
    const response = await axiosInstance.get('/api/v1/filelist/');
    return response.data;
};

/**
 * Загружает файл на сервер.
 * @param file Файл для загрузки.
 * @param comment Комментарий пользователя, если он есть.
 * @returns Промис без возвращаемого значения.
 */
export const uploadFile = async ({ file, comment }: UploadFileWithCommentData): Promise<void> => {
    setAuthToken(localStorage.getItem('token')); // Установить токен из localStorage
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);

    await axiosInstance.post('/api/v1/filelist/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Удаляет файл с указанным идентификатором с сервера.
 * @param fileId Идентификатор файла.
 * @returns Промис без возвращаемого значения.
 */
export const deleteFile = async (fileId: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/filedelete/${fileId}/`);
};

/**
 * Обновляет информацию о файле на сервере.
 * @param fileId Идентификатор файла.
 * @param newName Новое имя файла.
 * @param newComment Новый комментарий к файлу.
 * @returns Промис, который разрешается обновленным объектом TypeFile.
 */
export const updateFileInfo = async ({ fileId, newName, newComment }: { fileId: number; newName: string; newComment: string }): Promise<TypeFile> => {
    const response = await axiosInstance.patch(`/api/v1/filelist/${fileId}/`, { name: newName, comment: newComment });
    return response.data;
};

/**
 * Загружает файл по хешу.
 * @param hash Хеш файла.
 * @returns Промис с загруженным файлом.
 */
export const downloadFileByHash = async (hash: string): Promise<TypeFile> => {
    const downloadUrl = `${API_URL}/api/v1/download/${hash}/`; // Формируем URL
    console.log(`Downloading file from: ${downloadUrl}`); // Логируем URL
    const response = await axiosInstance.get(`/api/v1/download/${hash}/`);
    return response.data;
};

export const logout = async (): Promise<void> => {
    try {
        setAuthToken(localStorage.getItem('token'));
        await axiosInstance.post('/auth/token/logout/');
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        localStorage.removeItem('token');
        setAuthToken(null);
    }
};

axios.post('http://localhost:8000/api/v1/auth/login/', {
    username: 'Ваш_логин',
    password: 'Ваш_пароль'
}).then(response => {
    console.log(response.data);
}).catch(error => {
    console.error("Ошибка при входе:", error);
});