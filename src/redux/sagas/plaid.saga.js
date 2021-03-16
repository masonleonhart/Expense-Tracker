import { ErrorOutlined } from '@material-ui/icons';
import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createLinkTokenSaga(action) {
    // fetches a link token from the plaid router and sets it in the link token reducer
    try {
        const response = yield axios.post('/api/plaid/link_token', {access_token: action.payload});
        yield put({ type: 'SET_LINK_TOKEN', payload: response.data.link_token });
    } catch (error) {
        console.log('Error in creating link token', error);
    };
};

function* fetchPlaidTransactionsSaga() {
    // fetches all plaid transactions and resets the uncategorized transacation and subcategory lists
    try {
        yield axios.get('/api/plaid/transactions');
        yield put({ type: 'FETCH_UNCATEGORIZED' });
        yield put({ type: 'FETCH_SUBCATEGORIES' });
    } catch (error) {
        // if there is an error in fetching plaid transactions, still refresh the uncategorized transaction list and
        // set the plaid error reducer to true
        console.log('Error in fetching plaid transactions', error);

        if (error.response.status === 400) {
            yield put({ type: 'SET_PLAID_ERROR_TRUE' });
            yield put({ type: 'FETCH_UNCATEGORIZED' });
        };
    };
};

function* plaidSaga() {
    yield takeLatest('FETCH_LINK_TOKEN', createLinkTokenSaga);
    yield takeLatest('FETCH_PLAID_TRANSACTIONS', fetchPlaidTransactionsSaga);
};

export default plaidSaga;