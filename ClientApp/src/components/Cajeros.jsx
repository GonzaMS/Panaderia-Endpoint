import React, { Component } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

export class Cajeros extends Component {
  state = {
    cajeros: [], // state to store the cajeros
    modalOpen: false, // state to control modal visibility
    modalAddOpen: false, // state to control add modal visibility
    newCajeroName: "", // state to store the new cajero name
    editCajeroId: null, // state to store the ID of the cajero being edited
    editCajeroName: "", // state to store the new name of the cajero being edited
  };

  //Obtenemos los datos de la API
  componentDidMount() {
    this.fetchData();
  }

  //Obtenemos los datos de la API
  fetchData() {
    axios
      .get("https://localhost:7089/api/cajeros")
      .then((response) => {
        const cajeros = response.data;
        this.setState({ cajeros });
      })
      .catch((error) => {
        console.error("Error al obtener los cajeros:", error);
      });
  }

  //Funciones para abrir y cerrar el modal
  toggleModal = () => {
    this.setState((prevState) => ({
      modalOpen: !prevState.modalOpen,
      editCajeroId: null,
      editCajeroName: "",
    }));
  };

  //Funciones para agregar un nuevo cajero
  toggleAddModal = () => {
    this.setState((prevState) => ({
      modalAddOpen: !prevState.modalAddOpen,
    }));
  };

  //Nombre del cajero
  handleCajeroNameChange = (event) => {
    this.setState({ newCajeroName: event.target.value });
  };

  //Funcion para agregar un nuevo cajero
  addCajero = () => {
    const { newCajeroName } = this.state;
    const newCajero = {
      str_nombre_cajero: newCajeroName,
    };

    axios
      .post("https://localhost:7089/api/cajeros", newCajero)
      .then(() => {
        this.toggleAddModal();
        this.fetchData();
        this.setState({ newCajeroName: "" });
      })
      .catch((error) => {
        console.error("Error al agregar el cajero:", error);
      });
  };

  /*
  //Funcion para eliminar un cajero
  deleteCajero = (cajeroId) => {
    axios
      .delete(`https://localhost:7089/api/cajeros/${cajeroId}`)
      .then(() => {
        this.fetchData();
      })
      .catch((error) => {
        console.error("Error al eliminar el cajero:", error);
      });
  };

                      <button
                      type="button"
                      className="btn btn-link text-danger"
                      onClick={() => this.deleteCajero(cajero.id_cajero)}
                    >
                      Eliminar
                    </button>
  */

  //Funcion para editar un cajero
  editCajero = (cajeroId, cajeroName) => {
    this.setState({
      modalOpen: true,
      editCajeroId: cajeroId,
      editCajeroName: cajeroName,
    });
  };

  //Funcion para guardar los cambios en un cajero editado
  saveEditedCajero = () => {
    const { editCajeroId, editCajeroName } = this.state;
    const editedCajero = {
      id_cajero: editCajeroId,
      str_nombre_cajero: editCajeroName,
    };

    axios
      .put(`https://localhost:7089/api/cajeros/${editCajeroId}`, editedCajero)
      .then(() => {
        this.toggleModal();
        this.fetchData();
        this.setState({ editCajeroId: null, editCajeroName: "" });
      })
      .catch((error) => {
        console.error("Error al editar el cajero:", error);
      });
  };

  //Funcion para filtrar por nombre
  filtrarPorCajero = (nombreCajero) => {
    if (nombreCajero.trim() === "") {
      this.fetchData();
    } else {
      axios
        .get(`https://localhost:7089/api/cajeros/Buscar/${nombreCajero}`)
        .then((response) => {
          const cajeros = response.data;
          this.setState({ cajeros });
        })
        .catch((error) => {
          console.error("Error al obtener los cajeros:", error);
        });
    }
  };

  render() {
    const { cajeros, modalOpen, modalAddOpen, newCajeroName, editCajeroName } =
      this.state;

    return (
      <>
        <Container>
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-3">
              <p>Cajeros</p>
            </div>
            <div className="col-sm-12 col-md-5">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Buscar por nombre"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => this.filtrarPorCajero(e.target.value)}
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
                    <path
                      fillRule="evenodd"
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                  </svg>
                </span>
              </div>
            </div>
            ... ...
            <div className="col-sm-12 col-md-4">
              <button
                type="button"
                className="btn btn-success"
                onClick={this.toggleAddModal}
              >
                Nuevo Cajero
              </button>
            </div>
          </div>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cajeros.map((cajero) => (
                <tr key={cajero.id_cajero}>
                  <td>{cajero.str_nombre_cajero}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link text-primary"
                      onClick={() =>
                        this.editCajero(
                          cajero.id_cajero,
                          cajero.str_nombre_cajero
                        )
                      }
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        {/* Modal */}
        <Modal isOpen={modalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Editar Cajero</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="cajeroName">Nombre</Label>
              <Input
                type="text"
                name="cajeroName"
                id="cajeroName"
                placeholder="Ingrese el nombre del cajero"
                value={editCajeroName}
                onChange={(e) =>
                  this.setState({ editCajeroName: e.target.value })
                }
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveEditedCajero}>
              Guardar
            </Button>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal */}
        <Modal isOpen={modalAddOpen} toggle={this.toggleAddModal}>
          <ModalHeader toggle={this.toggleAddModal}>Agregar Cajero</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="cajeroName">Nombre</Label>
              <Input
                type="text"
                name="cajeroName"
                id="cajeroName"
                placeholder="Ingrese el nombre del cajero"
                value={newCajeroName}
                onChange={this.handleCajeroNameChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addCajero}>
              Guardar
            </Button>
            <Button color="secondary" onClick={this.toggleAddModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
