import React from 'react';
import WeatherWidget from './components/WeatherWidget';
import AppointmentForm from './components/AppointmentForm';
import styles from './styles/HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftHalf}>
        <WeatherWidget />
      </div>
      <div className={styles.rightHalf}>
        <AppointmentForm />
      </div>
    </div>
  );
};

export default HomePage;
