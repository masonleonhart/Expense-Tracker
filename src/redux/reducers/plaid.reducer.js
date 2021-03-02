import { combineReducers } from 'redux';

const linkToken = (state = '', action) => {
    // manages link token for current client
    switch (action.type) {
        case 'SET_LINK_TOKEN':
            return action.payload;
        default:
            return state;
    };
};

const plaidError = (state = false, action) => {
    // manages state for plaid error
    switch (action.type) {
        case 'SET_PLAID_ERROR_TRUE':
            return true;
        case 'SET_PLAID_ERROR_FALSE':
            return false;
        default:
            return state;
    };
};

export default combineReducers({
    linkToken,
    plaidError
});