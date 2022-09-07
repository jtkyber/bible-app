import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import bibleStyles from '../styles/bible/Bible.module.scss'
import { setSelectedBook } from '../redux/bibleSlice'

const Bible: NextPage = () => {
    const user = useAppSelector(state => state.user)
    const bible = useAppSelector(state => state.bible)
    const dispatch = useAppDispatch()
    const [books, setBooks]: any[] = useState([])
    const bookDropRef: React.MutableRefObject<any> = useRef(null)
    const bookBtnRef: React.MutableRefObject<any> = useRef(null)

    useEffect(() => {
        if (user.bibleVersion) fetchBooks()

        document.addEventListener('click', closeAllDropdowns)

        return () => {
            document.removeEventListener('click', closeAllDropdowns)
        }
    }, [])

    const toggleBookList = () => {
        bookDropRef.current.classList.toggle(bibleStyles.show)
        bookBtnRef.current.classList.toggle(bibleStyles.active)
    }

    const closeAllDropdowns = (e) => {
        if (e.target !== bookBtnRef.current) {
            bookDropRef.current.classList.remove(bibleStyles.show)
            bookBtnRef.current.classList.remove(bibleStyles.active)
        }
    }


    const fetchBooks = async () => {
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/books`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })
        setBooks(res.data.data)
    }

    const handleBookClick = (book) => {
        dispatch(setSelectedBook({
            name: book.name,
            id: book.id
        }))
    }

    return (
        <div className={bibleStyles.container}>
            <div className={bibleStyles.selectors}>
                <div className={bibleStyles.bookContainer}>
                    <h3 ref={bookBtnRef} onClick={toggleBookList} className={bibleStyles.bookBtn}>{bible.selectedBook.name ? bible.selectedBook.name : 'Choose Book'}</h3>
                    <div ref={bookDropRef} className={bibleStyles.books}>
                    {
                        books.map((book, i) => (
                            <h5 onClick={() => handleBookClick(book)} key={i}>{book.name}</h5>
                        ))
                    }
                    </div>
                </div>
            </div>
            <div className={bibleStyles.content}>

            </div>
        </div>
    )
}

export default Bible