import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setBooks, setChapters, setSelectedBook, setSelectedChapter } from '../redux/bibleSlice'
import bibleStyles from '../styles/bible/Bible.module.scss'

const Bible: NextPage = () => {
    const user = useAppSelector(state => state.user)
    const bible = useAppSelector(state => state.bible)
    const dispatch = useAppDispatch()
    const bookBtnRef: React.MutableRefObject<any> = useRef(null)
    const bookDropRef: React.MutableRefObject<any> = useRef(null)
    const chapterBtnRef: React.MutableRefObject<any> = useRef(null)
    const chapterDropRef: React.MutableRefObject<any> = useRef(null)

    useEffect(() => {
        if (user.bibleVersion) fetchBooks()

        document.addEventListener('click', closeAllDropdowns)

        return () => {
            document.removeEventListener('click', closeAllDropdowns)
        }
    }, [])

    const toggleBookList = () => {
        bookBtnRef.current.classList.toggle(bibleStyles.active)
        bookDropRef.current.classList.toggle(bibleStyles.show)
    }

    const toggleChapterList = () => {
        chapterBtnRef.current.classList.toggle(bibleStyles.active)
        chapterDropRef.current.classList.toggle(bibleStyles.show)
    }

    const closeAllDropdowns = (e) => {
        const btns = document.querySelectorAll(`.${bibleStyles.selectorBtn}`)
        const options = document.querySelectorAll(`.${bibleStyles.options}`)
        for (let i = 0; i < options.length; i++) {
            if (e.target !== btns[i]) {
                btns[i].classList.remove(bibleStyles.active)
                options[i].classList.remove(bibleStyles.show)
            }
        }
    }


    const fetchBooks = async () => {
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/books`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })
        dispatch(setBooks(res.data.data))
    }

    const fetchChapters = async (bookID) => {
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/books/${bookID}/chapters`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })
        dispatch(setChapters(res.data.data))
    }

    const handleBookClick = (book) => {
        dispatch(setSelectedBook({
            name: book.name,
            id: book.id
        }))
        dispatch(setSelectedChapter({
            number: '',
            id: ''
        }))
        fetchChapters(book.id)
    }

    const handleChapterClick = (chapter) => {
        dispatch(setSelectedChapter({
            number: chapter.number,
            id: chapter.id
        }))
    }

    return (
        <div className={bibleStyles.container}>
            <div className={bibleStyles.selectors}>
                <div className={bibleStyles.selectorContainer} id='bookContainer'>
                    <h3 ref={bookBtnRef} onClick={toggleBookList} className={bibleStyles.selectorBtn} id='bookBtn'>{bible.selectedBook.name ? bible.selectedBook.name : 'Choose Book'}</h3>
                    <div ref={bookDropRef} className={bibleStyles.options} id='books'>
                    {
                        bible.books.map((book, i) => (
                            <h5 onClick={() => handleBookClick(book)} key={i}>{book.name}</h5>
                        ))
                    }
                    </div>
                </div>

                <div className={bibleStyles.selectorContainer} id='chapterContainer'>
                    <h3 ref={chapterBtnRef} onClick={toggleChapterList} className={bibleStyles.selectorBtn} id='chapterBtn'>{bible.selectedChapter.number ? bible.selectedChapter.number : 'Choose Chapter'}</h3>
                    <div ref={chapterDropRef} className={bibleStyles.options} id='chapters'>
                    {
                        bible.chapters.map((chapter, i) => (
                            <h5 onClick={() => handleChapterClick(chapter)} key={i}>{chapter.number}</h5>
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