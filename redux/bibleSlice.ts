import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IBook {
    name: string,
    id: string
}

interface IPassage {
    id: string[],
    number: number[]
}

interface InitialState {
    books: any[]
    chapters: any[]
    verses: string[]
    selectedBook: IBook
    selectedPassage: IPassage
}

export const initialState: InitialState = {
    books: [],
    chapters: [],
    verses: [],
    selectedBook: {
        name: '',
        id: ''
    },
    selectedPassage: {
        id: [],
        number: []
    },
}

export const biblesSlice = createSlice({
    name: 'bible',
    initialState,
    reducers: {
        setBooks: (state, action: PayloadAction<any[]>) => {
            state.books = action.payload
        },
        setChapters: (state, action: PayloadAction<any[]>) => {
            state.chapters = action.payload.filter(chap => parseInt(chap.number))
        },
        setVerses: (state, action: PayloadAction<string[]>) => {
            state.verses = action.payload
        },
        setSelectedBook: (state, action: PayloadAction<IBook>) => {
            state.selectedBook = action.payload
        },
        setSelectedPassage: (state, action: PayloadAction<IPassage>) => {
            state.selectedPassage = action.payload
        },
        clearBible: (state) => {
            state.books = []
            state.selectedBook = initialState.selectedBook
            state.selectedPassage = initialState.selectedPassage
        },
    }
})

export const { setBooks, setChapters, setVerses, setSelectedBook, setSelectedPassage, clearBible } = biblesSlice.actions

export default biblesSlice.reducer