import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { IUserState } from '../redux/userSlice'
import { useAppDispatch } from '../redux/hooks'
import logRegStyles from '../styles/logReg/logReg.module.scss'
import bibles from '../bibles.json'
import languages from '../languages.json'
import { setUser } from '../redux/userSlice'
import { useRouter } from 'next/router'

const Register: NextPage = () => {
    const [availableBibles, setAvailableBibles]: any[] = useState([])
    const [selectedBible, setSelectedBible] = useState('')
    const dispatch = useAppDispatch()
    const router = useRouter()
    const versionSelectRef: React.MutableRefObject<any> = useRef(null)

    useEffect(() => {
        router.prefetch('/')

        languages.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
        })

        const engIndex = languages.findIndex(el => el.name == 'English')
        const removedObject = languages[engIndex] 
        languages.splice(engIndex, 1)
        languages.unshift(removedObject)
    }, [])

    const handleLangOptionClick = (e): void => {
        const biblesTemp: any = []
        let bibleAdded = false
        
        if (e.target?.value !== 'Language') {
            bibles.forEach((bible, i) => {
                if (bible.language.id === e.target?.value) {
                    if (!bibleAdded) {
                        setSelectedBible(bible.name)
                        bibleAdded = true

                        if (versionSelectRef.current.value === 'Bible Version') {
                            versionSelectRef.current.value = bible.abbreviation
                        }
                    }
                    if ((bible.abbreviation === bibles[i-1]?.abbreviation) || (bible.abbreviation === bibles[i+1]?.abbreviation)) {
                        biblesTemp.push({
                            abbreviation: bible.abbreviation,
                            name: bible.name,
                            id: bible.id,
                            desc: bible.description
                        })
                    } else {
                        biblesTemp.push({
                            abbreviation: bible.abbreviation,
                            name: bible.name,
                            id: bible.id
                        })
                    }
                }
            })

            biblesTemp.sort((a, b) => {
                if (a.abbreviation < b.abbreviation) return -1
                if (a.abbreviation > b.abbreviation) return 1
                return 0
            })

            setSelectedBible(biblesTemp[0].name)
            if (versionSelectRef.current.value === 'Bible Version') {
                versionSelectRef.current.value = biblesTemp[0].abbreviation
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

            if (language === 'Language' || version === 'Bible Version') return

            const res = await axios.post('/api/register', {
                username,
                password,
                language,
                version
            })

            const newUser: IUserState = res.data
            
            if (newUser?._id?.length) {
                dispatch(setUser(newUser))
                // localStorage.setItem('user', JSON.stringify(newUser))
                router.replace('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const setBibleSelection = (e) => {
        availableBibles.forEach((b: any) => {
            if (b.id === e.target.value) {
                setSelectedBible(b.name)
            }
        })
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

                    <select ref={versionSelectRef} onChange={setBibleSelection} id='version' name='version' defaultValue='Bible Version' required>
                        <option value='Bible Version' disabled hidden>Bible Version</option>
                        {
                            availableBibles.map((bible: any) => (
                                <option key={bible.id} value={bible.id}>{bible.abbreviation}{bible.desc ? ` (${bible.desc})` : null}</option>
                            ))
                        }
                    </select>
                </div>
                {
                    selectedBible
                    ?
                    <div className={logRegStyles.bibleSelected}>
                        <h5>Bible Selected:</h5>
                        <h4>{selectedBible}</h4>
                    </div>
                    : null
                }

                <button className={logRegStyles.submitBtn} value='submit'>Submit</button>
            </form>
        </div>
    );
};

export default Register;