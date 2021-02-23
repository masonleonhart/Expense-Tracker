import { combineReducers } from 'redux';

const linkToken = (state = '', action) => {
    switch (action.type) {
        case 'SET_LINK_TOKEN':
            return action.payload;
        default:
            return state;
    };
};

export default combineReducers({
    linkToken,
});