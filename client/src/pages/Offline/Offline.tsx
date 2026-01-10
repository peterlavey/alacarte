import React from 'react';
import styles from './Offline.module.css';

const Offline: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🌐</div>
        <h1 className={styles.title}>No Internet Connection</h1>
        <p className={styles.message}>
          It seems you are offline. Please check your internet connection and try again.
        </p>
        <button className={styles.button} onClick={handleRetry}>
          Retry
        </button>
      </div>
    </div>
  );
};

export default Offline;
