import axios from 'axios';
import { takeLatest, put } from 'redux-saga/effects';

function* fetchUncategorizedSaga() {
    // fetches all uncategorized transactions and sends them to the uncategorized transactions reducer
    try {
        const response = yield axios.get('/api/expense/uncategorized');
        yield put({ type: 'SET_UNCATEGORIZED', payload: response.data });
    } catch (error) {
        console.log('Error in fetching expenses', error);
    };
};

function* fetchSubcatTransactionsSaga(action) {
    // sets the subcategory view name for the modal, fetches all transactions in that subcategory and sends them to the 
    // subcategory transaction reducer
    try {
        yield put({ type: 'SET_SUBCAT_VIEW_NAME', payload: action.payload });
        const response = yield axios.get(`/api/expense/subcategory/transactions/${action.payload}`);
        yield put({ type: 'SET_SUBCAT_TRANSACTIONS', payload: response.data });
    } catch (error) {
        console.log('Error in fetching subcategory transactions', error);
    };
};

function* fetchDailyExpensesSaga(action) {
    try {
        // sets the current day and fetches all expenses for that day, fetches all transactions for that day and sends
        // them to the daily expenses reducer
        yield put({ type: 'SET_DAY', payload: action.payload.incomingDay });
        const response = yield axios.get(`/api/expense/daily/${action.payload.currentDay}`);
        yield put({ type: 'SET_DAILY_EXPENSES', payload: response.data });
    } catch (error) {
        console.log('Error in fetching daily expenses', error);
    };
};

function* fetchMonthlyExpensesSaga(action) {
    try {
        // fetches all monthly transactions and sends them to the monthlly expenses reducer
        const response = yield axios.get(`/api/expense/monthly/${action.payload}`);
        yield put({ type: 'SET_MONTHLY_EXPENSES', payload: response.data });
    } catch (error) {
        console.log('Error in fetching daily expenses', error);
    };
};

function* fetchDailySumsSaga(action) {
    try {
        // sets the current month and fetches all of the daily sums for the calendar, then sends the daily sums
        // to the daily sums reducer
        yield put({ type: 'SET_MONTH', payload: action.payload.incomingMonth });
        const response = yield axios.get(`/api/expense/monthly/dailysums/${action.payload.currentMonth}`);
        yield put({ type: 'SET_DAILY_SUMS', payload: response.data });
    } catch (error) {
        console.log('Error in fetching daily sums', error);
    };
};

function* addNewExpenseSaga(action) {
    try {
        // adds a new expense to the db and refreshes the categories and uncategorized transactions lists, then
        // resets the values for the new expense form
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
        // adds a new income to the db and refreshes the categories and uncategorized transactions lists, then
        // resets the values for the new income form
        yield axios.post('/api/expense/income', action.payload);
        yield put({ type: 'FETCH_CATEGORIES' });
        yield put({ type: 'FETCH_UNCATEGORIZED' });
        yield put({ type: 'RESET_NEW_INCOME_REDUCER' });
    } catch (error) {
        console.log('Error in adding new income', error);
    };
};

function* updateExpenseCategorySaga(action) {
    // assigns a category to the an uncategorized transaction and refreshes the category and uncategorized transaction lists
    try {
        yield axios.put(`/api/expense/unassigned/${action.payload.expense_id}`, { category_id: action.payload.category_id });
        yield put({ type: 'FETCH_CATEGORIES' });
        yield put({ type: 'FETCH_UNCATEGORIZED' });
    } catch (error) {
        console.log('Error in updating expense category', error);
    };
};

function* deleteExpenseSaga(action) {
    // deletes an expense from the database and refreshes the category and uncategorized transaction lists
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
    yield takeLatest('FETCH_SUBCAT_TRANSACTIONS', fetchSubcatTransactionsSaga);
    yield takeLatest('FETCH_DAILY_EXPENSES', fetchDailyExpensesSaga);
    yield takeLatest('FETCH_DAILY_SUMS', fetchDailySumsSaga);
    yield takeLatest('FETCH_MONTHLY_EXPENSES', fetchMonthlyExpensesSaga);
    yield takeLatest('ADD_NEW_EXPENSE', addNewExpenseSaga);
    yield takeLatest('UPDATE_EXPENSE_CATEGORY', updateExpenseCategorySaga);
    yield takeLatest('DELETE_EXPENSE', deleteExpenseSaga);
    yield takeLatest('ADD_NEW_INCOME', addNewIncomeSaga);
};

export default expenseSaga;