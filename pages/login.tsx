import { NextPage } from 'next'
import React, { useEffect } from 'react'
import axios from 'axios'
import { IUser } from '../models/userModel'
import { useAppDispatch } from '../redux/hooks'
import logRegStyles from '../styles/logReg/logReg.module.scss'
import { setUser } from '../redux/userSlice'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        router.prefetch('/')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const form = e.target
            const username = form.querySelector('#username').value
            const password = form.querySelector('#password').value

            const res = await axios.post('/api/login', {
                username,
                password
            })

            const user: (IUser & any) = res.data;
            dispatch(setUser(user))

            if (user._id.length) router.replace('/')
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
    );
};

export default Login;