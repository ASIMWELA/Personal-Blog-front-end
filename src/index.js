import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from "recoil";
import recoilPersist from "recoil-persist";
import 'bootstrap/dist/css/bootstrap.min.css'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './contex'
import * as serviceWorker from './serviceWorker';

const { RecoilPersist, updateState } = recoilPersist([], {
  key: "recoil-persist",
  storage: localStorage,
});

ReactDOM.render(
  <UserProvider>
    <Router>
      <RecoilRoot initializeState={updateState}>
        <RecoilPersist />
        <App />
      </RecoilRoot>,
    </Router>
  </UserProvider>
  ,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
