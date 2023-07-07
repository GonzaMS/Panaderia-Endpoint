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

  
  filtrarPorCliente = (valorBusqueda) => {
    axios
      .get(`https://localhost:7089/api/facturas`)
      .then((response) => {
        const facturas = response.data;
        const facturasFiltradas = facturas.filter((factura) =>
          factura.str_nombre_cliente.toLowerCase().includes(valorBusqueda.toLowerCase())
        );
        this.setState({ data: facturasFiltradas });
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
  obtenerDetallesProductos = (idFactura) => {
    axios
      .get(`https://localhost:7089/api/detalles_facturas?fk_factura=${idFactura}`)
      .then((response) => {
        const detalles = response.data;
        const productosIds = detalles.map((detalle) => detalle.fk_producto);
  
        axios
          .get(`https://localhost:7089/api/productos_elaborados?id_producto_elaborado=${productosIds.join(',')}`)
          .then((response) => {
            const productos = response.data;
  
            const detallesFiltrados = detalles.filter(
              (detalle) => detalle.fk_factura === idFactura
            );
  
            // Agregar el campo "int_cantidad" al estado de detalles_facturas
            const detallesActualizados = detallesFiltrados.map((detalle) => {
              const producto = productos.find(
                (producto) => producto.id_producto_elaborado === detalle.fk_producto
              );
              return {
                ...detalle,
                int_cantidad: producto ? detalle.int_cantidad : 0,
              };
            });
  
            this.setState({
              detalles_facturas: detallesActualizados,
              productos_elaborados: productos,
            });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  
  mostrarModalVenta = (dato) => {
    this.setState(
      {
        factura: dato,
        modalVenta: true,
      },
      () => {
        // Obtener los detalles de los productos asociados a la factura
        this.obtenerDetallesProductos(dato.id_factura);
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
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Buscar por cliente"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => this.filtrarPorCliente(e.target.value)}
                />

                
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
                  <td>{dato.date_fecha_emision.substring(0,10)}</td>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-eye"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>
                      </svg>
                    </button>{" "}

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalVenta}>
          <ModalHeader style={{ backgroundColor: 'rgba(247, 214, 111, 1' }}>
            <h4 style={{ color: 'black'}}>Detalles de la Factura</h4>
          </ModalHeader>
          <ModalBody>
            <h5>Cliente:</h5>
            <h6 style={{ fontSize: '16px'}}>
              {this.state.factura.str_nombre_cliente}
            </h6>
            <h5>Fecha:</h5>
            <h6 style={{ fontSize: '16px' }}>
              {this.state.factura.date_fecha_emision}
            </h6>
            <Table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {this.state.detalles_facturas.map((detalle) => {
                  const producto = this.state.productos_elaborados.find(
                    (producto) =>
                      producto.id_producto_elaborado === detalle.fk_producto
                  );
                  return (
                    <tr key={detalle.id_detalle_factura}>
                      <td>{producto?.str_nombre_producto}</td>
                      <td>{detalle.int_cantidad}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <h5>Monto Total:</h5>
            <h6 style={{ fontSize: '16px'}}>
              {this.state.factura.fl_total_pagar}
            </h6>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={this.cerrarModalVenta}
            >
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

      </>
    );
  }
}