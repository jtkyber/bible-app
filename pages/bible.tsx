import { NextPage } from 'next'
import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { initialState, setBooks, setChapters, setVerses, setSelectedBook, setSelectedPassage } from '../redux/bibleSlice'
import bibleStyles from '../styles/bible/Bible.module.scss'

const Bible: NextPage = () => {
    const user = useAppSelector(state => state.user)
    const bible = useAppSelector(state => state.bible)

    const dispatch = useAppDispatch()

    const bookBtnRef: React.MutableRefObject<any> = useRef(null)
    const bookDropRef: React.MutableRefObject<any> = useRef(null)
    const chapterBtnRef: React.MutableRefObject<any> = useRef(null)
    const chapterDropRef: React.MutableRefObject<any> = useRef(null)
    const contentRef: React.MutableRefObject<any> = useRef(null)

    useEffect(() => {
        const content = contentRef.current
        const chapterBtn = chapterBtnRef.current
        if (user.bibleVersion) fetchBooks()

        return () => {
            dispatch(setVerses(initialState.verses))
            dispatch(setSelectedPassage(initialState.selectedPassage))
            content.innerHTML = ''
            chapterBtn.innerText = 'Choose Chapter'
        }
    }, [])

    useEffect(() => {
        document.addEventListener('click', handlePageClick)

        return () => {
            document.removeEventListener('click', handlePageClick)
        }
    }, [bible])

    useEffect(() => {
        highlightVerses()
    }, [bible.selectedPassage])


    const toggleBookList = () => {
        bookBtnRef.current.classList.toggle(bibleStyles.active)
        bookDropRef.current.classList.toggle(bibleStyles.show)
    }

    const toggleChapterList = () => {
        chapterBtnRef.current.classList.toggle(bibleStyles.active)
        chapterDropRef.current.classList.toggle(bibleStyles.show)
    }

    const highlightVerses = () => {
        //verse selectors
        const verses = document.querySelectorAll(`.${bibleStyles.verseNum}`)
        for (let i=0; i<verses.length; i++) {
            const verse = verses[i] as HTMLElement | null
            const verseNum: string = verse?.dataset?.verseNumber || ''
            
            if (bible.selectedPassage.number.length == 0) {
                verse?.classList.remove(bibleStyles.highlight)
            } else if (bible.selectedPassage.number.length == 1) {
                if ((parseInt(verseNum) == bible.selectedPassage.number[0])) {
                    verse?.classList.add(bibleStyles.highlight)
                } else verse?.classList.remove(bibleStyles.highlight)
            } else if (bible.selectedPassage.number.length == 2) {
                if ((parseInt(verseNum) >= bible.selectedPassage.number[0]) && (parseInt(verseNum) <= bible.selectedPassage.number[1])) {
                    verse?.classList.add(bibleStyles.highlight)
                } else verse?.classList.remove(bibleStyles.highlight)
            }
        }

        //verse text
        const verseTextList = document.querySelectorAll('[data-verse-id]')
        for (let i=0; i<verseTextList.length; i++) {
            const verseText = verseTextList[i] as HTMLElement | null
            const verseTextId = verseText?.dataset?.verseId
            const indexOfDot = verseTextId?.lastIndexOf('.')
            if (!indexOfDot) return
            const verseTextNumString = verseTextId?.slice(indexOfDot + 1)
            if (!verseTextNumString) return
            const verseTextNum = parseInt(verseTextNumString)

            if (bible.selectedPassage.number.length == 0) {
                verseText?.classList.remove(bibleStyles.highlight)
            } else if (bible.selectedPassage.number.length == 1) {
                if ((verseTextNum == bible.selectedPassage.number[0])) {
                    verseText?.classList.add(bibleStyles.highlight)
                } else verseText?.classList.remove(bibleStyles.highlight)
            } else if (bible.selectedPassage.number.length == 2) {
                if ((verseTextNum >= bible.selectedPassage.number[0]) && (verseTextNum <= bible.selectedPassage.number[1])) {
                    verseText?.classList.add(bibleStyles.highlight)
                } else verseText?.classList.remove(bibleStyles.highlight)
            }
        }
    }

    const handlePageClick = (e) => {
        //close all dropdowns
        const btns = document.querySelectorAll(`.${bibleStyles.selectorBtn}`)
        const options = document.querySelectorAll(`.${bibleStyles.options}`)
        for (let i = 0; i < options.length; i++) {
            if (e.target !== btns[i]) {
                btns[i].classList.remove(bibleStyles.active)
                options[i].classList.remove(bibleStyles.show)
            }
        }
        
        //select verse
        const clickedID = e.target?.dataset?.verseIdSelector
        const clickedNum = parseInt(e.target?.dataset?.verseNumber)
        const savedID = bible.selectedPassage.id
        const savedNum = bible.selectedPassage.number

        if (clickedID) {
            if (!savedNum.length) {
                dispatch(setSelectedPassage({
                    id: [clickedID],
                    number: [clickedNum]
                }))
            }
            else if (savedNum.length == 1) {
                if (clickedNum < savedNum[0]) {
                    dispatch(setSelectedPassage({
                        id: [clickedID, savedID[0]],
                        number: [clickedNum, savedNum[0]]
                    })) 
                } else if (clickedNum > savedNum[0]) {
                    dispatch(setSelectedPassage({
                        id: [savedID[0], clickedID],
                        number: [savedNum[0], clickedNum]
                    })) 
                }
            } else if (savedNum.length == 2) {
                if (clickedNum < savedNum[0]) {
                    dispatch(setSelectedPassage({
                        id: [clickedID, savedID[1]],
                        number: [clickedNum, savedNum[1]]
                    })) 
                } else if ((clickedNum >= savedNum[0]) && (clickedNum <= savedNum[1])) {
                    dispatch(setSelectedPassage({
                        id: [clickedID],
                        number: [clickedNum]
                    }))
                } else if ((clickedNum > savedNum[1])) {
                    dispatch(setSelectedPassage({
                        id: [savedID[0], clickedID],
                        number: [savedNum[0], clickedNum]
                    })) 
                }
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

    const fetchChapter = async (chapterID) => {
        const queryParams = 'include-verse-spans=true'
         const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/chapters/${chapterID}?${queryParams}`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })
        const data = res.data.data
        contentRef.current.innerHTML = data.content
        const versesTemp: string[] = []
        for (let i=1; i<=data.verseCount; i++) {
            versesTemp.push(`${data.id}.${i}`)
        }
        dispatch(setVerses(versesTemp))
    }

    const handleBookClick = (book) => {
        dispatch(setSelectedBook({
            name: book.name,
            id: book.id
        }))
        dispatch(setVerses(initialState.verses))
        dispatch(setSelectedPassage(initialState.selectedPassage))
        contentRef.current.innerHTML = ''
        chapterBtnRef.current.innerText = 'Choose Chapter'
        fetchChapters(book.id)
    }

    const handleChapterClick = (chapter) => {
        chapterBtnRef.current.innerText = chapter.number
        dispatch(setSelectedPassage(initialState.selectedPassage))
        fetchChapter(chapter.id)
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
                    <h3 ref={chapterBtnRef} onClick={toggleChapterList} className={bibleStyles.selectorBtn} id='chapterBtn'>Choose Chapter</h3>
                    <div ref={chapterDropRef} className={bibleStyles.options} id='chapters'>
                    {
                        bible.chapters.map((chapter, i) => (
                            <h5 onClick={() => handleChapterClick(chapter)} key={i}>{chapter.number}</h5>
                        ))
                    }
                    </div>
                </div>

                <h5 className={bibleStyles.versesLabel}>Select Verse or Range of Verses</h5>

                <div className={bibleStyles.verseSelection}>
                    {
                        bible.verses.map((verse, i) => (
                            <h5 className={bibleStyles.verseNum} key={i} data-verse-id-selector={verse} data-verse-number={i+1}>{i + 1}</h5>
                        ))
                    }
                </div>
            </div>
            <div ref={contentRef} className={bibleStyles.content}></div>
        </div>
    )
}

export default Bible