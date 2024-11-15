"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './SelectGamePage.module.css';
import Tematica from '../components/Tematica/Tematica';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import Header from './../components/Header/Header';

const pageVariants = {
  initial: { opacity: 0, x: "100vw" }, 
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "-100vw" },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const SelectGamePage = () => {
  const [tematicaActive, setTematicaActive] = useState(0);
  const [tematicas, setTematicas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTematicas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}tematicas`);
      
        const data = await response.json();
        setTematicas(data);
      } catch (error) {
        console.error("Error al cargar las temáticas:", error);
      }
      
    };
    
    fetchTematicas();
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading/>;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className={styles.container}>
        <Header />
        <div className={styles.contentHeader}>
          <div className={styles.logoHeader}>
            <h1 className={styles.selectgameTitle}>¿Con quién (es) vas a jugar?</h1>
          </div>
        </div>

        <div className={styles.contentCenter}>
          {tematicas.map((tematica) => (
            <Tematica
              key={tematica.id}
              id={tematica.id}
              tematicaActive={tematicaActive}
              setTematicaActive={setTematicaActive}
              titulo={tematica.titulo}
              descripcion={tematica.descripcion}
              color={tematica.color}
            />
          ))}

          <Link 
            className={styles.btnQuiero} 
            to="https://viveubuntu.cl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Quiero comprar un mazo físico</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectGamePage;
