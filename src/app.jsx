// import './scss/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import Home from './components/Home';
import {Provider} from "react-redux";
import Store from './redux/store/index';

const renderApplication = () => {
  ReactDOM.render(
      <Provider store={Store}>
        <Home />
      </Provider>,
    document.querySelector('#root')
  );
}

renderApplication(Home);

if (module.hot) {
  module.hot.accept("./components/Home", () => {
    renderApplication();
  });
}
