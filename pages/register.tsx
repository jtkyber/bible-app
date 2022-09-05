import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IUser } from '../models/userModel'
import { useAppDispatch } from '../redux/hooks'
import logRegStyles from '../styles/logReg/logReg.module.scss'
import bibles from '../bibles.json'
import languages from '../languages.json'
import { setUser } from '../redux/userSlice'
import { useRouter } from 'next/router'

const Register: NextPage = () => {
    const [availableBibles, setAvailableBibles] = useState([])
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        router.prefetch('/')
    }, [])

    const handleLangOptionClick = (e): void => {
        const langSelected = e.target?.value
        const biblesTemp: any = []
        
        if (langSelected !== 'Language') {
            for (const bible of bibles) {
                if (bible.language.id === langSelected) {
                    biblesTemp.push(bible)
                }
            }
            setAvailableBibles(biblesTemp)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const form = e.target
            const username = form.querySelector('#username').value
            const password = form.querySelector('#password').value
            const language = form.querySelector('#lang').value
            const version = form.querySelector('#version').value

            const res = await axios.post('/api/register', {
                username,
                password,
                language,
                version
            })

            const newUser: (IUser & any) = res.data;
            dispatch(setUser(newUser))

            if (newUser._id.length) router.replace('/')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={logRegStyles.container}>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>

                <input id='username' type='text' placeholder='Username' required></input>

                <input id='password' type='password' placeholder='Password' required></input>

                <div className={logRegStyles.langAndVersion}>
                    <select onChange={handleLangOptionClick} id='lang' name='language' defaultValue='Language' required>
                        <option value='Language' disabled hidden>Language</option>
                        {
                            languages.map(lang => (
                                <option key={lang.id} value={lang.id}>{lang.name}</option>
                            ))
                        }
                    </select>

                    <select id='version' name='version' defaultValue='Bible Version' required>
                        <option value='Bible Version' disabled hidden>Bible Version</option>
                        {
                            availableBibles.map((bible: any) => (
                                    <option key={bible.id} value={bible.id}>{bible.abbreviation}</option>
                            ))
                        }
                    </select>
                </div>

                <button className={logRegStyles.submitBtn} value='submit'>Submit</button>
            </form>
        </div>
    );
};

export default Register;