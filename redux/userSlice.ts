import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "../models/userModel"

interface InitialState extends IUser {
    id: string
}

const initialState: InitialState = {
    username: '',
    password: '',
    categories: [],
    passages: [],
    language: '',
    bibleVersion: '',
    id: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser & any>) => {
            state.username = action.payload.username
            state.password = action.payload.password
            state.categories = action.payload.categories
            state.passages = action.payload.passages
            state.language = action.payload.language
            state.bibleVersion = action.payload.bibleVersion
            state.id = action.payload._id
        },
        clearUser: (state) => {
            state.username = ''
            state.password = ''
            state.categories = []
            state.passages = []
            state.language = ''
            state.bibleVersion = ''
            state.id = ''
        },
    }
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer