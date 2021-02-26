import axios from 'axios';
import { takeLatest, put } from 'redux-saga/effects';

function* fetchCategorySaga() {
    try {
        const responseOne = yield axios.get('/api/category/main');
        yield put({ type: 'SET_CATEGORIES', payload: responseOne.data });
    } catch (error) {
        console.log('Error in fetching categories', error);
    };
};

function* fetchSubcategorySaga() {
    try {
        const responseTwo = yield axios.get('/api/category/sub');
        yield put({ type: 'SET_SUBCATEGORIES', payload: responseTwo.data });
    } catch (error) {
        console.log('Error in fetching subcategories', error);
    };
};

function* fetchDailyCategoriesSaga(action) {
    try {
        const response = yield axios.get(`/api/category/daily/${action.payload}`);
        yield put({ type: 'SET_DAILY_CATEGORIES', payload: response.data });
    } catch (error) {
        console.log('Error in fetching daily categories', error);
    };
};

function* fetchMonthlyCategoriesSaga(action) {
    try {
        const response = yield axios.get(`api/category/monthly/${action.payload}`);
        yield put({ type: 'SET_MONTHLY_CATEGORIES', payload: response.data });
    } catch (error) {
        console.log('Error in fetching monthly categories', error);
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
        yield put({ type: 'FETCH_UNCATEGORIZED' });
    } catch (error) {
        console.log('Error in adding new expense', error);
    };
};

function* categorySaga() {
    yield takeLatest('FETCH_CATEGORIES', fetchCategorySaga);
    yield takeLatest('FETCH_SUBCATEGORIES', fetchSubcategorySaga);
    yield takeLatest('FETCH_DAILY_CATEGORIES', fetchDailyCategoriesSaga);
    yield takeLatest('FETCH_MONTHLY_CATEGORIES', fetchMonthlyCategoriesSaga);
    yield takeLatest('ADD_NEW_CATEGORY', addNewCategorySaga);
    yield takeLatest('DELETE_CATEGORY', deleteCategorySaga);
};

export default categorySaga;