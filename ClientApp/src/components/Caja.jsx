import "../css/custom.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import { Modal, ModalFooter, ModalBody, ModalHeader } from "reactstrap";

export class Caja extends Component {
  state = {
    cajas: [], // Lista de cajas
    detalles_cajas: [], // Lista de detalles de cajas
    cajeros: [], // Lista de cajeros
    facturas: [], // Lista de facturas
    detalles_facturas: [], // Lista de detalles de facturas
    cobros: [], // Lista de cobros
    formas_pagos: [], // Lista de formas de pago
    movimientos: [], // Lista de movimientos
    clientes: [], // Lista de clientes
    productos_elaborados: [], // Lista de productos elaborados
    selectedFactura: null, // Factura seleccionada
    cajaAbierta: false,
    selectedCajero: "",
    productosFactura: [], // Lista de productos de la factura seleccionada
    precioUnitario: [], // Lista de precios unitarios de los productos de la factura seleccionada
    cantidad: [], // Lista de cantidades de los productos de la factura seleccionada
    cajaTotal: 0, // Total de la caja
    nombreCajero: "", // Nombre del cajero seleccionado
    cobrarModalOpen: false,
    montoPagar: 0, // Monto a pagar
    vuelto: 0, // Vuelto
    valorEfectivo: 0, // Valor en efectivo
  };

  componentDidMount() {
    // Verificar si hay un estado de caja abierta almacenado en el almacenamiento local
    const cajaAbiertaLocal = localStorage.getItem("cajaAbierta");

    if (cajaAbiertaLocal) {
      // Si hay un estado de caja abierta almacenado, actualizar el estado en la clase y evitar cerrar la caja
      this.setState({ cajaAbierta: true });
    }

    this.fetchCajas();
    this.fetchDetallesCajas();
    this.fetchCajeros();
    this.fetchFacturas();
    this.fetchDetallesFacturas();
    this.fetchCobros();
    this.fetchMovimientos();
    this.fetchFormasPagos();
    this.fetchClientes();
    this.fetchProductosElaborados();
  }

  //Obtenemos las cajas
  fetchCajas = () => {
    axios
      .get("https://localhost:7089/api/cajas")
      .then((response) => {
        const listaCajas = response.data;
        this.setState({ cajas: listaCajas });
      })
      .catch((error) => {
        console.error("Error obteniendo las cajas", error);
      });
  };

  //Obtenemos los detalles de las cajas
  fetchDetallesCajas = () => {
    axios
      .get("https://localhost:7089/api/detalles_cajas")
      .then((response) => {
        const listaDetallesCajas = response.data;
        this.setState({ detalles_cajas: listaDetallesCajas });
      })
      .catch((error) => {
        console.error("Error obteniendo los detalles de las cajas", error);
      });
  };

  //Obtenemos los cajeros
  fetchCajeros = () => {
    axios
      .get("https://localhost:7089/api/cajeros")
      .then((response) => {
        const listaCajeros = response.data;
        this.setState({ cajeros: listaCajeros });
      })
      .catch((error) => {
        console.error("Error obteniendo los cajeros", error);
      });
  };

  fetchFacturas = () => {
    axios
      .get("https://localhost:7089/api/facturas")
      .then((response) => {
        const listaFacturas = response.data;
        this.setState({ facturas: listaFacturas });
      })
      .catch((error) => {
        console.error("Error obteniendo las facturas", error);
      });
  };

  fetchDetallesFacturas = () => {
    axios
      .get("https://localhost:7089/api/detalles_facturas")
      .then((response) => {
        const listaDetallesFacturas = response.data;
        this.setState({ detalles_facturas: listaDetallesFacturas });
      })
      .catch((error) => {
        console.error("Error obteniendo los detalles de las facturas", error);
      });
  };

  fetchCobros = () => {
    axios
      .get("https://localhost:7089/api/cobros")
      .then((response) => {
        const listaCobros = response.data;
        this.setState({ cobros: listaCobros });
      })
      .catch((error) => {
        console.error("Error obteniendo los cobros", error);
      });
  };

  fetchFormasPagos = () => {
    axios
      .get("https://localhost:7089/api/formas_pagos")
      .then((response) => {
        const listaFormasPagos = response.data;
        this.setState({ formas_pagos: listaFormasPagos });
      })
      .catch((error) => {
        console.error("Error obteniendo las formas de pago", error);
      });
  };

  fetchMovimientos = () => {
    axios
      .get("https://localhost:7089/api/movimientos")
      .then((response) => {
        const listaMovimientos = response.data;
        this.setState({ movimientos: listaMovimientos });
      })
      .catch((error) => {
        console.error("Error obteniendo los movimientos", error);
      });
  };

  fetchClientes = () => {
    axios
      .get("https://localhost:7089/api/clientes")
      .then((response) => {
        const listaClientes = response.data;
        this.setState({ clientes: listaClientes });
      })
      .catch((error) => {
        console.error("Error obteniendo los clientes", error);
      });
  };

  fetchProductosElaborados = () => {
    axios
      .get("https://localhost:7089/api/productos_elaborados")
      .then((response) => {
        const listaProductosElaborados = response.data;
        this.setState({ productos_elaborados: listaProductosElaborados });
      })
      .catch((error) => {
        console.error("Error obteniendo los productos elaborados", error);
      });
  };

  // Manejar el cambio en el selector de cajero
  handleCajeroChange = (event) => {
    this.setState({ selectedCajero: event.target.value });
  };

  // Función para abrir la caja
  abrirCaja = () => {
    const { selectedCajero, detalles_cajas, cajeros } = this.state;

    console.log("selectedCajero", selectedCajero);

    // Verificar si se ha seleccionado un cajero
    if (!selectedCajero) {
      alert("Por favor, seleccione un cajero");
      return;
    }

    // Obtener la fecha y hora actual
    const fechaApertura = new Date();

    console.log("fechaApertura", fechaApertura);

    // Crear el objeto de apertura de caja con los datos necesarios
    const aperturaCaja = {
      fk_caja: 1,
      fl_monto_caja: 300000,
      date_fecha_del_dia: fechaApertura, // Convertir a formato ISO para enviar al servidor
      fk_cajero: selectedCajero,
      date_hora_entrada: fechaApertura,
      date_hora_salida: fechaApertura, // Agregar una hora a la fecha de apertura
      bool_estado_caja: true,
    };

    //Convertimos apertura caja a JSON
    const aperturaCajaJSON = JSON.stringify(aperturaCaja);

    // Enviar la solicitud para abrir la caja
    axios
      .post("https://localhost:7089/api/detalles_cajas", aperturaCajaJSON, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Actualizar el estado de la caja y mostrar un mensaje de éxito
        this.setState({ cajaAbierta: true });

        // Obtener el último detalle de caja
        const ultimoDetalleCaja = detalles_cajas[detalles_cajas.length - 1];

        // Obtener el total de la caja del último detalle de caja
        const cajaTotal = ultimoDetalleCaja.fl_monto_caja;

        const convertir = parseInt(selectedCajero);

        // Obtener el nombre del cajero seleccionado
        const cajeroSeleccionado = cajeros.find(
          (cajero) => cajero.id_cajero === convertir
        );
        console.log("cajeroSeleccionado", cajeroSeleccionado);

        const nombreCajero = cajeroSeleccionado.str_nombre_cajero;

        // Actualizar el estado de cajaTotal y nombreCajero
        this.setState({ cajaTotal, nombreCajero });

        alert("¡La caja ha sido abierta con éxito!");
      })
      .catch((error) => {
        console.error("Error al abrir la caja:", error);
        alert("Error al abrir la caja. Por favor, inténtelo de nuevo.");
      });

    // Actualizar el estado de la caja y mostrar un mensaje de éxito
    this.setState({ cajaAbierta: true });
    alert("¡La caja ha sido abierta con éxito!");

    // Guardar el estado de cajaAbierta en el almacenamiento local
    localStorage.setItem("cajaAbierta", "true");

    this.fetchDetallesCajas();
  };

  // Función para cerrar la caja
  cerrarCaja = () => {
    // Obtenemos el ultimo detalle de caja
    const { detalles_cajas, selectedCajero } = this.state;
    console.log("detalles_cajas", detalles_cajas);

    //Obtenemos el ultimo detalle de caja
    const ultimoDetalleCaja =
      detalles_cajas[detalles_cajas.length - 1].id_detalle_caja;
    console.log("ultimoDetalleCaja", ultimoDetalleCaja);

    // Actualizar el estado de la caja en la clase y cerrar la caja
    this.setState({ cajaAbierta: false });

    // Eliminar el estado de cajaAbierta del almacenamiento local
    localStorage.removeItem("cajaAbierta");

    //Obtenemos el fl_monto_caja del ultimo detalle de caja
    const fl_monto_caja =
      detalles_cajas[detalles_cajas.length - 1].fl_monto_caja;
    console.log("fl_monto_caja", fl_monto_caja);

    const actualizarDetalleCaja = {
      id_detalle_caja: ultimoDetalleCaja,
      fk_caja: 1,
      fk_cajero: selectedCajero,
      fl_monto_caja: fl_monto_caja,
      bool_estado_caja: false,
    };

    console.log("actualizarDetalleCaja", actualizarDetalleCaja);

    const actualizarDetalleCajaJSON = JSON.stringify(actualizarDetalleCaja);
    console.log("actualizarDetalleCajaJSON", actualizarDetalleCajaJSON);

    // Actualizar el estado de la caja en la base de datos
    axios
      .put(
        `https://localhost:7089/api/detalles_cajas/${ultimoDetalleCaja}`,
        actualizarDetalleCajaJSON,
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        this.setState({ cajaAbierta: false, cajaTotal: 0, nombreCajero: "" });
      })

      .catch((error) => {
        console.error("Error al cerrar la caja:", error);
      });

    console.log(selectedCajero);
  };

  //Funcion para ver los detalles de la factura
  verDetallesFactura = (idFactura) => {
    const { detalles_facturas, productos_elaborados } = this.state;

    //Obtenemos todos los detalles de la factura
    const detallesFactura = detalles_facturas.filter(
      (detalle) => detalle.fk_factura === idFactura
    );

    //Obtenemos todos los productos elaborados de ese detalle de factura
    const productosFactura = detallesFactura.map((detalle) => {
      return productos_elaborados.find(
        (producto) => producto.id_producto_elaborado === detalle.fk_producto
      );
    });

    //Obtenemos la cantidad de cada producto elaborado
    const cantidadProductosElaborados = detallesFactura.map(
      (detalle) => detalle.int_cantidad
    );

    //Obtenemos el precio unitario de cada producto que se encuentra en productos_elaborados
    const precioUnitarioProductosElaborados = productosFactura.map(
      (producto) => producto.fl_precio_unitario
    );

    // Actualizamos el estado con los productos de la factura y la factura seleccionada
    this.setState({
      productosFactura,
      selectedFactura: idFactura,
      cantidad: cantidadProductosElaborados,
      precioUnitario: precioUnitarioProductosElaborados,
    });
  };

  //Funcion para cerrar el modal
  cerrarModal = () => {
    this.setState({ selectedFactura: null });
  };

  //Funcion para cobrar la factura
  cobrarFactura = (idFactura) => {
    const { facturas } = this.state;

    // Obtener la factura seleccionada
    const factura = facturas.find(
      (factura) => factura.id_factura === idFactura
    );

    // Obtener el monto total de la factura
    const montoTotal = factura.fl_total_pagar;

    // Actualizar el estado del monto a pagar
    this.setState({ montoPagar: montoTotal });

    // Abrir el modal de cobro
    this.setState({ cobrarModalOpen: true });
  };

  // Función para manejar el cambio de valor en el modal de cobro
  handleModalCobrosChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });

    // Si el campo modificado es "valorEfectivo", calcular el vuelto
    if (name === "valorEfectivo") {
      const { montoPagar } = this.state;

      // Verificar si el valor del efectivo es mayor o igual al monto a pagar
      if (value >= montoPagar) {
        // Calcular el vuelto
        const vuelto = value - montoPagar;

        // Actualizar el estado con el valor del vuelto
        this.setState({ vuelto });
      } else {
        // Si el valor del efectivo es menor al monto a pagar, reiniciar el valor del vuelto
        this.setState({ vuelto: 0 });
      }
    }
  };

  // Función para manejar el envío del formulario de cobro
  handleSubmitCobro = (event) => {
    event.preventDefault();

    // Obtener los valores del formulario de cobro
    const { formaPagoSeleccionada } = this.state;

    // Realizar acciones necesarias con los datos del cobro

    // Cerrar el modal de cobro
    this.setState({ cobrarModalOpen: false });
  };

  // Función para cerrar el modal de cobro
  handleCloseCobroModal = () => {
    this.setState({ cobrarModalOpen: false });
  };

  render() {
    const {
      cajeros,
      cajaAbierta,
      selectedCajero,
      facturas,
      selectedFactura,
      productosFactura,
      cantidad,
      precioUnitario,
      nombreCajero,
      cajaTotal,
      cobrarModalOpen,
      formas_pagos,
      formaPagoSeleccionada,
      montoPagar,
      vuelto,
      valorEfectivo,
    } = this.state;

    return (
      <>
        <div className="row">
          <div className="col-sm-10 col-md-8 text-center">
            <p>PANADERIA </p>
          </div>
          <div></div>

          <div className="row justify-content-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                type="button"
                className="btn btn-warning"
                disabled={!cajaAbierta}
              >
                Informe de Arqueos
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">CAJA</h5>
              <div className="d-grid gap-2">
                {!cajaAbierta ? (
                  <>
                    <select
                      className="form-select"
                      value={selectedCajero}
                      onChange={this.handleCajeroChange}
                    >
                      <option value="">Seleccione un cajero</option>
                      {cajeros.map((cajero) => (
                        <option key={cajero.id_cajero} value={cajero.id_cajero}>
                          {cajero.str_nombre_cajero}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={!selectedCajero}
                      onClick={this.abrirCaja}
                    >
                      Abrir
                    </button>
                  </>
                ) : (
                  <>
                    <p>La caja está abierta.</p>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={this.cerrarCaja}
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {/*Si la caja esta abierta mostramos el total de la caja y quien abre la caja*/}
          {cajaAbierta && (
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">Detalles de la caja</h5>
                <br />
                <h5 className="card-text">Total en caja: {cajaTotal}</h5>
                <br />
                <h5 className="card-text">Cajero: {nombreCajero}</h5>
              </div>
            </div>
          )}
        </div>

        {/*Si la caja esta abierta mostramos todas las facturas*/}
        {cajaAbierta && (
          <div className="row">
            <div className="col-sm-10 col-md-8 text-center">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th></th>
                    <th scope="col">RUC</th>
                    <th></th>
                    <th scope="col">Fecha</th>
                    <th></th>
                    <th scope="col">Total</th>
                    <th></th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((factura) => (
                    <tr key={factura.id_factura}>
                      <th>{factura.str_nombre_cliente}</th>
                      <th></th>
                      <th>{factura.str_ruc_cliente}</th>
                      <th></th>
                      <td>{factura.date_fecha_emision.substring(0, 10)}</td>
                      <th></th>
                      <td>{factura.fl_total_pagar}</td>
                      <th></th>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            this.verDetallesFactura(factura.id_factura)
                          }
                        >
                          Ver
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => this.cobrarFactura(factura.id_factura)}
                        >
                          Cobrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div></div>

            {/* Modal para cobrar */}
            <Modal isOpen={cobrarModalOpen} toggle={this.handleCloseCobroModal}>
              <ModalHeader toggle={this.handleCloseCobroModal}>
                Cobrar Factura
              </ModalHeader>
              <ModalBody>
                <form onSubmit={this.handleSubmitCobro}>
                  <div className="mb-3">
                    <label
                      htmlFor="formaPagoSeleccionada"
                      className="form-label"
                    >
                      Forma de Pago
                    </label>
                    <select
                      className="form-select"
                      name="formaPagoSeleccionada"
                      id="formaPagoSeleccionada"
                      value={formaPagoSeleccionada}
                      onChange={this.handleModalCobrosChange}
                      required
                    >
                      <option value="">Seleccione una forma de pago</option>
                      {formas_pagos.map((forma_pago) => (
                        <option
                          key={forma_pago.id_forma_pago}
                          value={forma_pago.id_forma_pago}
                        >
                          {forma_pago.str_formas}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    {/*Agregamos el monto */}
                    <label htmlFor="montoPagar" className="form-label">
                      Monto
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="montoPagar"
                      id="montoPagar"
                      value={montoPagar}
                      onChange={this.handleModalCobrosChange}
                      required
                    />
                  </div>

                  {/*Agregamos el efectivo del cliente */}
                  <div className="mb-3">
                    <label htmlFor="valorEfectivo" className="form-label">
                      Efectivo
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="valorEfectivo"
                      id="valorEfectivo"
                      value={valorEfectivo}
                      onChange={this.handleModalCobrosChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    {/*Agregamos el vuelto */}
                    <label htmlFor="vuelto" className="form-label">
                      Vuelto
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="vuelto"
                      id="vuelto"
                      value={vuelto}
                      onChange={this.handleModalCobrosChange}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                      Cobrar
                    </button>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <button
                  className="btn btn-secondary"
                  onClick={this.handleCloseCobroModal}
                >
                  Cancelar
                </button>
              </ModalFooter>
            </Modal>
          </div>
        )}

        {/* Modal para mostrar los productos de la factura */}
        <Modal isOpen={selectedFactura !== null} toggle={this.cerrarModal}>
          <ModalHeader toggle={this.cerrarModal}>
            Productos de la Factura
          </ModalHeader>
          <ModalBody>
            {productosFactura.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    {/* Agrega más columnas si es necesario */}
                  </tr>
                </thead>
                <tbody>
                  {productosFactura.map((producto, index) => (
                    <tr key={producto.id_producto_elaborado}>
                      <td>{producto.str_nombre_producto}</td>
                      <td>{cantidad[index]}</td>
                      <td>{precioUnitario[index]}</td>
                      {/* Agrega más columnas si es necesario */}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay productos en esta factura.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-secondary" onClick={this.cerrarModal}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
