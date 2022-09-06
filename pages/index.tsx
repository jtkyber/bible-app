import type { NextPage } from 'next'
import {  useAppSelector } from '../redux/hooks'
import styles from '../styles/home/Home.module.scss'

const Home: NextPage = () => {
  const user = useAppSelector(state => state.user)

  return (
    <div className={styles.container}>
      <div className={styles.categories}>

      </div>
      <div className={styles.passages}>
        {
          user?.categories.map((cat, i) => (
            <div key={i}>
              <h3>{cat.name}</h3>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home
