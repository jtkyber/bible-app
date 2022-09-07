import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IBook {
    name: string,
    id: string
}

interface InitialState {
    selectedBook: IBook
}

const initialState: InitialState = {
    selectedBook: {
        name: '',
        id: ''
    }
}

export const biblesSlice = createSlice({
    name: 'bible',
    initialState,
    reducers: {
        setSelectedBook: (state, action: PayloadAction<IBook>) => {
            state.selectedBook = action.payload
        },
        clearBible: (state) => {
            state.selectedBook = {
                name: '',
                id: ''
            }
        },
    }
})

export const { setSelectedBook, clearBible } = biblesSlice.actions

export default biblesSlice.reducer