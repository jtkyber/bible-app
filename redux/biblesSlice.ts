import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ILanguages {
    id: string
    name: string
}

interface InitialState {
    allBibles: any[]
    languages: ILanguages[]
}

const initialState: InitialState = {
    allBibles: [],
    languages: []
}

export const biblesSlice = createSlice({
    name: 'biblesReducer',
    initialState,
    reducers: {
        setBibles: (state, action: PayloadAction<any[]>) => {
            state.allBibles = action.payload || []
        },
        setLanguages: (state, action: PayloadAction<ILanguages[]>) => {
            state.languages = action.payload || []
        },
    }
})

export const { setBibles, setLanguages } = biblesSlice.actions

export default biblesSlice.reducer