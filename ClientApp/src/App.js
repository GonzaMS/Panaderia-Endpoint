import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import { Menu } from "./components/Menu";
import { Login } from "./components/Login";
import { useState } from "react";
import "./css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import { Layout } from "./Sin_uso/Layout";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <ThemeProvider>
      <div className="container-fluid p-3 d-flex flex-row fondo-panel">
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
