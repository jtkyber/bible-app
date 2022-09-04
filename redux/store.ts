import { configureStore } from '@reduxjs/toolkit'
import biblesReducer from './biblesSlice'
import user from './userSlice'

export const store = configureStore({
    reducer: {
        bibles: biblesReducer,
        user: user
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch