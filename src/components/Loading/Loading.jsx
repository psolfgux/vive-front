import React from 'react'
import styles from './Loading.module.css';
import bg from './../../assets/bg-uno.jpg';
import load from './../../assets/loading.gif';

const Loading = () => {
  return (
    <div className={styles.container}>
        <img className={styles.bg} src={bg} alt="Background" />
        <img src={load} alt="Loading" className={styles.loading} />
    </div>
  )
}

export default Loading