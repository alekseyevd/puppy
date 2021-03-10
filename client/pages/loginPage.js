import styles from './login.module.css'

export default function () {
  return (
    <div className={styles.container}>
      <div>
        <input type="text"></input>
        <input type="password"></input>
      </div>
    </div>
  )
}