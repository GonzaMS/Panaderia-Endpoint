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
    fechaFiltro: "", // Estado para almacenar la fecha de filtro
    productosVendidos: [],
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

  obtenerCantidadProducto = (facturaId) => {
    axios
      .get(
        `https://localhost:7089/api/detalles_facturas?fk_factura=${facturaId}`
      )
      .then((response) => {
        const detalles = response.data;
        const detalleFactura = detalles.find(
          (detalle) => detalle.fk_factura === facturaId
        );
        if (detalleFactura) {
          const cantidad = detalleFactura.int_cantidad;
          this.setState((prevState) => ({
            factura: {
              ...prevState.factura,
              cantidad: cantidad,
            },
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  buscarDetallesFactura = async (idFactura) => {
    try {
      const response = await axios.get(
        `https://localhost:7089/api/detalles_facturas?fk_factura=${idFactura}`
      );
      const detalles = response.data;
      const nombresProductos = [];
  
      for (const detalle of detalles) {
        const fkProducto = detalle.fk_producto;
        const productoResponse = await axios.get(
          `https://localhost:7089/api/productos_elaborados?id_producto_elaborado=${fkProducto}`
        );
        const productoElaborado = productoResponse.data;
        const nombreProducto = productoElaborado.nombre; // Asegúrate de tener el nombre del campo correcto
        
        nombresProductos.push(nombreProducto);
      }
  
      this.setState({ productosVendidos: nombresProductos });
    } catch (error) {
      console.error(error);
    }
  };
  
  
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
  filtrarPorFecha = (fecha) => {
    if (fecha === "") {
      this.obtenerDatos();
    } else {
      this.setState({ fechaFiltro: fecha });
  
      // Realizar la llamada a la API con el filtro de fecha
      axios
        .get(`https://localhost:7089/api/facturas?date_fecha_emision=${fecha}`)
        .then((response) => {
          this.setState({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  


  mostrarModalVenta = (dato) => {
    this.setState(
      {
        factura: dato,
        modalVenta: true,
      },
      () => {
        this.buscarDetallesFactura(dato.id_factura);
        this.obtenerCantidadProducto(dato.id_factura);
      }
    );
  };
  

  cerrarModalVenta = () => {
    this.setState({ modalVenta: false });
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
            </div>
            <div className="col-sm-12 col-md-4">
              <Link to="/FacturaVenta" className="custom-link">
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
          <div>
            <h4>Detalles de la Factura</h4>
          </div>
        </ModalHeader>

          <ModalBody>
            <h5>Cliente: {this.state.factura.str_nombre_cliente}</h5>
            <h5>Fecha: {this.state.factura.date_fecha_emision}</h5>
            <h5>Cantidad: {this.state.factura.cantidad}</h5>
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