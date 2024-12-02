import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    search: '',
}

export const teacherSlide = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        searchTeacher: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { searchTeacher } = teacherSlide.actions

export default teacherSlide.reducer