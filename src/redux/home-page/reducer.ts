import { createReducer } from '@reduxjs/toolkit';
import type { HomePageStateType } from './dataTypes';
import { HOME_REDUCER_ACTIONS } from './actions';

const initialState: HomePageStateType = {
    topics: [],
    articles: {},
    isFailed: false,
    isProcessing: false,
    isSuccess: false,
    authors: {},
    sources: {},
    userFilterSelections: {}
};

const homePageReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(HOME_REDUCER_ACTIONS.setProcessing, (state, action) => {
            state.isProcessing = action.payload.isProcessing;
            state.isSuccess = false;
            state.isFailed = false;
        })
        .addCase(HOME_REDUCER_ACTIONS.articlesFetchCompleted, (state, action) => {
            state.articles = action.payload.articles;
            state.topics = action.payload.topics;
            state.authors = action.payload.authors;
            state.sources = action.payload.sources;
            state.isProcessing = false;
            state.isSuccess = true;
            state.isFailed = false;
        })
        .addCase(HOME_REDUCER_ACTIONS.updateUserFilterSelectionCompleted, (state, action) => {
            let valueObj = action.payload.value as { [key: string]: string[] };
            let value = action.payload.value as string;
            if(action.payload.type === "userFilterSelections"){
                state.userFilterSelections = valueObj || {}
            } else {
                const key = action.payload.key;
                const selection = state.userFilterSelections[key] || [];
                value = action.payload.value as string;

                if (selection.includes(value)) {
                    const updatedSelection = selection.filter(item => item !== value);

                    if (updatedSelection.length === 0) {
                        const { [key]: _, ...remainingSelections } = state.userFilterSelections;
                        state.userFilterSelections = remainingSelections;
                    } else {
                        state.userFilterSelections[key] = updatedSelection;
                    }
                } else {
                    selection.push(value);
                    state.userFilterSelections = {
                        ...state.userFilterSelections,
                        [key]: selection
                    };
                }
            }

            state.isProcessing = false;
            state.isSuccess = true;
            state.isFailed = false;
        })
});

export default homePageReducer;
