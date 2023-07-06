import axios from "axios";
import React, { Component } from "react";
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

const data = [];

export class Recetas extends Component {
  state = {
    data: data,
    modalActualizar: false,
    modalInsertar: false,
    VerMas: false,
    form: {
      id_receta: "",
      str_receta: "",
      str_preparacion: "",
      fl_cantidad: "",
      fk_ingrediente: "",
    },
  };
  componentDidMount() {
    this.fetchRecetas();
  }

  fetchRecetas = () => {
    axios
      .get(
        "https://localhost:7089/api/recetas",
        "https://localhost:7089/api/ingredientes",
        "https://localhost:7089/api/detalles_recetas",
        "https://localhost:7089/api/ingredientes_stock"
      )
      .then((response) => {
        const recetas = response.data;
        this.setState({ data: recetas });
      })
      .catch((error) => {
        console.error("Error al obtener las rectas", error);
      });
  };

  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };
  verMasModal = (dato) => {
    this.setState({
      form: dato,
      VerMas: true,
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

  cerrarModalVerMas = () => {
    this.setState({ VerMas: false });
  };
  ver = (dato) => {
    const recetaActualizada = { ...this.state.form };
    axios
      .put(
        `https://localhost:7089/api/recetas/${dato.id_receta}`,
        recetaActualizada
      )
      .then((response) => {
        const recetaActualizada = response.data;
        const lista = this.state.data.map((receta) => {
          if (receta.id_receta === recetaActualizada.id_receta) {
            return recetaActualizada;
          }
          return receta;
        });
        this.setState({ data: lista, verMasModal: false });
      })
      .catch((error) => {
        console.error("Error al editar la recta:", error);
      });
  };

  editar = (dato) => {
    const recetaActualizada = { ...this.state.form };
    axios
      .put(
        `https://localhost:7089/api/recetas/${dato.id_receta}`,
        recetaActualizada
      )
      .then((response) => {
        const recetaActualizada = response.data;
        const lista = this.state.data.map((receta) => {
          if (receta.id_receta === recetaActualizada.id_receta) {
            return recetaActualizada;
          }
          return receta;
        });
        this.setState({ data: lista, modalActualizar: false });
      })
      .catch((error) => {
        console.error("Error al editar la recta:", error);
      });
  };

  eliminar = (dato) => {
    var opcion = window.confirm(
      "Estás seguro que deseas Eliminar la recta?" + dato.str_receta
    );
    if (opcion === true) {
      var contador = 0;
      var arreglo = this.state.data;
      arreglo.map((registro) => {
        if (dato.id_receta === registro.id_receta) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ data: arreglo, modalActualizar: false });
    }
  };

  insertar = () => {
    const nuevaReceta = {
      str_receta: this.state.form.str_receta,
      str_preparacion: this.state.form.str_preparacion,
      fl_cantidad: this.state.form.fl_cantidad,
      fk_ingrediente: this.state.form.fk_ingrediente,
    };

    axios
      .post("https://localhost:7089/api/recetas", nuevaReceta)
      .then((response) => {
        const recetaGuardada = response.data;
        const lista = [...this.state.data, recetaGuardada];
        this.setState({ modalInsertar: false, data: lista });
      })
      .catch((error) => {
        console.error("Error al guardar al gurdar la recta", error);
      });
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  filtrarPorNombre = (valorBusqueda) => {
    const listaOriginal = [...this.state.data];
    const listaFiltrada = listaOriginal.filter((receta) => {
      const recetaReceta = receta.str_receta.toLowerCase();
      const recetaValorBusqueda = valorBusqueda.toLowerCase();
      return recetaReceta.includes(recetaValorBusqueda);
    });
    this.setState({ data: listaFiltrada });
  };

  render() {
    return (
      <>
        <Container>
          <br />
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-3">
              <p>Recetas</p>
            </div>

            <div className="col-sm-12 col-md-5">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder=" Buscar por nombre"
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
                Nueva Receta
              </button>
            </div>
          </div>
          <br />
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ver Receta</th>
                </tr>
              </thead>

              <tbody>
                {this.state.data.map((dato) => (
                  <tr key={dato.id_receta}>
                    <td>{dato.str_receta}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => this.verMasModal(dato)}
                      >
                        {" "}
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
          </div>
        </Container>

        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
            <div>
              <h3>Editar</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>NOMBRE:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.str_receta}
              />
            </FormGroup>

            <FormGroup>
              <label>INGREDIENTES:</label>
              <input
                className="form-control"
                name="ruc"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.fk_ingrediente}
              />
            </FormGroup>

            <FormGroup>
              <label>PREPARACIÓN:</label>
              <input
                className="form-control"
                name="direccion"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.str_preparacion}
              />
            </FormGroup>

            <FormGroup>
              <label>CANTIDAD:</label>
              <input
                className="form-control"
                name="telefono"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.fl_cantidad}
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
              {" "}
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Nueva Receta</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>NOMBRE:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <div className="d-flex">
                <div className="mr-2">
                  <label>INGREDIENTES:</label>
                  <input
                    className="form-control"
                    name="ingrediente"
                    type="text"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <label>CANTIDAD:</label>
                  <input
                    className="form-control"
                    name="cantidad"
                    type="text"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </FormGroup>

            <FormGroup>
              <label>PREPARACIÓN:</label>
              <input
                className="form-control"
                name="preparacion"
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
              {" "}
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              {" "}
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.VerMas}>
          <div className="modal-body">
            <h2 className="fs-5">Ingredientes</h2>
            <p1>{this.state.form.fk_ingrediente} </p1>
            <hr></hr>
            <h2 className="fs-5">Preparación</h2>
            <p1>{this.state.form.str_preparacion} </p1>
            <hr></hr>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => this.cerrarModalVerMas()}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      </>
    );
  }
}
