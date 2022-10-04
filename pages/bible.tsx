import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { initialState, setBooks, setChapters, setVerses, setSelectedBook, setSelectedPassage, IBible, IBook } from '../redux/bibleSlice'
import bibleStyles from '../styles/bible/Bible.module.scss'
import { IUserState, setUser } from '../redux/userSlice'

const Bible: NextPage = () => {
    const user: IUserState = useAppSelector(state => state.user)
    const bible: IBible = useAppSelector(state => state.bible)

    const [selectedChapter, setSelectedChapter] = useState('')

    const dispatch = useAppDispatch()

    const bookBtnRef: React.MutableRefObject<any> = useRef(null)
    const bookDropRef: React.MutableRefObject<any> = useRef(null)
    const chapterBtnRef: React.MutableRefObject<any> = useRef(null)
    const chapterDropRef: React.MutableRefObject<any> = useRef(null)
    const contentRef: React.MutableRefObject<any> = useRef(null)

    useEffect(() => {
        const content = contentRef.current
        const chapterBtn = chapterBtnRef.current

        return () => {
            dispatch(setVerses(initialState.verses))
            dispatch(setSelectedPassage(initialState.selectedPassage))
            content.innerHTML = ''
            chapterBtn.innerText = 'Choose Chapter'
        }
    }, [])

    useEffect(() => {
        bookDropRef?.current?.children[0]?.click()
    }, [bible.books])

    useEffect(() => {
        chapterDropRef?.current?.children[0]?.click()
    }, [bible.chapters])

    useEffect(() => {
        if (user?.bibleVersion) fetchBooks()
    }, [user?.bibleVersion])

    useEffect(() => {
        document.addEventListener('click', handlePageClick)

        return () => {
            document.removeEventListener('click', handlePageClick)
        }
    }, [bible])

    useEffect(() => {
        highlightVerses()
    }, [bible.selectedPassage])

    //-----Toggle book selector dropdown-----
    const toggleBookList = (): void => {
        bookBtnRef.current.classList.toggle(bibleStyles.active)
        bookDropRef.current.classList.toggle(bibleStyles.show)
    }

    //-----Toggle chapter selector dropdown-----
    const toggleChapterList = (): void => {
        chapterBtnRef.current.classList.toggle(bibleStyles.active)
        chapterDropRef.current.classList.toggle(bibleStyles.show)
    }

    //-----Add and remove highlighting of selected verses-----
    const highlightVerses = (): void => {
        //-----Verse selectors-----
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

        //-----Verse text-----
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
        //-----Close all dropdowns-----
        const btns = document.querySelectorAll(`.${bibleStyles.selectorBtn}`)
        const options = document.querySelectorAll(`.${bibleStyles.options}`)
        for (let i = 0; i < options.length; i++) {
            if (e.target !== btns[i]) {
                btns[i].classList.remove(bibleStyles.active)
                options[i].classList.remove(bibleStyles.show)
            }
        }
        
        //-----Compare clicked verse with saved verse(s) and adjust saved verse(s) accordingly-----
        const clickedID: string = e.target?.dataset?.verseIdSelector
        const clickedNum: number = parseInt(e.target?.dataset?.verseNumber)
        const savedID: string[] = bible.selectedPassage.id
        const savedNum: number[] = bible.selectedPassage.number

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
                } else if (clickedNum == savedNum[0]) {
                    dispatch(setSelectedPassage(initialState.selectedPassage))
                }
            } else if (savedNum.length == 2) {
                dispatch(setSelectedPassage({
                    id: [clickedID],
                    number: [clickedNum]
                }))
            }
        } 
    }

    //-----Fetch list of all books based on bible version and save to state-----
    const fetchBooks = async (): Promise<void> => {
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/books`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })
        dispatch(setBooks(res.data.data))
    }

    //-----Fetch list of all chapters based on bible version and book and save to state-----
    const fetchChapters = async (bookID): Promise<void> => {
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/books/${bookID}/chapters`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })
        dispatch(setChapters(res.data.data))
    }

    //-----Fetch chapter based on bible version and chapter id-----
    //-----Save verses in chapter object to state-----
    const fetchChapter = async (chapter): Promise<void> => {
        const chapterID = chapter.id 
        const queryParams: string = 'include-verse-spans=true'
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
        setSelectedChapter(chapter.number)
    }

    //-----Save passage to database-----
    const savePassageToDb = async (data: any, e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        // if (!bible.selectedPassage.id.length) return
        // const passage = 
        // bible.selectedPassage.id.length == 2 ? `${bible.selectedPassage.id[0]}-${bible.selectedPassage.id[1]}`
        // : bible.selectedPassage.id.length == 1 ? `${bible.selectedPassage.id[0]}` : null
        
        const saveBtn = e.target as HTMLButtonElement
        const res = await axios.post('/api/postVerse', {
            username: user.username,
            content: data.content,
            psgID: data.id,
            reference: data.reference,
        })

        if (res?.data?._id) {
            dispatch(setUser(res.data))
            // localStorage.setItem('user', JSON.stringify(res?.data))

            saveBtn.innerText = 'Saved'
            setTimeout(() => {
                dispatch(setSelectedPassage(initialState.selectedPassage))
            }, 1000)
        }

    }

    //-----Fetch passage object-----
    const fetchPassage = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        if (!bible.selectedPassage.id.length) return

        const queryParams: string = 'include-verse-spans=true'
        const passageID: string = bible.selectedPassage.id.length == 1 ? `${bible.selectedPassage.id[0]}` : `${bible.selectedPassage.id[0]}-${bible.selectedPassage.id[1]}`
        
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/${user.bibleVersion}/passages/${passageID}?${queryParams}`, {
            headers: {
                'api-key': `${process.env.API_KEY}`
            }
        })

        savePassageToDb(res.data.data, e)
    }

    //-----Reset state verses, state selected passage, content text and chapterBtn text-----
    //-----Set selected book state and fetch chapters with book id-----
    const handleBookClick = (book: IBook): void => {
        dispatch(setVerses(initialState.verses))
        dispatch(setSelectedPassage(initialState.selectedPassage))
        contentRef.current.innerHTML = ''
        chapterBtnRef.current.innerText = 'Choose Chapter'
        dispatch(setSelectedBook({
            name: book.name,
            id: book.id
        }))
        fetchChapters(book.id)
    }

    //-----Reset state selected passage / set chapter btn text / fetch chapter with chapter id-----
    const handleChapterClick = (chapter) => {
        dispatch(setSelectedPassage(initialState.selectedPassage))
        chapterBtnRef.current.innerText = chapter.number
        fetchChapter(chapter)
    }

    const toggleSelectors = (e): void => {
        const selectors = document.querySelector(`.${bibleStyles.selectors}`)

        if (selectors?.classList.contains(bibleStyles.show)) {
            e.target.innerText = 'Passage Selector'
            selectors?.classList.remove(bibleStyles.show)
        } else {
            e.target.innerText = 'Passage Text'
            selectors?.classList.add(bibleStyles.show)
        }
    }

    return (
        <div className={bibleStyles.container}>
            <button onClick={toggleSelectors} className={bibleStyles.selectorDropdownBtn}>Passage Selector</button>
            <div className={bibleStyles.selectors}>
                <div className={bibleStyles.selectorContainer} id='bookContainer'>
                    <button ref={bookBtnRef} onClick={toggleBookList} className={bibleStyles.selectorBtn} id='bookBtn'>{bible.selectedBook.name ? bible.selectedBook.name : 'Choose Book'}</button>
                    <div ref={bookDropRef} className={bibleStyles.options} id='books'>
                    {
                        bible.books.map((book, i) => (
                            <button onClick={() => handleBookClick(book)} key={i}>{book.name}</button>
                        ))
                    }
                    </div>
                </div>

                <div className={bibleStyles.selectorContainer} id='chapterContainer'>
                    <button ref={chapterBtnRef} onClick={toggleChapterList} className={bibleStyles.selectorBtn} id='chapterBtn'>Choose Chapter</button>
                    <div ref={chapterDropRef} className={bibleStyles.options} id='chapters'>
                    {
                        bible.chapters.map((chapter, i) => (
                            <button onClick={() => handleChapterClick(chapter)} key={i}>{chapter.number}</button>
                        ))
                    }
                    </div>
                </div>

                <h5 className={bibleStyles.versesLabel}>{
                    bible.selectedPassage.id[1]
                    ? bible.selectedPassage.id[0] + '-' + bible.selectedPassage.id[1]
                    : bible.selectedPassage.id[0]
                        ? bible.selectedPassage.id[0]
                        : 'Select Verse or Range of Verses'
                }</h5>

                {
                    bible.selectedPassage.id.length 
                    ? <button onClick={fetchPassage} className={bibleStyles.savePsgBtn}>Save Passage</button>
                    : null
                }

                <div className={bibleStyles.verseSelection}>
                    {
                        bible.verses.map((verse, i) => (
                            <button className={bibleStyles.verseNum} key={i} data-verse-id-selector={verse} data-verse-number={i+1}>{i + 1}</button>
                        ))
                    }
                </div>
            </div>
            <h2 className={bibleStyles.passageTitle}>{bible.selectedBook.name} {selectedChapter}</h2>
            <div ref={contentRef} className={bibleStyles.content}></div>
        </div>
    )
}

export default Bible