import { call, put, takeEvery } from 'redux-saga/effects';
import { SAGA_ACTION_TYPES } from './actionTypes';
import { HOME_SAGA_ACTIONS } from './actions';
import {getApi_getAllArticles, postApi_updateInsertUserPreferences} from "../../apis";
import {ArticlesFetchApiResponseType} from './dataTypes';
import {AxiosResponseType} from "../../interfaces-types/AxiosResponseType";
import {HOME_REDUCER_ACTIONS} from "./actions";
import {UserResponseType} from "../../interfaces-types/UserAuthTypes";
import {toast} from "react-toastify";

function* getAllArticles(action: ReturnType<typeof HOME_SAGA_ACTIONS.fetchArticles>) {
    try {
        yield put(HOME_REDUCER_ACTIONS.setProcessing({ isProcessing: true }));
        const response: AxiosResponseType<ArticlesFetchApiResponseType> = yield call(getApi_getAllArticles)
        yield put(HOME_REDUCER_ACTIONS.articlesFetchCompleted(response.data.data));
    } catch (error) {
        console.error("SAGA ERROR =>", error);
    }finally {
        yield put(HOME_REDUCER_ACTIONS.setProcessing({ isProcessing: false }));
    }
}

function* updateUserFilterSelection(action: ReturnType<typeof HOME_SAGA_ACTIONS.updateUserFilterSelection>) {
    try {
        yield put(HOME_REDUCER_ACTIONS.updateUserFilterSelectionCompleted({...action.payload,type: "singleUpdate"}));
    } catch (error) {
        console.error("SAGA ERROR =>", error);
    }finally {
        yield put(HOME_REDUCER_ACTIONS.setProcessing({ isProcessing: false }));
    }
}

function* updateUserPreferences(action: ReturnType<typeof HOME_SAGA_ACTIONS.updateUserPreferences>) {
    try {
        yield put(HOME_REDUCER_ACTIONS.setProcessing({ isProcessing: true }));
        const response: AxiosResponseType<UserResponseType> =
            yield call(postApi_updateInsertUserPreferences, action.payload);
        if (response?.data?.data?.user?.preferences?.userSelections?.value) {
            yield put(HOME_REDUCER_ACTIONS.updateUserFilterSelectionCompleted({
                type: "userFilterSelections",
                key: action.payload.key,
                value: response.data.data.user.preferences.userSelections.value
            }));
            toast("Preferences updated.", {
                autoClose: 2000
            })
        }
    } catch (error) {
        console.error("SAGA ERROR =>", error);
    }finally {
        yield put(HOME_REDUCER_ACTIONS.setProcessing({ isProcessing: false }));
    }
}

function* homePageSaga() {
    yield takeEvery(SAGA_ACTION_TYPES.FETCH_ARTICLES, getAllArticles);
    yield takeEvery(SAGA_ACTION_TYPES.UPDATE_USER_FILTER_SELECTIONS, updateUserFilterSelection);
    yield takeEvery(SAGA_ACTION_TYPES.UPDATE_USER_PREFERENCE, updateUserPreferences);
}

export default homePageSaga;
