import React, { Component } from "react";
import axios from "axios";
import "../css/custom.css";
import {
  Table,Container,Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Label,Input,Button,
} from "reactstrap";

export class ProductosElaborados extends Component {
  state = {
    productosElaborados: [], // Estado para almacenar los productos elaborados
    recetas: [], // Estado para almacenar las recetas
    detallesRecetas: [], // Estado para almacenar los detalles de las recetas
    ingredientes: [], // Estado para almacenar los ingredientes
    modalOpen: false, // Estado para controlar la visibilidad del modal
    modalAddOpen: false, // Estado para controlar la visibilidad del modal de agregar
    selectedReceta: null, // Estado para almacenar la receta seleccionada
    editProductId: null, // Estado para almacenar el ID del producto a editar
    newProductName: "", // Estado para almacenar el nombre del nuevo producto
    selectedRecetaId: "", // Estado para almacenar el ID de la receta seleccionada
    productoPrecio: "", // Estado para almacenar el precio del producto
  };

  componentDidMount() {
    this.fetchData();
  }

  // Función para obtener los datos de la API
  fetchData() {
    try{

      // Se obtienen los productos elaborados
    axios
      .get("https://localhost:7089/api/productos_elaborados")
      .then((response) => {
        const productosElaborados = response.data;
        this.setState({ productosElaborados });
      })
      .catch((error) => {
        alert("Error al obtener los productos elaborados")
        console.error("Error al obtener los productos elaborados:", error);
      });

      // Se obtienen las recetas
    axios
      .get("https://localhost:7089/api/recetas")
      .then((response) => {
        const recetas = response.data;
        this.setState({ recetas });
      })
      .catch((error) => {
        alert("Error al obtener las recetas")
        console.error("Error al obtener las recetas:", error);
      });

      // Se obtienen los detalles de las recetas
    axios
      .get("https://localhost:7089/api/detalles_recetas")
      .then((response) => {
        const detallesRecetas = response.data;
        this.setState({ detallesRecetas });
      })
      .catch((error) => {
        alert("Error al obtener los detalles de las recetas")
        console.error("Error al obtener los detalles de las recetas:", error);
      });

      // Se obtienen los ingredientes
    axios
      .get("https://localhost:7089/api/ingredientes")
      .then((response) => {
        const ingredientes = response.data;
        this.setState({ ingredientes });
      })
      .catch((error) => {
        alert("Error al obtener los ingredientes")
        console.error("Error al obtener los ingredientes:", error);
      });
    }catch(error){
      alert("Error al obtener los datos")
      console.error("Error al obtener los datos:", error);
    }

  }

  // Función para abrir el modal
  toggleModal = () => {
    this.setState((prevState) => ({
      modalOpen: !prevState.modalOpen,
    }));
  };

  // Función para cerrar el modal de agregar
  toggleAddModal = () => {
    this.setState((prevState) => ({
      modalAddOpen: !prevState.modalAddOpen,
      editModalOpen: false,
    }));
  };

  // Handler para el cambio de nombre del producto
  handleProductNameChange = (event) => {
    this.setState({ newProductName: event.target.value });
  };

  // Handler para el cambio de precio del producto
  handleProductPrice =(event) => {
    this.setState({productoPrecio: event.target.value})
  }

  // Handler para el cambio de receta seleccionada
  handleRecetaChange = (event) => {
    this.setState({ selectedRecetaId: event.target.value });
  };

  // Función para ver la receta y sus ingredientes
  verReceta = (recetaId) => {
    axios
      .get(`https://localhost:7089/api/recetas/${recetaId}`)
      .then((response) => {
        const selectedReceta = response.data;
        const detallesReceta = this.obtenerDetallesReceta(recetaId); // Obtener los detalles de la receta
        selectedReceta.detalles = detallesReceta; // Agregar los detalles al objeto de la receta
        this.setState({ selectedReceta });
        console.log(detallesReceta);
        this.toggleModal();
      })
      .catch((error) => {
        alert("Error al obtener la receta");
        console.error("Error al obtener la receta:", error);
      });
  };


  //Funcion para agregar un producto elaborado
  addProductoElaborado = () => {
    const { newProductName, selectedRecetaId, productoPrecio } = this.state;

    const newProduct = {
      str_nombre_producto: newProductName,
      fk_recetas: parseInt(selectedRecetaId),
      fl_precio_unitario: parseFloat(productoPrecio),
    };

    axios
      .post("https://localhost:7089/api/productos_elaborados", newProduct)
      .then(() => {
        this.toggleAddModal();
        this.fetchData();
        this.setState({ newProductName: "", selectedRecetaId: "" , productoPrecio: ""});
      })
      .catch((error) => {
        alert("Error al agregar el producto elaborado");
        console.error("Error al agregar el producto elaborado:", error);
      });
  };

  //Funcion para eliminar un producto elaborado
  deleteProductoElaborado = (productId) => {
    axios
      .delete(`https://localhost:7089/api/productos_elaborados/${productId}`)
      .then(() => {
        this.fetchData();
        this.setState({ editModalOpen: false });
      })
      .catch((error) => {
        alert("Error al eliminar el producto elaborado");
        console.error("Error al eliminar el producto elaborado:", error);
      });
  };

  
  //Funcion para filtrar por nombre de producto
  filtrarPorProducto = (nombreProducto) => {
    if (nombreProducto.trim() === "") {
      this.fetchData();
    } else {
      axios
        .get(
          `https://localhost:7089/api/Productos_elaborados/Buscar/${nombreProducto}`
        )
        .then((response) => {
          const productosElaborados = response.data;
          this.setState({ productosElaborados });
        })
        .catch((error) => {
          alert("Error al obtener los productos elaborados");
          console.error("Error al obtener los productos elaborados:", error);
        });
    }
  };

  //Obtener todos los detalles de una receta, dado su ID lo guardo en un array y obtenemos el nombre del ingrediente y la cantidad
  obtenerDetallesReceta = (recetaId) => {
    const { detallesRecetas, ingredientes } = this.state;
    const detalles = [];

    // Por cada detalle de receta, si el id de la receta es igual al id de la receta que se está buscando, se agrega al array de detalles
    detallesRecetas.forEach((detalle) => {
      if (detalle.fk_receta === recetaId) {
        const ingrediente = ingredientes.find(
          (ingrediente) => ingrediente.id_ingrediente === detalle.fk_ingrediente
        );
        detalles.push({
          ingrediente: ingrediente.str_nombre_ingrediente,
          cantidad: detalle.fl_cantidad,
        });
      }
    });
    return detalles;
  };

  render() {
    const {
      productosElaborados,
      recetas,
      modalOpen,
      selectedReceta,
      modalAddOpen,
      newProductName,
      selectedRecetaId,
      productoPrecio
    } = this.state;

    return (
      <>
        <Container>
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-3">
              <p>Producto Elaborado</p>
            </div>
            <div className="col-sm-12 col-md-5">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Buscar por nombre"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => this.filtrarPorProducto(e.target.value)}
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
            <div className="col-sm-12 col-md-4">
              <button
                type="button"
                className="btn btn-success"
                onClick={this.toggleAddModal}
              >
                Nuevo Producto Elaborado
              </button>
            </div>
          </div>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Precio Unitario</th>
                <th>Nombre</th>
                <th>Ver Receta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosElaborados.map((producto) => (
                <tr key={producto.id_producto_elaborado}>
                  <td>{producto.fl_precio_unitario}</td>
                  <td>{producto.str_nombre_producto}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => this.verReceta(producto.fk_recetas)}
                    >
                      Ver Receta
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link text-danger"
                      onClick={() =>
                        this.deleteProductoElaborado(
                          producto.id_producto_elaborado
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        
        {/* Modal */}
        <Modal isOpen={modalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Receta</ModalHeader>
          <ModalBody>
            {selectedReceta && (
              <>
                <h5>{selectedReceta.str_nombre_receta}</h5>
                <p>{selectedReceta.str_preparacion}</p>
                <h6>Ingredientes:</h6>
                <ul>
                  {selectedReceta.detalles.map((detalle) => (
                    <li key={detalle.ingrediente}>
                      {detalle.ingrediente}: {detalle.cantidad}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </ModalBody>
        </Modal>

        {/* Add Modal */}
        <Modal isOpen={modalAddOpen} toggle={this.toggleAddModal}>
          <ModalHeader toggle={this.toggleAddModal}>
            Nuevo Producto Elaborado
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="newProductName">Nombre del Producto</Label>
              <Input
                type="text"
                id="newProductName"
                value={newProductName}
                onChange={this.handleProductNameChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="selectReceta">Receta</Label>
              <Input
                type="select"
                id="selectReceta"
                value={selectedRecetaId}
                onChange={this.handleRecetaChange}
              >
                <option value="">Seleccione una receta</option>
                {recetas.map((receta) => (
                  <option value={receta.id_receta} key={receta.id_receta}>
                    {receta.str_receta}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
          <Label for="productPrice">Precio del Producto</Label>
          <Input
            type="number"
            name="productPrice"
            id="productPrice"
            value={productoPrecio}
            onChange={this.handleProductPrice}
          />
        </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.addProductoElaborado}
              disabled={!newProductName || !selectedRecetaId}
            >
              Agregar
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
