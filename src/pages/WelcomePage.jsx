import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

import logo from './../assets/logo1.png';
import amigos from './../assets/amigos1.png';
import right from './../assets/right.png';

import Header from './../components/Header/Header';

import { AuthContext } from './../context/AuthContext';

const pageVariants = {
  initial: { opacity: 0, x: "100vw" }, // Cambiado a 100vw
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "-100vw" }, // Cambiado a -100vw
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const WelcomePage = () => {
  const { token, userId, setToken, setUserId } = useContext(AuthContext);

  const handleLogin = () => {
      // Simular un login y guardar nuevos valores
      const newToken = '1234567890';
      const newUserId = '1';
      
      setToken(newToken);
      setUserId(newUserId);
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className={styles.container}>
        <div className={styles.headerContainerLogo}>
        <Header />

          <div className={styles.contentHeader}>
            <div className={styles.logoHeader}>
              <img src={logo} alt="Logo Ubuntu" className={styles.logo} />
            </div>
          </div>
        </div>
        
        <div className={styles.contentCenter}>
          <img src={amigos} alt="Amigos Ubuntu" className={styles.amigos} />
          <h1 className={styles.welcomeTitle}>Conexiones que importan</h1>
          <p className={styles.description}>Dinámicas simples para transformar tus relaciones</p>
        </div>

        <div className={styles.contentBottom}>
          <Link className={styles.btnStart} to="/select-game">
            <span>Empezar a jugar</span>
            <img src={right} alt="Empezar a jugar"/>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomePage;
