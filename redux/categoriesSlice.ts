import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IPassages } from "../models/userModel"

interface ISelectedCat {
    _id: string,
    name: string
}

interface ICat {
    selectedCat: ISelectedCat
    selectedCatPassages: IPassages[]
    addingPassage: boolean
    passagesNotInCat: IPassages[]
}

export const initialState: ICat = {
    selectedCat: {
        _id: '',
        name: ''
    },
    selectedCatPassages: [],
    addingPassage: false,
    passagesNotInCat: []
}

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setSelectedCat: (state, action: PayloadAction<ISelectedCat>) => {
            state.selectedCat = action.payload
        },
        setSelectedCatPassages: (state, action: PayloadAction<IPassages[]>) => {
            state.selectedCatPassages = action.payload
        },
        setAddingPassage: (state, action: PayloadAction<boolean>) => {
            state.addingPassage = action.payload
        },
        setPassagesNotInCat: (state, action: PayloadAction<IPassages[]>) => {
            state.passagesNotInCat = action.payload
        },
    }
})

export const { setSelectedCat, setSelectedCatPassages, setAddingPassage, setPassagesNotInCat } = categoriesSlice.actions

export default categoriesSlice.reducer