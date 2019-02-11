import {applyMiddleware, compose, createStore} from "redux";
import {createLogger} from "redux-logger";
import rootReducer from "../reducers";
import {loadState, saveState} from './localStorage';

const logger = createLogger();
const persistedState = loadState();
let enhancer;

if (process.env.NODE_ENV !== 'production') {
    enhancer = compose(
        applyMiddleware(
            logger
        )
    )

} else {
    enhancer = compose(
        applyMiddleware()
    )
}


let store = createStore(
    rootReducer,
    persistedState,
    enhancer
);

if (module.hot) {
    module.hot
        .accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        })
}


store.subscribe(() => {
    saveState(store.getState())
});


export default store;