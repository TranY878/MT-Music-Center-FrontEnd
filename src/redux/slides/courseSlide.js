import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    search: '',
}

export const courseSlide = createSlice({
    name: 'course',
    initialState,
    reducers: {
        searchCourse: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { searchCourse } = courseSlide.actions

export default courseSlide.reducer