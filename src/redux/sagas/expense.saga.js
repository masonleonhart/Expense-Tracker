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

function* addNewExpenseSaga(action) {
    try {
        yield axios.post('/api/expense', action.payload);
        yield put({ type: 'FETCH_EXPENSES' });
        yield put({ type: 'FETCH_CATEGORIES' });
    } catch (error) {
        console.log('Error in adding new expense', error);
    }
};

function* expenseSaga() {
    yield takeEvery('FETCH_EXPENSES', fetchExpensesSaga);
    yield takeEvery('ADD_NEW_EXPENSE', addNewExpenseSaga);
};

export default expenseSaga;