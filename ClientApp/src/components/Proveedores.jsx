import React, { Component } from 'react';
import axios from "axios";
import {
    Table,Container,Modal,ModalHeader,ModalBody,ModalFooter,FormGroup
  } from "reactstrap";
import '../css/custom.css';

export class Proveedores extends Component {
    state = {
        data: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            id_proveedor: "",
            str_nombre_proveedor: "",
            str_ruc_proveedor: "",
            str_direccion_proveedor: "",
            str_telefono_proveedor: "",
            str_correo_proveedor:""
        },
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
       axios.get('https://localhost:7089/api/proveedores')
       .then(response => {
       const proveedores = response.data;
       this.setState({ data: proveedores });
       })
       .catch(error => {
       console.error('Error al obtener los proveedores:', error);
       });
    };

    validarCampos = () => {
        const { str_nombre_proveedor, str_ruc_proveedor, str_direccion_proveedor, str_telefono_proveedor, str_correo_proveedor } = this.state.form;
        if (
          str_nombre_proveedor.trim() === "" ||
          str_ruc_proveedor.trim() === "" ||
          str_direccion_proveedor.trim() === "" ||
          str_telefono_proveedor.trim() === "" ||
          str_correo_proveedor.trim() === ""
        ) {
          alert("Por favor complete todos los campos");
          return false;
        }
        return true;
      };
      
    mostrarModalActualizar = (dato) => {
        this.setState({
            form: dato,
            modalActualizar: true,
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

    editar = (dato) => {
        if (!this.validarCampos()) {
          return;
        }
        const proveedorActualizado = { ...this.state.form };
        axios
          .put(`https://localhost:7089/api/proveedores/${dato.id_proveedor}`, proveedorActualizado)
          .then((response) => {
            const proveedorActualizadoRespuesta = response.data; // Usar la respuesta de la API
            const lista = this.state.data.map((proveedor) => {
              if (proveedor.id_proveedor === proveedorActualizado.id_proveedor) {
                return proveedorActualizadoRespuesta; // Usar el proveedor actualizado de la respuesta
              }
              return proveedor;
            });
            this.setState({ data: lista, modalActualizar: false });
          })
          .catch((error) => {
            console.error('Error al editar el proveedor:', error);
          });
      };
      

    eliminar = (dato) => {
        var opcion = window.confirm("Estás seguro que deseas ELIMINAR al proveedor " + dato.str_nombre_proveedor);
        if (opcion === true) {
            axios.delete(`https://localhost:7089/api/proveedores/${dato.id_proveedor}`)
                .then(response => {
                    const lista = this.state.data.filter(proveedor => proveedor.id_proveedor !== dato.id_proveedor);
                    this.setState({ data: lista, modalActualizar: false });
                })
                .catch(error => {
                    console.error('Error al eliminar al proveedor:', error);
                });
        }
    };

    insertar = () => {
        if (!this.validarCampos()) {
            return;
        }
        const nuevoProveedor = {
            str_nombre_proveedor: this.state.form.str_nombre_proveedor,
            str_ruc_proveedor: this.state.form.str_ruc_proveedor,
            str_direccion_proveedor: this.state.form.str_direccion_proveedor,
            str_telefono_proveedor: this.state.form.str_telefono_proveedor,
            str_correo_proveedor: this.state.form.str_correo_proveedor,
        };
    
        axios.post('https://localhost:7089/api/proveedores', nuevoProveedor)
            .then(response => {
                const proveedorGuardado = response.data;
                const lista = [...this.state.data, proveedorGuardado];
                this.setState({ modalInsertar: false, data: lista });
            })
            .catch(error => {
                console.error('Error al guardar al proveedor:', error);
            });
    };

        
    filtrarPorNombre = (nombreProveedor) => {
        if (nombreProveedor.trim() === "") {
          this.fetchData();
        } else {
          axios
            .get(
              `https://localhost:7089/api/Proveedores/Buscar/${nombreProveedor}`
            )
            .then((response) => {
              const data = response.data;
              this.setState({ data });
            })
            .catch((error) => {
              alert("Error al obtener los productos elaborados");
              console.error("Error al obtener los proveedores:", error);
            });
        }
      };
    
    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
            },
        });
    };

    render() {
        return (
            <>
                <Container>
                    <br />
                    
                    <br />
                    <div className="row">
                        <div className="col-sm-12 col-md-3">
                            <p>Proveedor</p>
                        </div>
                        
                        <div className="col-sm-12 col-md-5">
                            <div className="input-group">
                                <input type="search" className="form-control rounded" placeholder=" Buscar por nombre" aria-label="Search" aria-describedby="search-addon" onChange={(e) => this.filtrarPorNombre(e.target.value)}/>
                                <span className="input-group-text" id="basic-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16"> <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                               </span>
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-4">
                        <button type="button" className="btn btn-success" onClick={() => this.mostrarModalInsertar()}>Nuevo Proveedor</button>
                            
                        </div>
                    </div>

                    <br />
                    <Table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>RUC</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.data.map((dato) => (
                                <tr key={dato.id_proveedor}>
                                    <td>{dato.str_nombre_proveedor}</td>
                                    <td>{dato.str_ruc_proveedor}</td>
                                    <td>{dato.str_direccion_proveedor}</td>
                                    <td>{dato.str_telefono_proveedor}</td>
                                    <td>{dato.str_correo_proveedor}</td>
                                    <td>
                                            <button type="button" className="btn btn-outline-success" 
                                             onClick={() => this.mostrarModalActualizar(dato)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                                            </button>{" "}
                                            <button type="button" className="btn btn-outline-danger" onClick={() => this.eliminar(dato)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                                        className="bi bi-trash3" viewBox="0 0 16 16"> <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
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
                        <div><h3>Editar</h3></div>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <label>
                                NOMBRE:
                            </label>
                            <input className="form-control" name="str_nombre_proveedor" type="text" onChange={this.handleChange} value={this.state.form.str_nombre_proveedor} />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                RUC:
                            </label>
                            <input className="form-control" name="str_ruc_proveedor" type="text" onChange={this.handleChange} value={this.state.form.str_ruc_proveedor} />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                DIRECCION:
                            </label>
                            <input className="form-control" name="str_direccion_proveedor" type="text" onChange={this.handleChange} value={this.state.form.str_direccion_proveedor}/>
                        </FormGroup>

                        <FormGroup>
                            <label>
                                TELEFONO:
                            </label>
                            <input className="form-control"  name="str_telefono_proveedor"type="text" onChange={this.handleChange}value={this.state.form.str_telefono_proveedor} />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                CORREO:
                            </label>
                            <input className="form-control"  name="str_correo_proveedor"type="text" onChange={this.handleChange}value={this.state.form.str_correo_proveedor} />
                        </FormGroup>

                    </ModalBody>

                    <ModalFooter>
                         <button type="button" className="btn btn-outline-success" onClick={() => this.editar(this.state.form)}>Editar</button>
                        
                         <button type="button" className="btn btn-outline-danger" onClick={() => this.cerrarModalActualizar()}>  Cancelar</button>
                      
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div><h3>Nuevo Proveedor</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <label>
                                NOMBRE:
                            </label>
                            <input  className="form-control" name="str_nombre_proveedor" type="text"  onChange={this.handleChange}   />
                        </FormGroup>

                        <FormGroup>
                        <label>
                                RUC:
                            </label>
                            <input className="form-control" name="str_ruc_proveedor" type="text" onChange={this.handleChange}  />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                DIRECCION:
                            </label>
                            <input className="form-control" name="str_direccion_proveedor" type="text" onChange={this.handleChange}  />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                TELEFONO:
                            </label>
                            <input className="form-control" name="str_telefono_proveedor" type="text"onChange={this.handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                CORREO:
                            </label>
                            <input className="form-control" name="str_correo_proveedor" type="text"onChange={this.handleChange} />
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                    <button type="button" className="btn btn-outline-success" onClick={() => this.insertar()}> Guardar</button> 
                        <button type="button" className="btn btn-outline-danger" onClick={() => this.cerrarModalInsertar()}>  Cancelar</button>   
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}
