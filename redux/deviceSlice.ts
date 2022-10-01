import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: { isMobile: boolean } = {
    isMobile: false
}

export const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload
        }
    }
})

export const { setIsMobile } = deviceSlice.actions

export default deviceSlice.reducer;