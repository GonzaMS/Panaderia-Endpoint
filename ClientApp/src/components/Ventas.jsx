import React, { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";

export class Ventas extends Component {
  state = {
    data: [],
    modalVenta: false,
    factura: [],
    detalles_facturas: [],
    productos_elaborados: [],
    fechaFiltro: "",
  };

  componentDidMount() {
    this.obtenerDatos();
  }

  obtenerDatos = () => {
    axios
      .get("https://localhost:7089/api/facturas")
      .then((response) => {
        this.setState({ data: response.data }, () => {
          // Obtener el nombre correcto del cliente para cada factura
          this.obtenerNombresClientes();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  mostrarModalVenta = (dato) => {
    this.setState({
      factura: dato,
      modalVenta: true,
    });
  };

  cerrarModalVenta = () => {
    this.setState({ modalVenta: false });
  };

  obtenerNombresClientes = () => {
    const facturas = this.state.data;

    facturas.forEach((factura) => {
      axios
        .get(`https://localhost:7089/api/clientes/${factura.fk_cliente}`)
        .then((response) => {
          const cliente = response.data;
          factura.fk_cliente = cliente.id_cliente;

          // Actualizar el estado con la factura actualizada
          this.setState((prevState) => ({
            data: [...prevState.data],
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  //Cambiar
  filtrarPorCliente = (valorBusqueda) => {
    axios
      .get(
        `https://localhost:7089/api/facturas?str_nombre_cliente=${valorBusqueda}`
      )
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Cambiar
  filtrarPorFecha = (fecha) => {
    if (fecha === "") {
      this.obtenerDatos(); // Obtener todos los datos si la fecha está vacía
    } else {
      this.setState({ fechaFiltro: fecha });
  
      const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
  
      axios
        .get(`https://localhost:7089/api/facturas?date_fecha_emision=${fechaFormateada}`)
        .then((response) => {
          this.setState({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  render() {
    return (
      <>
        <Container>
          <br />
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-3">
              <p>Venta</p>
            </div>
            <div className="col-sm-12 col-md-5">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Buscar por cliente"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => this.filtrarPorCliente(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control"
                  placeholder="Filtrar por fecha"
                  onChange={(e) => this.filtrarPorFecha(e.target.value)}
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
                    {/* Path del ícono de búsqueda */}
                  </svg>
                </span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <Link to="/FacturaVentas" className="custom-link">
                <button type="button" className="custom-button">
                  Nueva Venta
                </button>
              </Link>
            </div>
          </div>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Monto de Factura</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.id_factura}>
                  <td>{dato.str_nombre_cliente}</td>
                  <td>{dato.date_fecha_emision}</td>
                  <td>{dato.fl_total_pagar}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => this.mostrarModalVenta(dato)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        {/* Path del ícono de lápiz */}
                      </svg>
                    </button>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalVenta}>
          <ModalHeader>
            <h4>Detalles de la Factura</h4>
          </ModalHeader>
          <ModalBody>
            <h5>Cliente: {this.state.factura.str_nombre_cliente}</h5>
            <h5>Fecha: {this.state.factura.date_fecha_emision}</h5>
            <h5>Producto: {this.state.factura.str_nombre_producto}</h5>
            <h5>Precio Unitario: {this.state.factura.fl_precio_unitario}</h5>
            <h5>Monto Total: {this.state.factura.fl_total_pagar}</h5>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => this.cerrarModalVenta()}
            >
              Cerrar
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

