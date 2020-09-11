import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const login = createAsyncThunk(
    'auth/login',
    async (_, { dispatch }) => {
        let res = await fetch('/auth/login');
        if (res.ok) {
            let data = await res.json();
            if (data.user) {
                dispatch(loggedIn(data.user))
            }
        }
        else if (res.status >= 500) {
            throw Error("Request Error")
        }
        else if (res.status >= 400) {
            dispatch(loggedOut())
        }
        return null;
    }
)
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        await fetch('/auth/logout');
        dispatch(loggedOut())
        window.location = "/login";
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        status: "idle", //or "loading", "error"
        user: null
    },
    reducers: {
        loggedIn(state, action) {
            state.isAuthenticated = true
            state.user = action.payload
        },
        loggedOut(state) {
            state.isAuthenticated = false
            state.user = null
        },
        userUpdated(state, action) {
            let user = action.payload
            state.user = user
        }
    },
    extraReducers: {
        [login.rejected]: state => {
            state.status = "error"
        },
        [login.pending]: state => {
            state.status = "loading"
        },
        [login.fulfilled]: state => {
            state.status = "idle"
        }
    }
})

let { actions, reducer } = authSlice;
export const { loggedIn, loggedOut, userUpdated } = actions;
export default reducer;