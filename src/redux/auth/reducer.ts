import { createReducer } from '@reduxjs/toolkit';
import type { AuthState } from './dataTypes';
import { REDUCER_ACTIONS } from './actions';
import {getCookie} from "../../helpers/cookies";

const initialState: AuthState = {
    isAuthenticated: !!getCookie('XSRF-TOKEN'),
    isFailed: false,
    isProcessing: false,
    isSuccess: false,
};

const authReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(REDUCER_ACTIONS.setProcessing, (state, action) => {
            return {
                ...state,
                isProcessing: action.payload.isProcessing,
                isSuccess: false,
                isFailed: false,
            }
        })
        .addCase(REDUCER_ACTIONS.authLoginComplete, (state, action) => {
            const {isAuthenticated} = action.payload;

            return {
                ...state,
                isProcessing: false,
                isSuccess: isAuthenticated,
                isFailed: !isAuthenticated,
            }
        })
        .addCase(REDUCER_ACTIONS.getCurrentUserComplete, (state, action) => {
            const isAuthenticated: boolean = (
                action.payload.id !== null && action.payload.id !== undefined &&
                action.payload.email?.length > 0 &&
                action.payload.name?.length > 0
            );

            if(isAuthenticated){
                state.user = action.payload;
            }

            state.isProcessing = false;
            state.isSuccess = true;
            state.isFailed = false;
            state.isAuthenticated = isAuthenticated;
        })
        .addCase(REDUCER_ACTIONS.authLogoutComplete, (state) => {
            state.isAuthenticated = false;
        });
});

export default authReducer;
