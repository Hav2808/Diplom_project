import { createContext, useContext, FC } from 'react';
import { TypeAuthContext, PropsAuthContext } from './AuthContextTypes';
import { useAuthLogic } from './authFunctions';

/**
 * Контекст аутентификации.
 * @type {React.Context<TypeAuthContext | undefined>}
 */
const AuthContext = createContext<TypeAuthContext | undefined>(undefined);

/**
 * Провайдер контекста аутентификации.
 * @component
 * @param {PropsAuthContext} props - Свойства провайдера.
 * @returns {JSX.Element} Компонент провайдера аутентификации.
 */
export const AuthProvider: FC<PropsAuthContext> = ({ children }) => {
    const { isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin } = useAuthLogic();

    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
        {children}
      </AuthContext.Provider>
    );
};

/**
 * Хук для использования контекста аутентификации.
 * @throws {Error} Если хук используется вне провайдера AuthProvider.
 * @returns {TypeAuthContext} Контекст аутентификации.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};