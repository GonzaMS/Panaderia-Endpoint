import "../css/custom.css";
import React, { Component } from "react";
import axios from "axios";

import {
  Table,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";

export class Clientes extends Component {
  state = {
    clientes: [],
    modalActualizar: false,
    modalInsertar: false,
    form: {
      str_nombre_cliente: "",
      str_ruc_cliente: "",
      str_ci_cliente: "",
      str_telefono_cliente: "",
      str_direccion_cliente: "",
    },
  };

  // Comprobamos que el componente se haya montado
  componentDidMount() {
    this.fetchClientes();
  }

  //Obtenemos los clientes
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

  // Mostrar modal para actualizar
  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };

  // Cerrar modal para actualizar
  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
  };

  // Mostrar modal para insertar
  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  // Cerrar modal para insertar
  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  // Actualizar los datos del cliente
  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Insertar un nuevo cliente
  editar = (dato) => {
    const clienteActualizado = { ...this.state.form };
    axios
      .put(
        `https://localhost:7089/api/clientes/${dato.id_cliente}`,
        clienteActualizado
      )
      .then((response) => {
        const clienteActualizado = response.data;
        const lista = this.state.clientes.map((cliente) => {
          if (cliente.id_cliente === clienteActualizado.id_cliente) {
            return clienteActualizado;
          }
          return cliente;
        });
        this.setState({ clientes: lista, modalActualizar: false });
        //Refrescar la tabla
        this.fetchClientes();
      })
      .catch((error) => {
        console.error("Error al editar el cliente:", error);
      });
  };


  // Eliminar un cliente
  eliminar = (dato) => {
    var opcion = window.confirm(
      "Estás seguro que deseas ELIMINAR al cliente " + dato.str_nombre_cliente
    );
    if (opcion === true) {
      axios
        .delete(`https://localhost:7089/api/clientes/${dato.id_cliente}`)
        .then((response) => {
          const lista = this.state.clientes.filter(
            (cliente) => cliente.id_cliente !== dato.id_cliente
          );
          this.setState({ clientes: lista, modalActualizar: false });
        })
        .catch((error) => {
          console.error("Error al eliminar el cliente:", error);
        });
    }
  };

  // Insertar un nuevo cliente
  insertar = () => {
    const nuevoCliente = {
      str_nombre_cliente: this.state.form.str_nombre_cliente,
      str_ruc_cliente: this.state.form.str_ruc_cliente,
      str_ci_cliente: this.state.form.str_ci_cliente,
      str_telefono_cliente: this.state.form.str_telefono_cliente,
      str_direccion_cliente: this.state.form.str_direccion_cliente,
    };

    axios
      .post("https://localhost:7089/api/clientes", nuevoCliente)
      .then((response) => {
        const clienteGuardado = response.data;
        const lista = [...this.state.clientes, clienteGuardado];
        this.setState({ modalInsertar: false, clientes: lista });
      })
      .catch((error) => {
        console.error("Error al guardar el cliente:", error);
      });

    console.log(nuevoCliente);
  };

  // Filtrar por nombre
  filtrarPorNombre = (valorBusqueda) => {
    if (valorBusqueda.trim() === "") {
      this.fetchClientes();
    } else {
      axios
        .get(`https://localhost:7089/api/clientes/buscar/${valorBusqueda}`)
        .then((response) => {
          const listaClientes = response.data;
          this.setState({ clientes: listaClientes });
        })
        .catch((error) => {
          console.error("Error obteniendo los clientes", error);
        });
    }
  };

  render() {
    const {clientes } = this.state;

    return (
      <>
        <Container>
          <br />

          <br />
          <div className="row">
            <div className="col-sm-12 col-md-3">
              <p>Cliente</p>
            </div>

            <div className="col-sm-12 col-md-5">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Buscar por nombre"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => this.filtrarPorNombre(e.target.value)}
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
              <button
                type="button"
                className="btn btn-success"
                onClick={() => this.mostrarModalInsertar()}
              >
                Nuevo Cliente
              </button>
            </div>
          </div>

          <br />
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUC</th>
                <th>CI</th>
                <th>Dirección</th>
                <th>Teléfono</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((dato) => (
                <tr key={dato.id_cliente}>
                  <td>{dato.str_nombre_cliente}</td>
                  <td>{dato.str_ruc_cliente}</td>
                  <td>{dato.str_ci_cliente}</td>
                  <td>{dato.str_direccion_cliente}</td>
                  <td>{dato.str_telefono_cliente}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                      </svg>
                    </button>{" "}
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => this.eliminar(dato)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3"
                        viewBox="0 0 16 16"
                      >
                        {" "}
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
            <div>
              <h3>Editar</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="str_nombre_cliente"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.str_nombre_cliente}
              />
            </FormGroup>

            <FormGroup>
              <label>RUC:</label>
              <input
                className="form-control"
                name="str_ruc_cliente"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.str_ruc_cliente}
              />
            </FormGroup>

            <FormGroup>
              <label>CI:</label>
              <input
                className="form-control"
                name="str_ci_cliente"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.str_ci_cliente}
              />
            </FormGroup>

            <FormGroup>
              <label>Teléfono:</label>
              <input
                className="form-control"
                name="str_telefono_cliente"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.str_telefono_cliente}
              />
            </FormGroup>

            <FormGroup>
              <label>Dirección:</label>
              <input
                className="form-control"
                name="str_direccion_cliente"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.str_direccion_cliente}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => this.editar(this.state.form)}
            >
              Editar
            </button>

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => this.cerrarModalActualizar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Nuevo Cliente</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="str_nombre_cliente"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>RUC:</label>
              <input
                className="form-control"
                name="str_ruc_cliente"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>CI:</label>
              <input
                className="form-control"
                name="str_ci_cliente"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Teléfono:</label>
              <input
                className="form-control"
                name="str_telefono_cliente"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Dirección:</label>
              <input
                className="form-control"
                name="str_direccion_cliente"
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
      </>
    );
  }
}
