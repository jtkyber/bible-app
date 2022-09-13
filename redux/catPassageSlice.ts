import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IPassages } from "../models/userModel"

interface ICat {
    selectedCatPassages: IPassages[]
}

const initialState: ICat = {
    selectedCatPassages: []
}

export const catPassageSlice = createSlice({
    name: 'catPassage',
    initialState,
    reducers: {
        setSelectedCatPassages: (state, action: PayloadAction<IPassages[]>) => {
            state.selectedCatPassages = action.payload
        },
    }
})

export const { setSelectedCatPassages } = catPassageSlice.actions

export default catPassageSlice.reducer