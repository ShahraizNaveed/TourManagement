import { createContext, useEffect, useReducer } from 'react'

const initialState = {
    user: localStorage.getItem('user') != undefined ? JSON.parse(localStorage.getItem('user')) : null,
    loading: false,
    error: null
}

export const AuthContext = createContext(initialState)

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':

            return {
                user: null,
                loading: true,
                error: null
            }

        case 'LOGIN_SUCCESS':
            return {
                user: action.payload,
                loading: false,
                error: null
            }

        case 'LOGIN_FAIL':
            return {
                user: null,
                loading: false,
                error: action.payload
            }

        case 'REGISTER_SUCCESS':
            return {
                user: null,
                loading: false,
                error: null
            }

        case 'LOGOUT':
            return {
                user: null,
                loading: false,
                error: null
            }

        default:
            return state
    }
}


export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user))
    }, [state.user])

    return <AuthContext.Provider value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch
    }}>
        {children}
    </AuthContext.Provider>
}
