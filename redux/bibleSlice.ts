import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IBook {
    name: string,
    id: string
}

interface IChapter {
    number: string,
    id: string
}

interface InitialState {
    books: any[]
    chapters: any[]
    selectedBook: IBook
    selectedChapter: IChapter
}

const initialState: InitialState = {
    books: [],
    chapters: [],
    selectedBook: {
        name: '',
        id: ''
    },
    selectedChapter: {
        number: '',
        id: ''
    }
}

export const biblesSlice = createSlice({
    name: 'bible',
    initialState,
    reducers: {
        setBooks: (state, action: PayloadAction<any[]>) => {
            state.books = action.payload
        },
        setChapters: (state, action: PayloadAction<any[]>) => {
            state.chapters = action.payload
        },
        setSelectedBook: (state, action: PayloadAction<IBook>) => {
            state.selectedBook = action.payload
        },
        setSelectedChapter: (state, action: PayloadAction<IChapter>) => {
            state.selectedChapter = action.payload
        },
        clearBible: (state) => {
            state.books = []
            state.selectedBook = { name: '', id: '' }
            state.selectedChapter = { number: '', id: '' }
        },
    }
})

export const { setBooks, setChapters, setSelectedBook, setSelectedChapter, clearBible } = biblesSlice.actions

export default biblesSlice.reducer