import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createLinkTokenSaga() {
    try {
        const response = yield axios.post('/api/plaid/link_token');
        yield put({ type: 'SET_LINK_TOKEN', payload: response.data.link_token });
    } catch (error) {
        console.log('Error in creating link token', error);
    };
};

function* fetchPlaidTransactionsSaga() {
    try {
        const response = yield axios.get('/api/plaid/transactions')
        yield console.log(response.data);
        yield put({ type: 'FETCH_EXPENSES' });
    } catch (error) {
        console.log('Error in fetching plaid transactions');
        yield put({ type: 'FETCH_EXPENSES' });
    };
};

function* plaidSaga() {
    yield takeLatest('FETCH_LINK_TOKEN', createLinkTokenSaga);
    yield takeLatest('FETCH_PLAID_TRANSACTIONS', fetchPlaidTransactionsSaga);
};

export default plaidSaga;