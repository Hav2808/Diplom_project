import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "react-query";
import { axiosInstance } from "../../services/API";
import { axiosCheckError } from '../../utils/helperFunctions';
import { FC } from "react";
import './SignupPage.css';
import Spinner from 'react-bootstrap/Spinner';

export const SignupPage: FC = () => {
    const navigate = useNavigate();

    const registrationMutation = useMutation(
        async (data: TypeFormValuesSignup) => {
            const res = await axiosInstance.post('/api/v1/auth/users/', data);
            return res.data;
        },
        {
            onSuccess: () => {
                navigate('/login');
            },
            onError: (error) => {
                console.error("Registration failed:", error);
            }
        }
    );

    const {
        register,
        handleSubmit,
        reset, 
        formState: { errors, isValid },
    } = useForm<TypeFormValuesSignup>({
        mode: "onChange",
    });

    const onSubmit = async (data: TypeFormValuesSignup) => {
        //console.log("Submitting data:", data); // Логируем данные
        //console.log("isValid:", isValid); // Логируем состояние валидации
        //console.log("Errors:", errors); // Логируем ошибки
        try {
            await registrationMutation.mutateAsync(data);
            reset();
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <>
            <h1>Форма регистрации</h1>
            {registrationMutation.isLoading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                    <label className="label">
                        Ник:
                        <input 
                            className="input" 
                            {...register('username', {
                                required: "Обязательное поле!",
                                pattern: {
                                    value: /^[a-zA-Z][a-zA-Z0-9]{3,19}$/,
                                    message: 'Только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов!'
                                },
                            })} 
                        />
                    </label>
                    <div className="error">{errors?.username?.message}</div>

                    <label className="label">
                        Имя:
                        <input 
                            className="input" 
                            {...register('first_name', { required: "Обязательное поле!" })} 
                        />
                    </label>
                    <div className="error">{errors?.first_name?.message}</div>

                    <label className="label">
                        Email:
                        <input 
                            className="input" 
                            {...register('email', {
                                required: "Обязательное поле!",
                                pattern: {
                                    value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
                                    message: 'Пример Email: Ivanov@yandex.ru'
                                },
                            })} 
                        />
                    </label>
                    <div className="error">{errors?.email?.message}</div>

                    <label className="label">
                        Пароль:
                        <input 
                            className="input" 
                            type="password" 
                            {...register('password' , {
                                required: "Обязательное поле!",
                                pattern: {
                                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*\/\\]).{6,20}$/,
                                    message: 'Не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ.'
                                },
                            })} 
                        />
                    </label>
                    <div className="error">{errors?.password?.message}</div>

                    <button className="submit" type="submit" disabled={!isValid}>Зарегистрироваться</button>
                </form>
            )}
            {registrationMutation.isError && (
                <div className="error-response">
                    <p>{axiosCheckError(registrationMutation)}</p>
                </div>
            )}
        </>
    );
};