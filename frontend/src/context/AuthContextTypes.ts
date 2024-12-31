import { ReactNode } from 'react';

/**
 * Тип контекста аутентификации.
 * @typedef {Object} TypeAuthContext
 * @property {boolean} isAuthenticated - Флаг, указывающий, аутентифицирован ли пользователь.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsAuthenticated - Функция для установки флага аутентификации.
 * @property {boolean} isAdmin - Флаг, указывающий, является ли пользователь администратором.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsAdmin - Функция для установки флага администратора.
 */
export type TypeAuthContext = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Тип свойств провайдера контекста аутентификации.
 * @typedef {Object} PropsAuthContext
 * @property {ReactNode} children - Дочерние компоненты.
 */
export type PropsAuthContext = {
    children: ReactNode;
};