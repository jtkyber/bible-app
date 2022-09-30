import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IPassageState } from "./userSlice"

export interface ISelectedCat {
    _id: string,
    name: string
}

export interface ICat {
    selectedCat: ISelectedCat
    selectedCatPassages: IPassageState[]
    addingPassage: boolean
    passagesNotInCat: IPassageState[]
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
        setSelectedCatPassages: (state, action: PayloadAction<IPassageState[]>) => {
            state.selectedCatPassages = action.payload
        },
        setAddingPassage: (state, action: PayloadAction<boolean>) => {
            state.addingPassage = action.payload
        },
        setPassagesNotInCat: (state, action: PayloadAction<IPassageState[]>) => {
            state.passagesNotInCat = action.payload
        }
    }
})

export const { setSelectedCat, setSelectedCatPassages, setAddingPassage, setPassagesNotInCat } = categoriesSlice.actions

export default categoriesSlice.reducer