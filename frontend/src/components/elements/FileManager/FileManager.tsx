import { useMutation, useQuery, useQueryClient } from "react-query";
import { FC, useRef, useState, useEffect } from "react";
import { getFiles, uploadFile, setAuthToken } from "../../../services/API";
import { FileItem } from "../FileItem/FileItem";

import './FileManager.css';

/**
 * Компонент менеджера файлов.
 * @component
 * @returns {JSX.Element} Компонент менеджера файлов.
 */
export const FileManager: FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [comment, setComment] = useState<string>('');

    // Установка токена при монтировании компонента
    useEffect(() => {
        const token = localStorage.getItem('token'); // Получение токена из localStorage
        setAuthToken(token); // Установка токена для axios
    }, []); // Пустой массив зависимостей - выполняется только при монтировании

    const { data: files, error, isLoading } = useQuery('files', getFiles);

    const mutationUpload = useMutation(uploadFile, {
        onSuccess: () => {
            queryClient.invalidateQueries('files');
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Очистка input после загрузки
            }
            setSelectedFile(null);
            setComment('');
        },
    });

    /**
     * Обработчик изменения выбранного файла.
     * @param {React.ChangeEvent<HTMLInputElement>} event - Событие изменения input файла.
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };
    
    /**
     * Обработчик изменения комментария.
     * @param {React.ChangeEvent<HTMLInputElement>} event - Событие изменения input комментария.
     */
    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    /**
     * Обработчик загрузки файла.
     * Вызывает мутацию для загрузки файла и комментария.
     */
    const handleUpload = () => {
        if (selectedFile) {
            mutationUpload.mutate({ file: selectedFile, comment: comment });
        }
    };

    if (isLoading) return <div>Загрузка...</div>;
    if (error instanceof Error) return <div>Произошла ошибка: {error.message}</div>;

    return (
        <div className="file-manager">
            <h1>Облачное хранилище</h1>
            <div className="loader">
                <input type="file" onChange={handleFileChange} ref={fileInputRef} />
                <input 
                    type="text" 
                    placeholder="Комментарий" 
                    value={comment} 
                    onChange={handleCommentChange} 
                    className="upload-comment"
                />
                <button onClick={handleUpload} disabled={mutationUpload.isLoading}>
                    {mutationUpload.isLoading ? 'Загрузка...' : 'Загрузить файл'}
                </button>
            </div>
            <ul className="file-list">
                {files && files.files.map((file: TypeFile) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </ul>
        </div>
    );
};