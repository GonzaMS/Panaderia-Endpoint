import React, { useState } from 'react';
import '../css/login.css';
import { Menu } from './Menu';
import userImage from '../img/user.png';

export const Login = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Aquí se verifica si el usuario y la contraseña son correctos
    if (username === '111' && password === '123') {
      // Marcar como autenticado
      setIsLoggedIn(true);
      // Redirigir a la página deseada
      history.push('/app');
    } else {
      // Mostrar mensaje de error
      alert('Usuario o contraseña incorrectos');
    }
  };

  // Si el usuario ya inició sesión, mostrar el menú
  if (isLoggedIn) {
    //Si esta logeado lo regresa al menu
    return <Menu />;
  }

  // Si no ha iniciado sesión, mostrar el formulario de login
  return (
    <form group className="bodyy">
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
        <br/>
        <br/>
        <input
          type="password"
          placeholder="Contraseña"
          className="input-lock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <button onClick={handleLogin} className="mi-boton">INICIAR</button>

    </div></form>
  );
};