import { configureStore } from '@reduxjs/toolkit'
import user from './userSlice'
import bible from './bibleSlice'
import categories from './categoriesSlice'

export const store = configureStore({
    reducer: {
        user: user,
        bible: bible,
        categories: categories
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch