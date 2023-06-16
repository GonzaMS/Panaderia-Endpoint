import axios from 'axios';
import React, { Component } from "react";
import "../css/custom.css"

import {
    Table,
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";

const data = [
 
];

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
        axios.get('https://localhost:7089/api/recetas',
        'https://localhost:7089/api/ingredientes',
         'https://localhost:7089/api/detalles_recetas'
        )
          .then(response => {
            const recetas = response.data;
            this.setState({ data: recetas });
          })
          .catch(error => {
            console.error('Error al obtener las rectas', error);
          });
      }
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
        axios.put(`https://localhost:7089/api/recetas/${dato.id_receta}`, recetaActualizada)
          .then(response => {
            const recetaActualizada = response.data;
            const lista = this.state.data.map(receta => {
              if (receta.id_receta === recetaActualizada.id_receta) {
                return recetaActualizada;
              }
              return receta;
            });
            this.setState({ data: lista,  verMasModal: false });
          })
          .catch(error => {
            console.error('Error al editar la recta:', error);
          });
      }
    
    editar = (dato) => {
        const recetaActualizada = { ...this.state.form };
        axios.put(`https://localhost:7089/api/recetas/${dato.id_receta}`, recetaActualizada)
          .then(response => {
            const recetaActualizada = response.data;
            const lista = this.state.data.map(receta => {
              if (receta.id_receta === recetaActualizada.id_receta) {
                return recetaActualizada;
              }
              return receta;
            });
            this.setState({ data: lista, modalActualizar: false });
          })
          .catch(error => {
            console.error('Error al editar la recta:', error);
          });
      }

      eliminar = (dato) => {
        var opcion = window.confirm("Estás seguro que deseas Eliminar la recta?" + dato.str_receta);
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
    
        axios.post('https://localhost:7089/api/recetas', nuevaReceta)
            .then(response => {
                const recetaGuardada = response.data;
                const lista = [...this.state.data, recetaGuardada];
                this.setState({ modalInsertar: false, data: lista });
            })
            .catch(error => {
                console.error('Error al guardar al gurdar la recta', error);
            });
    }

    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
            },
        });
    };
    
    filtrarPorNombre = (valorBusqueda) => {
        const datosFiltrados = data.filter(dato => {
        const str_receta = dato.str_receta.toLowerCase();
        const busqueda = valorBusqueda.toLowerCase();
        return str_receta.includes(busqueda);
        });
        this.setState({ data: datosFiltrados });
      }
      
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
                                <input type="search" className="form-control rounded" placeholder=" Buscar por nombre" aria-label="Search" aria-describedby="search-addon" onChange={(e) => this.filtrarPorNombre(e.target.value)}/>
                                <span className="input-group-text" id="basic-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16"> <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                               </span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                        <button type="button" className="btn btn-success" onClick={() => this.mostrarModalInsertar()}>Nueva Receta</button>
                        </div>
                    </div>
                    <br />
                    <div className="table-responsive">
                    <Table >
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cantidad Por receta</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                        {this.state.data.map((dato) => (
                                <tr key={dato.id_receta}>
                                    <td>{dato.str_receta}</td>
                                    <td>{dato.fl_cantidad}</td>
                                    <td>
                                            
                                            <button type="button" className="btn btn-outline-success" 
                                             onClick={() => this.mostrarModalActualizar(dato)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                                            </button>
                                            <button type="button" className="btn btn-outline-danger" onClick={() => this.eliminar(dato)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                                        className="bi bi-trash3" viewBox="0 0 16 16"> <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                             </svg>
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary"
                                            onClick={() => this.verMasModal(dato)}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                             <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                             <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                           </svg></svg> 
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
                        <div><h3>Editar</h3></div>
                    </ModalHeader>

                    <ModalBody>


                        <FormGroup>
                            <label>
                                NOMBRE:
                            </label>
                            <input className="form-control" name="nombre" type="text" onChange={this.handleChange} value={this.state.form.str_receta} />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                INGREDIENTES:
                            </label>
                            <input className="form-control" name="ruc" type="text" onChange={this.handleChange} value={this.state.form.fk_ingrediente} />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                PREPARACIÓN:
                            </label>
                            <input className="form-control" name="direccion" type="text" onChange={this.handleChange} value={this.state.form.str_preparacion}/>
                        </FormGroup>

                        <FormGroup>
                            <label>
                                CANTIDAD:
                            </label>
                            <input className="form-control"  name="telefono"type="text" onChange={this.handleChange}value={this.state.form.fl_cantidad} />
                        </FormGroup>

                    </ModalBody>

                    <ModalFooter>
                         <button type="button" className="btn btn-outline-success" onClick={() => this.editar(this.state.form)}>Editar</button>
                        
                         <button type="button" className="btn btn-outline-danger" onClick={() => this.cerrarModalActualizar()}>  Cancelar</button>
                      
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div><h3>Nueva Receta</h3></div>
                    </ModalHeader>

                    <ModalBody>


                        <FormGroup>
                            <label>
                                NOMBRE:
                            </label>
                            <input  className="form-control" name="nombre" type="text"  onChange={this.handleChange}   />
                        </FormGroup>

                        <FormGroup>
                        <label>
                                INGREDIENTES:
                            </label>
                            <input className="form-control" name="ingrediente" type="text" onChange={this.handleChange}  />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                PREPARACIÓN:
                            </label>
                            <input className="form-control" name="preparacion" type="text" onChange={this.handleChange}  />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                CANTIDAD:
                            </label>
                            <input className="form-control" name="cantidad" type="text"onChange={this.handleChange} />
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                    <button type="button" className="btn btn-outline-success" onClick={() => this.insertar()}> Guardar</button> 
                        <button type="button" className="btn btn-outline-danger" onClick={() => this.cerrarModalInsertar()}>  Cancelar</button>   
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
                        <button type="button" className="btn btn-outline-danger" onClick={() => this.cerrarModalVerMas()}>Cancelar</button>   
                   
                    </div>

                </Modal>
            </>
        );
    }
}
