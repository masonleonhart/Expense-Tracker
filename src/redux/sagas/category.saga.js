import axios from 'axios';
import { takeLatest, put } from 'redux-saga/effects';

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
        yield put({ type: 'FETCH_EXPENSES' });
    } catch (error) {
        console.log('Error in adding new expense', error);
    };
};

function* categorySaga() {
    yield takeLatest('FETCH_CATEGORIES', fetchCategorySaga);
    yield takeLatest('ADD_NEW_CATEGORY', addNewCategorySaga);
    yield takeLatest('DELETE_CATEGORY', deleteCategorySaga);
};

export default categorySaga;