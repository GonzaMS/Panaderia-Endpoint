import React, { useState } from "react";
import "../css/login.css";
import userImage from "../img/user.png";
import "../css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Login = ({ setIsLoggedIn}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Aquí se verifica si el usuario y la contraseña son correctos
    if (username === "111" && password === "123") {
      //Mostrar el estado de autenticación

      // Marcar como autenticado
      setIsLoggedIn(true);
    } else {
      // Mostrar mensaje de error
      alert("Usuario o contraseña incorrectos");
    }
  };

  // Si no ha iniciado sesión, mostrar el formulario de login
  return (
    <form group={true.toString()} className="bodyy">
      <div className="cover">
        <div className="user-image">
          <img src={userImage} alt="imageuser" />
          <h1>Iniciar Sesión</h1>
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Usuario"
            className="input-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="Contraseña"
            className="input-lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} className="mi-boton">
          INICIAR
        </button>
      </div>
    </form>
  );
};
