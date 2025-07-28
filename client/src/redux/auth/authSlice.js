import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('jwt_token');

let user = null;
if (token) {
    try {
        user = jwtDecode(token); // ako postoji user, dekodiraj token
    } catch {
        user = null; // ako dekodiranje ne uspije, postavi user na null
    }
}

const initialState = {
    isAuthenticated: !!token && !!user, // true je ako token i user postoje 
    user, // rezultat dekodiranja tokena
    token,
    loading: false //koristi se da označi da li je auth operacija u toku.
};

const authSlice = createSlice({
    name: 'auth', // ime slice-a
    initialState,
    reducers: {
        loginSuccess(state, action) {
            const { token } = action.payload;
            state.token = token;
            state.user = jwtDecode(token);
            state.isAuthenticated = true;
            localStorage.setItem('jwt_token', token);
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('jwt_token');
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
