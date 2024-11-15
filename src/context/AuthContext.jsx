import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [userImage, setUserImage] = useState(localStorage.getItem('userImage') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isModalOpen, setIsModalOpen] = useState(false); // Nuevo estado

    // Actualizar el localStorage cada vez que cambien los valores del contexto
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        }

        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }

        if (name) {
            localStorage.setItem('name', name);
        } else {
            localStorage.removeItem('name');
        }

        if (email) {
            localStorage.setItem('email', email);
        } else {
            localStorage.removeItem('email');
        }

        if (userImage) {
            localStorage.setItem('userImage', userImage);
        } else {
            localStorage.removeItem('userImage');
        }
    }, [token, userId, name, email, userImage]);

    // Valores del contexto
    const value = {
        token,
        userId,
        name,
        email,
        userImage,
        isLoggedIn,
        isModalOpen, // Añadir isModalOpen al valor del contexto
        setToken,
        setUserId,
        setName,
        setEmail,
        setUserImage,
        setIsLoggedIn,
        setIsModalOpen, // Añadir setIsModalOpen al valor del contexto
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
