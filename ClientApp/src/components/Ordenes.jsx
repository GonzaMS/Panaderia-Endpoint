import React, { Component } from "react";
import axios from "axios";
import "../css/custom.css";

import {
  ListGroupItem,
  ListGroup,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";

export class Ordenes extends Component {
  state = {
    ordenes: [], // Lista de ordenes de produccion
    productos_elaborados: [], // Lista de productos elaborados
    ingredientes_stock: [], // Lista de ingredientes en stock
    ingredientes: [], // Lista de ingredientes
    recetas: [], // Lista de recetas
    detalles_recetas: [], // Lista de detalles de recetas
    items: [], // Lista de items de la orden
    producto_elaborado: "", // Producto elaborado seleccionado
    cantidad: "", // Cantidad del producto elaborado
  };

  componentDidMount() {
    this.fetchData();
  }

  // Obtener los datos de la API
  fetchData() {
    try {
      // Obtenemos todas las ordenes de produccion
      axios
        .get("https://localhost:7089/api/ordenes_produccion")
        .then((response) => {
          const data = response.data;
          this.setState({ ordenes: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      // Obtenemos todos los productos elaborados
      axios
        .get("https://localhost:7089/api/productos_elaborados")
        .then((response) => {
          const data = response.data;
          this.setState({ productos_elaborados: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      // Obtenemos todos los ingredientes en stock
      axios
        .get("https://localhost:7089/api/ingredientes_stock")
        .then((response) => {
          const data = response.data;
          this.setState({ ingredientes_stock: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      // Obtenemos todos los ingredientes
      axios
        .get("https://localhost:7089/api/ingredientes")
        .then((response) => {
          const data = response.data;
          this.setState({ ingredientes: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      // Obtenemos todas las recetas
      axios
        .get("https://localhost:7089/api/recetas")
        .then((response) => {
          const data = response.data;
          this.setState({ recetas: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      // Obtenemos todos los detalles de recetas
      axios
        .get("https://localhost:7089/api/detalles_recetas")
        .then((response) => {
          const data = response.data;
          this.setState({ detalles_recetas: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  // Agregar un producto al arreglo de items
  addItem() {
    const { producto_elaborado, cantidad, productos_elaborados, items } =
      this.state;

    if (!producto_elaborado || cantidad <= 0) {
      alert(
        "Debe seleccionar un producto elaborado y especificar una cantidad válida."
      );
      return;
    }

    const producto = productos_elaborados.find(
      (producto) =>
        producto.id_producto_elaborado === Number(producto_elaborado)
    );

    const newItem = {
      id_producto_elaborado: producto.id_producto_elaborado,
      str_nombre_producto: producto.str_nombre_producto,
      fk_receta: producto.fk_recetas,
      cantidad: Number(cantidad),
    };

    const newItems = [...items, newItem];
    this.setState({ items: newItems, producto_elaborado: "", cantidad: "" });

    console.log(newItems);
  }

  // Eliminar un producto del arreglo de items
  removeItem(index) {
    const { items } = this.state;
    const newItems = [...items];
    newItems.splice(index, 1);
    this.setState({ items: newItems });
  }

  // Validar si se pueden agregar órdenes
  canAddOrder() {
    const { items } = this.state;
    return items.length > 0;
  }

  async handleSubmit(event, items) {
    event.preventDefault();
    const {
      recetas,
      detalles_recetas,
      productos_elaborados,
      ingredientes,
      ingredientes_stock,
    } = this.state;

    console.log(items);

    // Obtenemos los productos elaborados, de los productos elaborados seleccionados que se encuentra en items
    const producto = productos_elaborados.filter((producto) =>
      items.find(
        (item) => item.id_producto_elaborado === producto.id_producto_elaborado
      )
    );

    console.log(producto);

    // Obtener la receta de los productos elaborados seleccionados
    const receta = producto.map((producto) =>
      recetas.find((receta) => receta.id_receta === producto.fk_recetas)
    );

    console.log(receta);

    // Obtener todos los detalles de recetas de las recetas de los productos elaborados seleccionados
    const detallesRecetasFiltrados = receta.flatMap((receta) =>
      detalles_recetas.filter(
        (detalle) => detalle.fk_receta === receta.id_receta
      )
    );

    console.log(detallesRecetasFiltrados);

    // Multiplicar la cantidad de cada ingrediente de cada producto elaborado seleccionado en items
    const ingredientesNecesarios = [];
    detallesRecetasFiltrados.forEach((detalle) => {
      const ingrediente = ingredientes.find(
        (ingrediente) => ingrediente.id_ingrediente === detalle.fk_ingrediente
      );

      console.log(ingrediente);

      const cantidadNecesaria =
        detalle.fl_cantidad *
        items.find((item) => item.fk_receta === detalle.fk_receta).cantidad;

      console.log(cantidadNecesaria);

      // Buscar si el ingrediente ya existe en ingredientesNecesarios
      const index = ingredientesNecesarios.findIndex(
        (ingredienteNecesario) =>
          ingredienteNecesario.id_ingrediente === ingrediente.id_ingrediente
      );

      // Si el ingrediente ya existe, sumar las cantidades
      if (index !== -1) {
        ingredientesNecesarios[index].cantidad_necesaria += cantidadNecesaria;
      } else {
        // Si el ingrediente no existe, agregarlo al arreglo
        ingredientesNecesarios.push({
          id_ingrediente: ingrediente.id_ingrediente,
          cantidad_necesaria: cantidadNecesaria,
        });
      }
    });

    console.log(ingredientesNecesarios);

    // Verificar si hay stock suficiente de cada ingrediente en ingredientes_stock
    const ingredientesInsuficientes = ingredientesNecesarios.filter(
      (ingrediente) => {
        console.log(ingrediente);
        const ingredienteStock = ingredientes_stock.find(
          (stock) => stock.fk_ingredientes === ingrediente.id_ingrediente
        );

        console.log(ingredienteStock);

        // Si no hay stock del ingrediente, retornar true
        return (
          ingredienteStock &&
          ingredienteStock.fl_cantidad < ingrediente.cantidad_necesaria
        );
      }
    );

    // Si hay ingredientes insuficientes, mostrar un alert y no hacer nada
    if (ingredientesInsuficientes.length > 0) {
      console.log(ingredientesInsuficientes);
      const nombresIngredientes = ingredientesInsuficientes.map(
        (ingrediente) => {
          const nombreIngrediente = ingredientes.find(
            (ingredienteInsuficiente) =>
              ingredienteInsuficiente.id_ingrediente ===
              ingrediente.id_ingrediente
          ).str_nombre_ingrediente;
          return nombreIngrediente;
        }
      );

      alert(
        `No hay suficiente stock de los siguientes ingredientes: ${nombresIngredientes.join(
          ", "
        )}`
      );
      return;
    }

    // Si hay stock suficiente, restar la cantidad de cada ingrediente en ingredientes_stock
    ingredientesNecesarios.forEach((ingrediente) => {
      const ingredienteStock = ingredientes_stock.find(
        (stock) => stock.fk_ingredientes === ingrediente.id_ingrediente
      );

      console.log(ingredienteStock);

      ingredienteStock.fl_cantidad -= ingrediente.cantidad_necesaria;

      console.log(ingredienteStock);

      const body = JSON.stringify(ingredienteStock);

      axios.put(
        `https://localhost:7089/api/ingredientes_stock/${ingredienteStock.fk_ingredientes}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    try {
      // Iterar sobre cada producto elaborado en items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
    
        // Obtener la cantidad y el id_producto_elaborado del elemento actual
        const { cantidad, id_producto_elaborado } = item;
    
        const response = await axios.post(
          "https://localhost:7089/api/ordenes_produccion",
          {
            fl_cantidad: cantidad,
            fk_producto_elaborado: id_producto_elaborado,
            bool_estado_orden: false
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    
      // Resto del código
      this.setState({
        cantidad: "",
        producto_elaborado: "",
        recetas: [],
        detalles_recetas: [],
        ingredientes_stock: [],
        items: [],
      });
      this.fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  // Controlar los cambios en los inputs
  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { productos_elaborados, cantidad, items } = this.state;
    console.log(items);

    return (
      <div className="col-sm-12">
        <h2>Agregar Orden de Producción</h2>
        <form onSubmit={(event) => this.handleSubmit(event, items)}>
          <Row>
            <Col sm="4">
              <FormGroup>
                <Label for="producto_elaborado">Producto Elaborado</Label>
                <Input
                  type="select"
                  name="producto_elaborado"
                  id="producto_elaborado"
                  value={this.state.producto_elaborado}
                  onChange={(event) => this.handleInputChange(event)}
                >
                  <option value="">Seleccionar Producto</option>
                  {productos_elaborados.map((producto) => (
                    <option
                      key={producto.id_producto_elaborado}
                      value={producto.id_producto_elaborado}
                    >
                      {producto.str_nombre_producto}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <Label for="cantidad">Cantidad</Label>
                <Input
                  type="number"
                  name="cantidad"
                  id="cantidad"
                  value={cantidad}
                  onChange={(event) => this.handleInputChange(event)}
                />
              </FormGroup>
            </Col>
            <Col sm="4">
              <Button color="primary" onClick={() => this.addItem()}>
                Agregar Item
              </Button>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              {items.length > 0 && (
                <div>
                  <h4>Items:</h4>
                  <ListGroup>
                    {items.map((item, index) => (
                      <ListGroupItem key={index}>
                        <Row>
                          <Col sm="4">{item.str_nombre_producto}</Col>
                          <Col sm="4">{item.cantidad}</Col>
                          <Col sm="4">
                            <Button
                              color="danger"
                              onClick={() => this.removeItem(index)}
                            >
                              Eliminar
                            </Button>
                          </Col>
                        </Row>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Button
                color="success"
                disabled={!this.canAddOrder()}
                type="submit"
              >
                Crear Orden
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}
