import React, { useState, useEffect, useRef } from 'react';
import styles from './Tematica.module.css';
import { Link } from 'react-router-dom';
import arrow from './../../assets/circle-right.png';

const Tematica = ({ id, tematicaActive, setTematicaActive, titulo, descripcion, color }) => {
  const [isOpen, setIsOpen] = useState(tematicaActive === id);
  const [heightEl, setHeightEl] = useState('0px');
  
  const refHeight = useRef(); // Referencia al contenido colapsable

  // Actualiza la altura del contenido cuando cambia la temática activa
  useEffect(() => {
    if (tematicaActive === id) {
      setHeightEl(`${refHeight.current.scrollHeight}px`);
    } else {
      setHeightEl('0px');
    }
  }, [tematicaActive, id]);

  const handleToggle = () => {
    // Cambia la temática activa
    setTematicaActive(tematicaActive === id ? 0 : id);
    setIsOpen(prevState => !prevState);
  };

  return (
    <div className={styles.container} style={{ background: color }}>
      <div className={styles.contentHeader}>
        {/* Al hacer click sobre el título, se activa/desactiva el contenido */}
        <h4 
          className={styles.tematicaTitle} 
          onClick={handleToggle}
          style={{ cursor: 'pointer' }}
        >
          {titulo}
        </h4>
        <Link to={`/play-game/${id}`} className={styles.tematicaLink}>
          <img src={arrow} alt="arrow" />
        </Link>
      </div>
      
      {/* Contenido colapsable */}
      <div 
        className={styles.toggleContent}
        style={{ 
          height: heightEl, 
          overflow: 'hidden', 
          transition: 'height 0.3s ease' 
        }}
        ref={refHeight} // Asignamos la referencia al contenido colapsable
      >
        <p className={styles.tematicaDescription}>
          {descripcion}
        </p>
      </div>
    </div>
  );
};

export default Tematica;
