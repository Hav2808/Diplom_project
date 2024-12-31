import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import { axiosInstance } from "../../services/API";
import { axiosCheckError } from '../../utils/helperFunctions';

import { useAuth } from '../../context/AuthContext';
import { FC } from "react";
import './LoginPage.css';

/**
 * Тип данных формы входа.
 * @typedef {Object} TypeFormValuesLogin
 * @property {string} username - Имя пользователя.
 * @property {string} password - Пароль.
 */
type TypeFormValuesLogin = {
  username: string;
  password: string;
};

/**
 * Компонент страницы входа.
 * @component
 * @returns {JSX.Element} JSX элемент для страницы входа.
 */
export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setIsAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TypeFormValuesLogin>();

  const loginMutation = useMutation(
    async (data: TypeFormValuesLogin) => {
      //console.log('Отправляемые данные:', data); // Логирование данных перед отправкой
      const res = await axiosInstance.post('/auth/token/login/', data);
      return res.data;
    },
    {
      onSuccess: (postData) => {
        localStorage.setItem('token', postData.auth_token);
        setIsAuthenticated(true);

        if (postData.is_staff) {
          localStorage.setItem('isAdmin', JSON.stringify(postData.is_staff));
          setIsAdmin(postData.is_staff);
        } else {
          localStorage.removeItem('isAdmin');
          setIsAdmin(false);
        }

        navigate('/', { replace: true });
      },
      onError: (error) => {
        console.error("Логин провален:", error);
        // Отобразите сообщение об ошибке пользователю
      },
    }
  );

  /**
   * Обработчик отправки формы.
   * @param {TypeFormValuesLogin} data - Данные формы входа.
   */
  const onSubmit = async (data: TypeFormValuesLogin) => {
    console.log('Отправляемые данные:', data); // Логирование данных перед отправкой
    try {
        await loginMutation.mutateAsync(data); // Используйте mutateAsync для обработки ошибок
        reset();
    } catch (error) {
        console.error("Ошибка авторизации:", error);
    }
};

  return (
    <>
      <h1>Форма авторизации</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="label">
          Логин:
          <input className="input" {...register('username', {
            required: "Обязательное поле!"
          })}/>
        </label>
        <div>{errors?.username && <p>{errors?.username?.message || "Error"}</p>}</div>
        <label className="label">
          Пароль:
          <input className="input" {...register('password', {
            required: "Обязательное поле!"
          })}/>
        </label>
        <div>{errors?.password && <p>{errors?.password?.message || "Error"}</p>}</div>
        <input className="submit" type="submit" disabled={!isValid}/>
        {loginMutation.isError && (
          <div className="error-response">
            <p> {axiosCheckError(loginMutation)} </p>
          </div>
        )}
      </form>
    </>
  );
}

