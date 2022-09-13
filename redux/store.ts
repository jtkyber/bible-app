import { configureStore } from '@reduxjs/toolkit'
import user from './userSlice'
import bible from './bibleSlice'
import catPassage from './catPassageSlice'

export const store = configureStore({
    reducer: {
        user: user,
        bible: bible,
        catPassage: catPassage
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch