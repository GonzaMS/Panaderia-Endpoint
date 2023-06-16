import React, { Component } from "react";
import axios from "axios";
import "../css/custom.css";

import { Table, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";

export class OrdenesProduccion extends Component {
  state = {
    ordenes: [],
    productos_elaborados: [],
    ingredientes_stock: [],
    ingredientes: [],
    detalles_recetas: [],
    recetas: [],
    cantidad: "",
    producto_elaborado: "",
    filtroEstado: "",
  };

  componentDidMount() {
    this.fetchData();
  }

  // Obtener los datos de la API
  fetchData() {
    try {
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

  // Actualizar el estado de una orden
  async handleUpdateOrden(id, newState) {
    try {
      const response = await axios.get(
        `https://localhost:7089/api/ordenes_produccion/${id}`
      );
      const data = response.data;
      const body = JSON.stringify({ ...data, bool_estado_orden: newState });
      await axios.put(
        `https://localhost:7089/api/ordenes_produccion/${id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.fetchData();
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  // Agregar una nueva orden
  async handleSubmit(event) {
    event.preventDefault();
    const { cantidad, producto_elaborado } = this.state;
    if (!producto_elaborado) {
      alert("Debe seleccionar un producto elaborado");
      return;
    } else if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7089/api/ordenes_produccion",
        {
          int_cantidad: cantidad,
          fk_producto_elaborado: producto_elaborado,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      this.setState({ cantidad: "", producto_elaborado: "" });
      this.fetchData();
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  //Controlar los cambios en los inputs
  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  //Controlar los cambios en el filtro por estado
  handleFiltroEstadoChange(event) {
    this.setState({ filtroEstado: event.target.value });
  }

  // Obtener el nombre de un producto elaborado
  getNombreProductoElaborado(id) {
    const { productos_elaborados } = this.state;
    const producto = productos_elaborados.find(
      (producto) => producto.id_producto_elaborado === id
    );
    return producto ? producto.str_nombre_producto : "";
  }

  // Filtrar las ordenes por estado
  filtrarPorEstado(ordenes, filtroEstado) {
    if (filtroEstado === "") {
      return ordenes;
    } else if (filtroEstado === "EnCurso") {
      return ordenes.filter((orden) => !orden.bool_estado_orden);
    } else if (filtroEstado === "Finalizado") {
      return ordenes.filter((orden) => orden.bool_estado_orden);
    }
  }

  //Obtener el producto elaborado
  getProductoElaborado(fk_producto_elaborado) {
    const { producto_elaborado } = this.state;

    const producto = producto_elaborado.find(
      (producto) => producto.id_producto_elaborado === fk_producto_elaborado
    );

    console.log(producto);

    if (producto) {
      const { recetas,detalles_recetas } = this.state;
      //Buscamos todos los detalles_recetas de ese receta y obtenemos los ingredientes que se usan
      const detalles_recetas_filtradas = detalles_recetas.filter(
        (detalle_receta) => detalle_receta.fk_receta === producto.fk_receta
      );

      console.log(detalles_recetas_filtradas);
      const ingredientes = detalles_recetas_filtradas.map(
        (detalle_receta) => detalle_receta.fk_ingrediente
      );

      console.log(ingredientes);
    }
  }

  render() {
    const {
      ordenes,
      cantidad,
      producto_elaborado,
      filtroEstado,
      productos_elaborados,
    } = this.state;

    // Filtrar las ordenes por estado
    const ordenesFiltradas = this.filtrarPorEstado(ordenes, filtroEstado);

    return (
      <div>
        <h1 className="title">Órdenes de producción</h1>
        <Row>
          <Col md={6}>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <FormGroup>
                <Label for="producto_elaborado">Producto elaborado:</Label>
                <Input
                  type="select"
                  name="producto_elaborado"
                  value={producto_elaborado}
                  onChange={this.handleInputChange.bind(this)}
                >
                  <option value="">Selecciona un producto</option>
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
              <FormGroup>
                <Label for="cantidad">Cantidad:</Label>
                <Input
                  type="number"
                  name="cantidad"
                  value={cantidad}
                  onChange={this.handleInputChange.bind(this)}
                />
              </FormGroup>
              <Button color="primary" type="submit">
                Agregar orden
              </Button>
            </form>
          </Col>
          <Col md={6}>
            <div className="text-right mt-3">
              <Label for="filtroEstado">Filtro por estado:</Label>
              <Input
                type="select"
                id="filtroEstado"
                value={filtroEstado}
                onChange={this.handleFiltroEstadoChange.bind(this)}
              >
                <option value="">Todos</option>
                <option value="EnCurso">En Curso</option>
                <option value="Finalizado">Finalizado</option>
              </Input>
            </div>
          </Col>
        </Row>
        <Table>
          <thead>
            <tr>
              <th>Producto elaborado</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map(
              ({
                id_orden,
                int_cantidad,
                fk_producto_elaborado,
                bool_estado_orden,
              }) => (
                <tr key={id_orden}>
                  <td>
                    {this.getNombreProductoElaborado(fk_producto_elaborado)}
                  </td>
                  <td>{int_cantidad}</td>
                  <td>{bool_estado_orden ? "Finalizado" : "En Proceso"}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() =>
                        this.handleUpdateOrden(id_orden, !bool_estado_orden)
                      }
                    >
                      {bool_estado_orden ? "Poner en curso" : "Finalizar Orden"}
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}
