import { call, put, takeEvery } from 'redux-saga/effects';
import { SAGA_ACTION_TYPES } from './actionTypes';
import { SAGA_ACTIONS, REDUCER_ACTIONS } from './actions';
import {postApi_logUserIn, postApi_createNewAccount, getApi_userInfo} from "../../apis";
import {AxiosResponse} from "axios";
import { AxiosError } from 'axios';
import {UserResponseInnerType, UserResponseType} from "../../interfaces-types/UserAuthTypes";
import {HOME_REDUCER_ACTIONS} from "../home-page/actions";

function* handleLogin(action: ReturnType<typeof SAGA_ACTIONS.authLogin>) {
    try {
        yield put(REDUCER_ACTIONS.setProcessing({ isProcessing: true }));
        const response: AxiosResponse<any> = yield call(postApi_logUserIn, action.payload);
        if(response.data?.data?.token && Object.keys(response.data?.data?.user).length > 0) {
            yield put(REDUCER_ACTIONS.authLoginComplete({ isAuthenticated: true }));
            window.location.href = window.location.origin;
        }
    } catch (error) {
        console.error("SAGA ERROR =>", error);
    }
}

function* handleCreateNewAccount(action: ReturnType<typeof SAGA_ACTIONS.createAccount>) {
    try {
        yield put(REDUCER_ACTIONS.setProcessing({ isProcessing: true }));
        const response: AxiosResponse<any> = yield call(postApi_createNewAccount, action.payload);
        if (action.payload.onSuccessCallback){
            action.payload.onSuccessCallback();
        }
    } catch (error) {
        console.error("SAGA ERROR =>", error);
        if (error instanceof AxiosError) {
            if (action.payload.onErrorCallback){
                action.payload.onErrorCallback(error?.response?.data?.message);
            }
        }
    } finally {
        yield put(REDUCER_ACTIONS.setProcessing({ isProcessing: false}));
    }
}

function* handleFetchCurrentUser(action: ReturnType<typeof SAGA_ACTIONS.fetchActiveUser>) {
    try {
        yield put(REDUCER_ACTIONS.setProcessing({ isProcessing: true }));
        const response: AxiosResponse<{ data: UserResponseInnerType }> = yield call(getApi_userInfo);
        if (response?.data?.data?.preferences?.userSelections?.value &&
            typeof response.data.data.preferences.userSelections.value === 'object'){
                yield put(HOME_REDUCER_ACTIONS.updateUserFilterSelectionCompleted({
                    type: "userFilterSelections",
                    key: "",
                    value: response.data.data.preferences.userSelections.value
                }));
        }
        yield put(REDUCER_ACTIONS.getCurrentUserComplete(response.data.data));
    } catch (error) {
        console.error("SAGA ERROR =>", error);
    } finally {
        yield put(REDUCER_ACTIONS.setProcessing({ isProcessing: false}));
    }
}

function* authSaga() {
    yield takeEvery(SAGA_ACTION_TYPES.AUTH_LOGIN, handleLogin);
    yield takeEvery(SAGA_ACTION_TYPES.AUTH_CREATE_NEW_ACCOUNT, handleCreateNewAccount);
    yield takeEvery(SAGA_ACTION_TYPES.AUTH_GET_CURRENT_USER, handleFetchCurrentUser);
}

export default authSaga;
