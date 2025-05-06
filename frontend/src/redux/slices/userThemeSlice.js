import { createSlice } from "@reduxjs/toolkit";

const userThemeSlice = createSlice({
    name: "userTheme",
    initialState: {
        themes: localStorage.getItem("theme") || "chocolate",
    },
    reducers: {
        setTheme: (state, action) => {
            state.themes = action.payload;
            localStorage.setItem("theme", action.payload);
        }
    }
});

export const { setTheme } = userThemeSlice.actions;
export default userThemeSlice.reducer;
