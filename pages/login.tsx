import { NextPage } from 'next'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useAppDispatch } from '../redux/hooks'
import logRegStyles from '../styles/logReg/logReg.module.scss'
import { IUserState, setUser } from '../redux/userSlice'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        router.prefetch('/')
    }, [])

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        try {
            const form = e.target as HTMLFormElement
            
            const username: HTMLInputElement | null = form.querySelector('#username')
            const password: HTMLInputElement | null = form.querySelector('#password')
            if (username == null || password == null) return
            
            const res = await axios.post('/api/login', {
                username: username.value,
                password: password.value
            })

            const user: IUserState = res.data;
            
            if (user?._id?.length) {
                dispatch(setUser(user))
                // sessionStorage.setItem('user', JSON.stringify(user))
                router.replace('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={logRegStyles.container}>
            <form onSubmit={handleSubmit}>
                <h1>Log In</h1>

                <input id='username' type='text' placeholder='Username' required></input>

                <input id='password' type='password' placeholder='Password' required></input>

                <button className={logRegStyles.submitBtn} value='submit'>Submit</button>
            </form>
        </div>
    )
}

export default Login;