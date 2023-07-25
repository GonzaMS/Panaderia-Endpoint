import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/custom.css";

import {
  Table,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";

export class Compras extends Component {
  state = {
    compras: [], //Array de compras
    proveedores: [], //Array de proveedores
    ingredientes: [], //Array de ingredientes
    detalles_de_compras: [], //Array de detalles de compras
    detallesCompraModal: [], //Array de detalles de compras para el modal
    detalles_de_caja: [], //Array de detalles de caja
    selectedCompra: {}, //Compra seleccionada para el modal
    modalActualizar: false, //Modal para actualizar
    modalInsertar: false, //Modal para insertar
    modalCompra: false, //Modal para ver detalles de compra
  };

  componentDidMount() {
    this.fetchCompras();
  }
  fechaActual = new Date().toISOString().split("T")[0];
  
  fetchCompras() {
    try {
      //Compras
      axios
        .get("https://localhost:7089/api/compras")
        .then((response) => {
          this.setState({ compras: response.data });
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      //Detalles de caja
      axios
        .get("https://localhost:7089/api/detalles_cajas")
        .then((response) => {
          this.setState({ detalles_de_caja: response.data });
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      

      //Detalles de compras
      axios
        .get("https://localhost:7089/api/detalles_de_compras")
        .then((response) => {
          this.setState({ detalles_de_compras: response.data });
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      //Proveedores
      axios
        .get("https://localhost:7089/api/proveedores")
        .then((response) => {
          this.setState({ proveedores: response.data });
        })
        .catch((error) => {
          console.log(error);
        });

      //Ingredientes
      axios
        .get("https://localhost:7089/api/ingredientes")
        .then((response) => {
          this.setState({ ingredientes: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };

  mostrarModalCompra = (dato) => {
    this.setState({
      form: dato,
      modalCompra: true,
    });
  };

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
  };

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  cerrarModalCompra = () => {
    this.setState({ modalCompra: false });
  };

  verCompra = (compraId) => {
    axios
      .get(`https://localhost:7089/api/compras/${compraId}`)
      .then((response) => {
        const selectedCompra = response.data;
        const detallesCompra = this.obtenerDetallesCompra(compraId);
        selectedCompra.detalles = detallesCompra;
        this.setState({ selectedCompra });
        console.log(selectedCompra);
        this.setState({ detallesCompraModal: detallesCompra });
        console.log(detallesCompra);
        this.mostrarModalCompra();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  //Obtener todos los detalles de compras relacionados con esa compra lo guarda en un array y obtenemos el nombre del ingrediente, la cantidad y el precio unitario
  obtenerDetallesCompra = (idCompra) => {
    const { detalles_de_compras, ingredientes } = this.state;
    console.log(detalles_de_compras);
    const data = [];
    detalles_de_compras.forEach((detalle) => {
      console.log(detalle.fk_compra);
      console.log(idCompra);
      if (detalle.fk_compra === idCompra) {
        const ingrediente = ingredientes.find(
          (ingrediente) => ingrediente.id_ingrediente === detalle.fk_ingrediente
        );
        data.push({
          nombre: ingrediente.str_nombre_ingrediente,
          cantidad: detalle.int_cantidad,
          precio: detalle.fl_precio_unidad,
        });
      }
    });
    console.log(data);
    return data;
  };

    //funcion para pagar un a compra
    pagarCompra = (compraId) => {
      const { detalles_de_caja, selectedCompra } = this.state;
      console.log(compraId);
      //Obtenemos toda la informacion de la compra seleccionada
      const compra = this.state.compras.find(
        (compra) => compra.id_compra === compraId
      );

      console.log(compra);
    
      //Obtenemos el total de la compra
      const montoCompra = compra.fl_precio_total;
      console.log(montoCompra);
      //Obtener el monto actual de la caja
      const montoCaja = detalles_de_caja[detalles_de_caja.length - 1].fl_monto_caja;

      //Verificamos si hay suficiente dinero en la caja, si no hay tiramos un alert, si hay descontamos de la caja
      if (montoCaja < montoCompra) {
        alert("No hay suficiente dinero en la caja");
      }else{
        try{
          //Obtenemos el ultimo detalle de caja
          const ultimoDetalleCaja = detalles_de_caja[detalles_de_caja.length - 1];
          //Obtenemos el id del ultimo detalle de caja
          const idUltimoDetalleCaja = ultimoDetalleCaja.id_detalle_caja;

          //Descontamos el monto de la compra del monto de la caja
          const montoActualizado = montoCaja - montoCompra;
          console.log(montoActualizado);

          //Creamos el objeto para insertar el detalle de caja
          const detalleCaja = {
            id_detalle_caja: idUltimoDetalleCaja,
            fk_caja: 1,
            fl_monto_caja: montoActualizado,
            date_fecha_del_dia: ultimoDetalleCaja.date_fecha_del_dia,
            fk_cajero: ultimoDetalleCaja.fk_cajero,
            date_hora_entrada: ultimoDetalleCaja.date_hora_entrada,
            date_hora_salida: ultimoDetalleCaja.date_hora_salida,
            bool_estado_caja: ultimoDetalleCaja.bool_estado_caja,
          };
          console.log(detalleCaja);

          const body = JSON.stringify(detalleCaja);

          console.log(body);

          //Actualizamos el ultimo detalle de caja
          axios
          .put(`https://localhost:7089/api/detalles_cajas/${idUltimoDetalleCaja}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

          //Actualizar el montoCaja del localstorage
          localStorage.setItem("cajaTotal", montoActualizado);


        }catch{
          console.log("Error al pagar la compra");
        }
      }

    };

  //Funcion para obtener el nombre del ingrediente relacionado con ese detalle de compra
  mostrarNombreIngrediente = (idIngrediente) => {
    const ingrediente = this.state.ingredientes.find(
      (ingrediente) => ingrediente.id_ingrediente === idIngrediente
    );
    return ingrediente ? ingrediente.str_nombre_ingrediente : "";
  };

  //Funcion para obetner el nombre del proveedor relacionada con esa compra
  mostrarNombreProveedor = (idProveedor) => {
    const proveedor = this.state.proveedores.find(
      (proveedor) => proveedor.id_proveedor === idProveedor
    );
    return proveedor ? proveedor.str_nombre_proveedor : "";
  };

  //Funcion para mostrar el ruc del proveedor relacionada con esa compra
  mostrarRucProveedor = (idProveedor) => {
    const proveedor = this.state.proveedores.find(
      (proveedor) => proveedor.id_proveedor === idProveedor
    );
    return proveedor ? proveedor.str_ruc_proveedor : "";
  };

  //Filtrar por proveedor o ruc
  filtrarCompra = (valor) => {
    if (valor === "") {
      this.fetchCompras();
    }
    const { compras, proveedores } = this.state;
    const filtradas = compras.filter((compra) => {
      const proveedor = proveedores.find(
        (prov) => prov.id_proveedor === compra.fk_proveedor
      );
      return (
        proveedor.str_nombre_proveedor
          .toLowerCase()
          .includes(valor.toLowerCase()) ||
        proveedor.str_ruc_proveedor.includes(valor)
      );
    });
    this.setState({ compras: filtradas });
  };

  //Filtrar por fecha
  filtrarPorFecha = (fecha) => {
    if(fecha === ""){
        this.fetchCompras();
    }
    this.setState({ fechaFiltro: fecha });
  
    // Realizar la llamada a la API con el filtro de fecha
    axios
      .get(`https://localhost:7089/api/compras/fecha/${fecha}`)
      .then((response) => {
        this.setState({ compras: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { compras, selectedCompra, detallesCompraModal } = this.state;

    return (
      <>
        <Container>
          <br />
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-3">
              <p>Compra</p>
            </div>

            <div className="col-sm-12 col-md-5">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Buscar por proveedor o ruc"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => this.filtrarCompra(e.target.value)}
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
                    {" "}
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="col-sm-12 col-md-4">
              <Link to="/FacturaCompra" className="custom-link">
                <button type="button" className="custom-button">
                  {" "}
                  Nueva Compra
                </button>
              </Link>
            </div>
          </div>

          <br />
          <Table>
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Ruc</th>
                <th>Fecha</th>
                <th>Monto Total</th>
              </tr>
            </thead>

            <tbody>
              {compras.map((dato) => (
                <tr key={dato.id_compra}>
                  <td>{this.mostrarNombreProveedor(dato.fk_proveedor)}</td>
                  <td>{this.mostrarRucProveedor(dato.fk_proveedor)}</td>
                  <td>{dato.date_compra.substring(0,10)}</td>
                  <td>{dato.fl_precio_total}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => this.verCompra(dato.id_compra)}
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
                    <button className="btn btn-primary" onClick={() => this.pagarCompra(dato.id_compra)}>
                      Pagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Nueva Compra</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Proveedor:</label>
              <input
                className="form-control"
                name="proveedor"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Fecha:</label>
              <input
                className="form-control"
                name="fecha"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Monto Total:</label>
              <input
                className="form-control"
                name="montoTotal"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => this.insertar()}
            >
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalCompra}>
          <ModalHeader>Detalle de Compra</ModalHeader>
          <ModalBody>
            {/* Mostrar los datos de la compra */}
            <h5>
              Proveedor:{" "}
              {this.mostrarNombreProveedor(selectedCompra.fk_proveedor)}
            </h5>
            <h5>
              RUC: {this.mostrarRucProveedor(selectedCompra.fk_proveedor)}
            </h5>
            <h5>Fecha: {selectedCompra.date_compra}</h5>
            <h5>Monto Total: {selectedCompra.fl_precio_total}</h5>

            {/* Mostrar los detalles de la compra */}
            <h5>Ingredientes:</h5>
            {detallesCompraModal.map((detalle, index) => (
              <div key={index}>
                <p>Ingrediente: {detalle.nombre}</p>
                <p>Cantidad: {detalle.cantidad}</p>
                <p>Precio Unitario: {detalle.precio}</p>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-secondary"
              onClick={this.cerrarModalCompra}
            >
              Cerrar
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}