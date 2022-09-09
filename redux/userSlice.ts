import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "../models/userModel"

const initialState: IUser = {
    _id: '',
    username: '',
    password: '',
    categories: [],
    passages: [],
    language: '',
    bibleVersion: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state._id = action.payload._id
            state.username = action.payload.username
            state.password = action.payload.password
            state.categories = action.payload.categories
            state.passages = action.payload.passages
            state.language = action.payload.language
            state.bibleVersion = action.payload.bibleVersion
        },
        clearUser: (state) => {
            state._id = ''
            state.username = ''
            state.password = ''
            state.categories = []
            state.passages = []
            state.language = ''
            state.bibleVersion = ''
        },
    }
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer