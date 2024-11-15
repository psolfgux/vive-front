import React, { useState } from 'react';
import styles from './../Header/Header.module.css';

function RegisterForm({ setIsSignUp }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (name.length < 3) {
      setMessage('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Por favor ingresa un email válido.');
      return;
    }

    if (password.length <= 6) {
      setMessage('La contraseña debe tener más de 6 caracteres.');
      return;
    }

    const data = { name, email, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}players/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const result = await response.json();
      console.log('Registro exitoso:', result);
      setMessage('Usuario registrado con éxito!');
      setTimeout(() => {
        setMessage('');
        setName('');
        setEmail('');
        setPassword('');
        setIsSignUp(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error en el registro:', error);
      setMessage('Error en el registro');
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name" className={styles.label}>Nombre</label>
      <input
        id="name"
        className={styles.input}
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <label htmlFor="email" className={styles.label}>Email</label>
      <input
        id="email"
        className={styles.input}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      {message && <p className={styles.message}>{message}</p>}
      
      <button type="submit" className={styles.btnCreate}>Crear mi cuenta</button>
    </form>
  );
}

export default RegisterForm;
