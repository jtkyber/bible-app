import type { NextPage } from 'next'
import styles from '../styles/home/Home.module.scss'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {  useAppSelector } from '../redux/hooks'

const Home: NextPage = () => {
  const user = useAppSelector(state => state.user)
  const router = useRouter()

  useEffect(() => {
    if (!user?.id?.length) router.replace('/login')
  }, [router, user])

  return (
    <div className={styles.container}>

    </div>
  )
}

export default Home
