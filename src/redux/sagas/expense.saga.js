import axios from 'axios';
import { takeEvery, put } from 'redux-saga/effects';

function* fetchExpensesSaga() {
    try {
        const response = yield axios.get('/api/expense');
        yield put({ type: 'SET_EXPENSES', payload: response.data });
    } catch (error) {
        console.log('Error in fetching expenses', error);
    };
};

function* expenseSaga() {
    yield takeEvery('FETCH_EXPENSES', fetchExpensesSaga);
};

export default expenseSaga;