import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { authReducer, authSaga } from './auth';
import { homeReducer, homeSaga } from './home-page';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        auth: authReducer,
        homePage: homeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(sagaMiddleware),
});

sagaMiddleware.run(authSaga);
sagaMiddleware.run(homeSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
