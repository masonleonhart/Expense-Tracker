import axios from 'axios';
import { takeLatest, put } from 'redux-saga/effects';

function* fetchUncategorizedSaga() {
    try {
        const response = yield axios.get('/api/expense/uncategorized');
        yield put({ type: 'SET_UNCATEGORIZED', payload: response.data });
    } catch (error) {
        console.log('Error in fetching expenses', error);
    };
};

function* fetchDailyExpensesSaga(action) {
    try {
        const response = yield axios.get(`/api/expense/daily/${action.payload.currentDay}`);
        yield put({ type: 'SET_DAILY_EXPENSES', payload: response.data });
        yield put({ type: 'SET_DAY', payload: action.payload.incomingDay });
    } catch (error) {
        console.log('Error in fetching daily expenses', error);
    };
};

function* fetchMonthlyExpensesSaga(action) {
    try {
        const response = yield axios.get(`/api/expense/monthly/${action.payload.currentDay}`);
        yield console.log(response.data);
    } catch (error) {
        console.log('Error in fetching daily expenses', error);
    };
};

function* addNewExpenseSaga(action) {
    try {
        yield axios.post('/api/expense/expense', action.payload);
        yield put({ type: 'FETCH_CATEGORIES' });
        yield put({ type: 'FETCH_UNCATEGORIZED' });
        yield put({ type: 'RESET_NEW_EXPENSE_REDUCER' });
    } catch (error) {
        console.log('Error in adding new expense', error);
    };
};

function* addNewIncomeSaga(action) {
    try {
        yield axios.post('/api/expense/income', action.payload);
        yield put({ type: 'FETCH_CATEGORIES' });
        yield put({ type: 'FETCH_UNCATEGORIZED' });
        yield put({ type: 'RESET_NEW_INCOME_REDUCER' });
    } catch (error) {
        console.log('Error in adding new income', error);
    };
};

function* updateExpenseCategorySaga(action) {
    try {
        yield axios.put(`/api/expense/unassigned/${action.payload.expense_id}`, { category_id: action.payload.category_id });
        yield put({ type: 'FETCH_CATEGORIES' });
        yield put({ type: 'FETCH_UNCATEGORIZED' });
    } catch (error) {
        console.log('Error in updating expense category', error);
    };
};

function* deleteExpenseSaga(action) {
    try {
        yield axios.delete(`/api/expense/${action.payload}`);
        yield put({ type: 'FETCH_CATEGORIES' });
        yield put({ type: 'FETCH_UNCATEGORIZED' });
    } catch (error) {
        console.log('Error in updating expense category', error);
    };
};

function* expenseSaga() {
    yield takeLatest('FETCH_UNCATEGORIZED', fetchUncategorizedSaga);
    yield takeLatest('FETCH_DAILY_EXPENSES', fetchDailyExpensesSaga);
    yield takeLatest('FETCH_MONTHLY_EXPENSES', fetchMonthlyExpensesSaga);
    yield takeLatest('ADD_NEW_EXPENSE', addNewExpenseSaga);
    yield takeLatest('UPDATE_EXPENSE_CATEGORY', updateExpenseCategorySaga);
    yield takeLatest('DELETE_EXPENSE', deleteExpenseSaga);
    yield takeLatest('ADD_NEW_INCOME', addNewIncomeSaga);
};

export default expenseSaga;