import React, { useEffect, useState, useContext } from 'react';
import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';
import styles from './Header.module.css';
import imagen from './../../assets/user.png';
import magenta from './../../assets/magenta.png';
import RegisterForm from '../RegisterForm/RegisterForm';
import LoginForm from '../LoginForm/LoginForm';
import { AuthContext } from './../../context/AuthContext';
import close from '../../assets/close.svg';

const Header = () => {
    const clientID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
    const {
        email,
        name,
        isLoggedIn,
        setIsLoggedIn,
        setToken,
        setUserId,
        setName,
        setEmail,
        setUserImage,
        userImage,
        isModalOpen, 
        setIsModalOpen
    } = useContext(AuthContext);

    const [isSignUp, setIsSignUp] = useState(true);
    const [first, setFirst] = useState(true);

    const [welcome, setWelcome] = useState(false);

    const [goodBye, setGoodBye] = useState(false);

    const onSuccess = async (response) => {
        const { profileObj, tokenId } = response;
    
        // Enviar nombre y email al endpoint del backend
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}players/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profileObj.name,
                    email: profileObj.email,
                }),
            });
    
            if (!res.ok) {
                throw new Error('Error en la autenticación con el servidor.');
            }
    
            // Parsear la respuesta en JSON
            const data = await res.json();
    
            if (data.estado === 'ok') {
                // Actualizar el estado con los datos recibidos
                setUserId(data.id);
                setName(data.name);
                setEmail(data.email);
                setToken(data.token);
                setUserImage(profileObj.imageUrl);
                setIsLoggedIn(true);
    
                console.log('Datos del usuario:', data);
                toggleModal();
            } else {
                console.error('Error en el login:', data);
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
        }
    };
    

    const onFailure = () => {
        console.log("Something went wrong");
    };

    const handleLogout = () => {
        setToken('');
        setUserId('');
        setEmail('');
        setName('');
        setUserImage('');
        setIsLoggedIn(false);
        handleGoodBye();
    };

    const handleWelcome = () => {
        setWelcome(true);

        setTimeout(() => {
            setWelcome(false);
            setIsModalOpen(false);
        },4000);
    };

    const handleGoodBye = () => {
        setGoodBye(true);

        setTimeout(() => {
            setGoodBye(false);
            setIsModalOpen(false);
        },4000);
    };

    const handleFirst = () => {
        setFirst(false);
        setIsSignUp(false);
    };

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientID,
            });
        }
        gapi.load("client:auth2", start);
    }, [clientID]);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className={styles.container}>
            <div className={styles.profile} onClick={toggleModal}>
                <img src={userImage || imagen} alt="Profile" />
            </div>

            {isModalOpen && (
                goodBye ? (
                    <div className={styles.modalContainer}>
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <button className={styles.btnClose} onClick={toggleModal}>
                                    <img src={close} className={styles.btnImage}/>
                                </button>
                                <img src={magenta} alt="magenta" className={styles.magenta} />
                                <p className={styles.welcome}>Nos vemos pronto para continuar jugando!</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    isLoggedIn ? (
                        welcome ? (
                            <div className={styles.modalContainer}>
                                <div className={styles.modal}>
                                    <div className={styles.modalContent}>
                                        <button className={styles.btnClose} onClick={toggleModal}>
                                            <img src={close} className={styles.btnImage}/>
                                        </button>
                                        <img src={magenta} alt="magenta" className={styles.magenta} />
                                        <p className={styles.welcome}>Bienvenido {name} ahora puedes continuar jugando!</p>
                                    </div>
                                </div>
                            </div>
                        ) : 
                        (
                            <div className={styles.modalContainer}>
                                <div className={styles.modal}>
                                    <div className={styles.modalContent}>
                                        <button className={styles.btnClose} onClick={toggleModal}>
                                            <img src={close} className={styles.btnImage}/>
                                        </button>
                                        <img src={userImage || imagen} alt="Profile" className={styles.photo} />
                                        <p className={styles.name}>{name}</p>
                                        <p className={styles.email}>{email}</p>
                                        <p onClick={handleLogout} className={styles.have}>Cerrar Sesión</p>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className={styles.modalContainer}>
                            <div className={styles.modal}>
                                {first ? (
                                    <div className={styles.modalContent}>
                                        <button className={styles.btnClose} onClick={toggleModal}>
                                            <img src={close} className={styles.btnImage}/>
                                        </button>
                                        <img src={magenta} alt="magenta" className={styles.magenta} />
                                        <h2 className={styles.modalTitle}>Crea tu cuenta</h2>
                                        <p className={styles.description}>Debes crear una cuenta para seguir jugando</p>
                                        <button className={styles.btn} onClick={() => setFirst(false)}>Crear mi cuenta</button>
                                        <p onClick={handleFirst} className={styles.have}>
                                            Ya tengo cuenta, <span className={styles.btnHave}>Iniciar sesión</span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.modalContent}>
                                        <button className={styles.btnClose} onClick={toggleModal}>
                                            <img src={close} className={styles.btnImage}/>
                                        </button>
                                        <h2 className={styles.modalTitle}>
                                            {isSignUp ? 'Crea tu cuenta' : 'Iniciar sesión'}
                                        </h2>
    
                                        {isSignUp ? (
                                            <RegisterForm setIsSignUp={setIsSignUp} />
                                        ) : (
                                            <LoginForm handleWelcome={handleWelcome} />
                                        )}
    
                                        <div className={styles.flexi}>
                                            <GoogleLogin
                                                clientId={clientID}
                                                onSuccess={onSuccess}
                                                onFailure={onFailure}
                                                buttonText="Inicia sesión con Google"
                                                cookiePolicy={"single_host_origin"}
                                            />
                                        </div>
    
                                        <p onClick={() => setIsSignUp(!isSignUp)} className={styles.have}>
                                            {isSignUp ? (
                                                <>Ya tengo cuenta, <button className={styles.btnHave} onClick={() => setIsSignUp(false)}>Iniciar sesión</button></>
                                            ) : (
                                                <>No tengo cuenta, <button className={styles.btnHave} onClick={() => setIsSignUp(true)}>Crear cuenta</button></>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )
            )}
        </div>
    );
};

export default Header;
