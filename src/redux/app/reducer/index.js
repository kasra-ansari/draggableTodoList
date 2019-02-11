import {handleActions} from 'redux-actions';
import * as Actions from '../actions/constants';

const initialState = {
    data: {
        list: {},
        swap: {}
    }
};

export const AppReducers =  handleActions({
    [Actions.SET_DATA]: (state, action) => (
        {
            data: action.data
        }
    ),
}, initialState);