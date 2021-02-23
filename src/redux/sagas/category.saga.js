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

function* categorySaga() {
    yield takeEvery('FETCH_CATEGORIES', fetchCategorySaga);
};

export default categorySaga;