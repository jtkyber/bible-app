import { NextPage } from 'next'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useAppSelector } from '../redux/hooks'
import bibleStyles from '../styles/bible/Bible.module.scss'

const Bible: NextPage = () => {
    const user = useAppSelector(state => state.user)

    useEffect(() => {
        if (user.bibleVersion) fetchBooks()
    }, [])

    const fetchBooks = async () => {
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/books`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })

        console.log(res.data)
    }

    return (
        <div className={bibleStyles.container}>
            <div className={bibleStyles.selectors}>
                <div className={bibleStyles.books}>
                    <h3>Test</h3>
                </div>
            </div>
            <div className={bibleStyles.content}>

            </div>
        </div>
    )
}

export default Bible