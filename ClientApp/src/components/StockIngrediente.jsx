import "../css/custom.css";
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import { Table, Container } from "reactstrap";

export class StockIngrediente extends Component {
  state = {
    stocks: [], // Estado de los stocks
    ingredientes_stock: [], // Estado de los ingredientes en stock
    ingredientes: [], // Estado de los ingredientes
    marcas_ingredientes: [], // Estado de las marcas de los ingredientes
    ingredientesFiltrados: [], // Estado de los ingredientes filtrados
    modalActualizar: false, // Estado del modal actualizar
    modalInsertar: false, // Estado del modal insertar
  };

  componentDidMount() {
    this.fetchDatos();
  }

  // Obtener los datos de la API
  fetchDatos = () => {
    try {
      //Obtener el stock de productos
      axios
        .get("https://localhost:7089/api/stocks")
        .then((response) => {
          this.setState({ stocks: response.data });
        })
        .catch((error) => {
          console.log(error.message);
        });

      // Obtener el stock de ingredientes
      axios
        .get("https://localhost:7089/api/ingredientes_stock")
        .then((response) => {
          this.setState({ ingredientes_stock: response.data });
        })
        .catch((error) => {
          console.log(error.message);
        });

      // Obtener ingredientes
      axios
        .get("https://localhost:7089/api/ingredientes")
        .then((response) => {
          this.setState({ ingredientes: response.data });
        })
        .catch((error) => {
          console.log(error.message);
        });

      //Obtener la marca de los ingredientes
      axios
        .get("https://localhost:7089/api/marcas_ingredientes")
        .then((response) => {
          this.setState({ marcas_ingredientes: response.data });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //Obtener la marca del ingredientes
  obtenerMarca = (fk_ingredientes) => {
    const { marcas_ingredientes, ingredientes } = this.state;
  
    // Buscar el ingrediente en el stock de ingredientes
    const ingredienteEnStock = ingredientes.find(
      (ingrediente) => ingrediente.id_ingrediente === fk_ingredientes
    );
  
    // Si el ingrediente existe y tiene una marca
    if (ingredienteEnStock && ingredienteEnStock.fk_marca_ingrediente) {
      const marcaEnStock = marcas_ingredientes.find(
        (marca) => marca.id_marca_ingrediente === ingredienteEnStock.fk_marca_ingrediente
      );
  
      // Si la marca existe
      if (marcaEnStock) {
        return marcaEnStock.str_nombre_marca;
      }
    }
  
    return "Sin marca";
  };
  

  //Obtener el nombre del ingrediente que hay en ingredientes stock mediante el fk_ingrediente
  obtenerIngrediente = (fk_ingredientes) => {
    const { ingredientes } = this.state;

    // Buscar el ingrediente en el stock de ingredientes
    const ingredienteEnStock = ingredientes.find(
      (ingrediente) => ingrediente.id_ingrediente === fk_ingredientes
    );

    // Si el ingrediente existe
    if (ingredienteEnStock) {
      return ingredienteEnStock.str_nombre_ingrediente;
    } else {
      return "Sin ingrediente";
    }
  };

  //Filtrar por ingrediente
  filtrarPorIngrediente = (nombreIngrediente) => {
    const { ingredientes_stock } = this.state;

    // Filtrar por nombre de ingrediente
    const ingredientesFiltrados = ingredientes_stock.filter((dato) => {
      const nombre = this.obtenerIngrediente(dato.fk_ingredientes);
      return nombre.toLowerCase().includes(nombreIngrediente.toLowerCase());
    });

    this.setState({ ingredientesFiltrados });
  };

  render() {
    const { ingredientes_stock, ingredientesFiltrados } = this.state;
    const mostrarIngredientes = ingredientesFiltrados.length > 0 ? ingredientesFiltrados : ingredientes_stock;

    return (
      <>
        <Container>
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <p>Stock Ingredientes</p>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Buscar por ingrediente"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => this.filtrarPorIngrediente(e.target.value)}
                />

                <span className="input-group-text" id="basic-addon2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    {" "}
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Ingrediente</th>
                <th>Marca</th>
              </tr>
            </thead>

            <tbody>
              {mostrarIngredientes.map((dato) => (
                <tr key={dato.id_ingrediente_stock}>
                  <td>{dato.fl_cantidad}</td>
                  <td>{this.obtenerIngrediente(dato.fk_ingredientes)}</td>
                  <td>{this.obtenerMarca(dato.fk_ingredientes)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </>
    );
  }
}
