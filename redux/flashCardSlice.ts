import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IPassages } from "../models/userModel"

export interface IFlash {
    inFlashCardMode: boolean,
    shuffledCatPassages: IPassages[],
    index: number
}

export const initialState: IFlash = {
    inFlashCardMode: false,
    shuffledCatPassages: [],
    index: 0
}

export const flashCardSlice = createSlice({
    name: 'flashCards',
    initialState,
    reducers: {
        toggleInFlashCardMode: (state) => {
            state.inFlashCardMode = !state.inFlashCardMode
        },
        disableFlashCardMode: (state) => {
            state.inFlashCardMode = false
        },
        setShuffledCatPassages: (state, action: PayloadAction<IPassages[]>) => {
            state.shuffledCatPassages = action.payload
        },
        decrementIndex: (state) => {
            if (state.index === 0) state.index = state.shuffledCatPassages.length - 1
            else state.index -= 1
        },
        incrementIndex: (state) => {
            if (state.index === state.shuffledCatPassages.length - 1) state.index = 0
            else state.index += 1
        },
    }
})

export const { toggleInFlashCardMode, disableFlashCardMode, setShuffledCatPassages, decrementIndex, incrementIndex } = flashCardSlice.actions

export default flashCardSlice.reducer