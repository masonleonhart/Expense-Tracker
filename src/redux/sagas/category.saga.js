import axios from 'axios';
import { takeEvery, put } from 'redux-saga/effects';

function* fetchCategorySaga() {
    try {
        const response = yield axios.get('/api/category/');
        yield put({ type: 'SET_CATEGORIES', payload: response.data });
    } catch (error) {
        console.log('Error in fetching categories', error);
    };
};

function* addNewCategorySaga(action) {
    try {
        yield axios.post('/api/category', action.payload);
        yield put({ type: 'FETCH_CATEGORIES' });
        yield put({ type: 'RESET_NEW_CATEGORY_REDUCER' });
    } catch (error) {
        console.log('Error in adding new expense', error);
    };
};

function* deleteCategorySaga(action) {
    try {
        yield axios.delete(`/api/category/${action.payload}`);
        yield put({ type: 'FETCH_CATEGORIES' });
    } catch (error) {
        console.log('Error in adding new expense', error);
    };
};

function* categorySaga() {
    yield takeEvery('FETCH_CATEGORIES', fetchCategorySaga);
    yield takeEvery('ADD_NEW_CATEGORY', addNewCategorySaga);
    yield takeEvery('DELETE_CATEGORY', deleteCategorySaga);
};

export default categorySaga;