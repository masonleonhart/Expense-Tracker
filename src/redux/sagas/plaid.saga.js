import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createLinkTokenSaga() {
    try {
        const response = yield axios.post('/api/plaid/create_link_token');
        yield put({ type: 'SET_LINK_TOKEN', payload: response.data.link_token });
    } catch (error) {
        console.log('Error in creating link token', error);
    };
};

function* plaidSaga() {
    yield takeLatest('FETCH_LINK_TOKEN', createLinkTokenSaga);
};

export default plaidSaga;