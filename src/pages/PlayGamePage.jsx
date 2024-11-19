import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import Carrusel from '../components/Carrusel/Carrusel';
import styles from './PlayGamePage.module.css';

import Header from './../components/Header/Header';

import { AuthContext } from './../context/AuthContext';
import Loading from '../components/Loading/Loading';

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



const PlayGamePage = () => {
  const { id } = useParams();
  const [tematica, setTematica] = useState(null);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const [idGame, setIdGame] = useState(0);

  const { userId } = useContext(AuthContext);

const registerGame = async (id_player, id_tematica) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}player-tematica`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id_player,
        id_tematica,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Registro:', data);
      setIdGame(data.id);
    } else if (response.status === 409) {
      const errorData = await response.json();
      console.error('Error de conflicto:', errorData.message);
    } else {
      console.error('Error en la respuesta del servidor:', response.status);
    }
  } catch (error) {
    console.error('Error en la petición:', error);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tematicaResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}tematicas/${id}`);
        const tematicaData = await tematicaResponse.json();
        setTematica(tematicaData);

        const gameResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}game/${id}`);
        const gameData = await gameResponse.json();
        setGame(gameData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const registerGameNow = () => {
    registerGame(userId, tematica.id);
  };


  useEffect(() => {
    if (tematica && tematica.id && userId) {
      registerGame(userId, tematica.id);
    }
  }, [tematica, id]);

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
      <div className={styles.container} style={{ background: tematica?.color }}>
        <Header />
        {tematica && (
          <div>
            <h2 className={styles.title}>{tematica.titulo}</h2>
          </div>
        )}
        {game && (
          <Carrusel 
            game={game} 
            image={tematica.image} 
            color={tematica.color} 
            idGame={idGame}
            fondo={tematica.fondo}
            registerGameNow={registerGameNow}
            userid={userId}
            tematicaid={tematica.id}
          />
        )}
      </div>
    </motion.div>
  );
};

export default PlayGamePage;
