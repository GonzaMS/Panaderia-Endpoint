import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import { Menu } from "./components/Menu";
import "./css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import { Layout } from "./Sin_uso/Layout";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <ThemeProvider>
        <div className={`container-fluid p-3 d-flex flex-row fondo-panel`}>
          <Menu />
          <div className="container">
            <Routes>
              {AppRoutes.map((route, index) => {
                const { element, ...rest } = route;
                return <Route key={index} {...rest} element={element} />;
              })}
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}
