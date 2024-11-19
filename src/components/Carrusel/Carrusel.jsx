import { useRef, useState, useEffect, useContext } from 'react';
import Slider from 'react-slick';
import styles from './Carrusel.module.css';
import { AuthContext } from './../../context/AuthContext';

import magenta from './../../assets/magenta.png';
import { Link } from 'react-router-dom';

const Carrusel = ({ game, image, color, registerGameNow, idGame, fondo, userid, tematicaid }) => {
  const sliderRef = useRef(null);
  const [selectedCard, setSelectedCard] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [final, setFinal] = useState(false);

  const { userId, setIsModalOpen, isLoggedIn, token } = useContext(AuthContext);

  const [count, setCount] = useState(0);

  const [thankYouMessage, setThankYouMessage] = useState(false);
  const [score, setScore] = useState(0);

  const registerCardGame = async (id_card) => {


    try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}game-card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_game: idGame, 
                id_card: id_card
            }),
        });

        if (!response.ok) {
            throw new Error('Error al registrar el juego de cartas');
        }

        const data = await response.json();
        //console.log('Registro exitoso:', data);
    } catch (error) {
        //console.error('Error en registerCardGame:');
        //registerCardGame(id_card)
    }
};

  

  // Configuración del carrusel
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    swipe: false,
    draggable: false,
    beforeChange: (oldIndex, newIndex) => setSelectedCard(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Generar números aleatorios únicos
  const generateUniqueRandomNumbers = () => {
    const numbers = Array.from({ length: game.length }, (_, i) => i);
    let currentIndex = numbers.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [numbers[currentIndex], numbers[randomIndex]] = [
        numbers[randomIndex], numbers[currentIndex],
      ];
    }

    return numbers;
  };

  // useEffect para inicializar los números aleatorios
  useEffect(() => {
    setRandomNumbers(generateUniqueRandomNumbers());
    //goToRandomCard();
    setFinal(false);
    //console.log("id game ", idGame);
  }, [game]);

  // Función para seleccionar la siguiente card aleatoria
  const goToRandomCard = () => {
    if (count < 0 || isLoggedIn) {
      if (randomNumbers.length > 0) {
        const nextNumber = randomNumbers[0];
        goToCard(nextNumber);
        //console.log("ID de la carta seleccionada:", game[nextNumber].id);
        //console.log(randomNumbers); 
        setRandomNumbers(randomNumbers.slice(1));
        if (isLoggedIn) {
          if (idGame===0){
            registerGameNow();
          }
          registerCardGame(game[nextNumber].id)
        }
      }else{
        setFinal(true);
      }
    }else{
      setIsModalOpen(true);
    }

    
    setCount(count + 1);
  };

  // Función para mover el carrusel a una card específica
  const goToCard = (index) => {
    if (sliderRef.current && index >= 0 && index < game.length) {
      sliderRef.current.slickGoTo(index);
      setSelectedCard(index);
    }
  };

  const fondoUrl = fondo ? `${import.meta.env.VITE_APP_MAIN}storage/${fondo}` : null;
  
  const handleSubmitRating = async (e) => {
    e.preventDefault();

    // Si no hay puntuación seleccionada, no hacemos nada
    if (score === null) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}calificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          valor: score,
          tematica_id: tematicaid,
          player_id: userid 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la calificación');
      }
      setThankYouMessage(true);
    } catch (error) {
      console.error('Error al enviar la calificación', error);
    }
  };

  return (
    <div className={styles.container}>
      <Slider ref={sliderRef} {...settings}>
        {game.map((item, index) => (
          <div id={item.id} key={item.id} style={{ padding: 10 }}>
            <div
              className={styles.carta}
              style={{
                filter: selectedCard === index ? 'blur(0px)' : 'blur(3px)',
                borderRadius: 20,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backgroundImage: `url(${fondoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img src={`${import.meta.env.VITE_APP_MAIN}storage/${image}`} alt="Logo Card" className={styles.image} />
              <div>
                <h5 className={styles.line1}>{item.titulo}</h5>
                <p className={styles.line2}>{item.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <button onClick={goToRandomCard} className={styles.btn} style={{ color }}>
        Siguiente carta
      </button>

      <Link className={styles.btnQuiero} to="/select-game">
        <span>Cambiar tematica</span>
      </Link>

      {final && (
        <div className={styles.modalContainer}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <img src={magenta} alt="magenta" className={styles.magenta} />
              
              {thankYouMessage ? (
                <>
                <p className={styles.text}>
                  Gracias por calificar la App Vive Ubuntu! Ahora puedes seguir jugando con nuevas temáticas.
                </p>
                <Link className={styles.btn1} to="/select-game">
                  <span>Cambiar tematica</span>
                </Link>
                </>
              ) : (
                <>
                  <p className={styles.text}>En una escala de 0 a 10, ¿qué tan probable es que recomiendes la App Ububtu a un amig@, colega o familiar?</p>
                  <form onSubmit={handleSubmitRating}>
                    <div className={styles.formGroup}>
                      <select
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className={styles.select}
                        required
                      >
                        <option value="" disabled>Selecciona tu puntuación</option>
                        {[...Array(11).keys()].map((i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className={styles.btn1}>Enviar</button>
                  </form>
                </>
                
              )}






            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrusel;
