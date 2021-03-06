import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import MainView from "./components/main-view/main-view";
import moviesApp from "./reducers/reducers.js";
import { devToolsEnhancer } from "redux-devtools-extension";
import "./index.scss";
const store = createStore(moviesApp, devToolsEnhancer());
import Container from "react-bootstrap/Container";

class MyFlixApplication extends React.Component {
  render() {
    return (
      <Container>
        <Provider store={store}>
          <MainView />
        </Provider>
      </Container>
    );
  }
}

const container = document.getElementsByClassName("app-container")[0];

ReactDOM.render(React.createElement(MyFlixApplication), container);
