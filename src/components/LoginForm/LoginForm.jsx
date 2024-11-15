import React, { useState, useContext } from 'react';
import styles from './../Header/Header.module.css';
import { AuthContext } from './../../context/AuthContext';

function LoginForm({ handleWelcome }) {
  const [email, setEmailLogin] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUserId, setEmail, setName } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}players/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en el inicio de sesión');
      }

      const result = await response.json();
      console.log('Inicio de sesión exitoso:', result);

      setToken(result.token);
      setUserId(result.id);
      setEmail(result.email || email);
      setName(result.name || ''); 
      //setIsModalOpen(false);
      handleWelcome();
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email" className={styles.label}>Email</label>
      <input
        id="email"
        className={styles.input}
        type="email"
        required
        value={email}
        onChange={(e) => setEmailLogin(e.target.value)}
      />
      
      <label htmlFor="password" className={styles.label}>Contraseña</label>
      <input
        id="password"
        className={styles.input}
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button type="submit" className={styles.btnCreate}>Iniciar sesión</button>
    </form>
  );
}

export default LoginForm;
