import { useState } from 'react';

export const useAuthLogic = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    const isAdminFromLocalStorage = localStorage.getItem('isAdmin');
    const initialIsAdmin = isAdminFromLocalStorage ? JSON.parse(isAdminFromLocalStorage) : false;
    const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin);

    return { isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin };
};