import { combineReducers } from "redux";
import {AppReducers} from '../app/reducer/index';

export default combineReducers ({
    app: AppReducers,
})