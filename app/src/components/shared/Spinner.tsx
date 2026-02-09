import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} role="status" aria-label="Loading">
        <div className={styles.ring} />
      </div>
      <span className={styles.text}>Loading data...</span>
    </div>
  );
}
