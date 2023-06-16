import React, { Component } from "react";
import axios from "axios";
import "../css/custom.css";
import { Link } from "react-router-dom";

import { Table, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";

export class OrdenesProduccion extends Component {
  state = {
    ordenes: [], // Lista de ordenes de produccion
    productos_elaborados: [], // Lista de productos elaborados
    ingredientes_stock: [], // Lista de ingredientes en stock
    ingredientes: [], // Lista de ingredientes
    recetas: [], // Lista de recetas
    detalles_recetas: [], // Lista de detalles de recetas
    productos_elaborados_stock: [], // Lista de productos elaborados en stock
    detalles_productos: [], // Lista de detalles de productos
    movimiento_stock: [], // Lista de movimientos de stock
    tipos_movimientos: [], // Lista de tipos de movimientos
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
      //Obtenemos todas las ordenes de produccion
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

      //Obtenemos todos los productos elaborados
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

      //Obtenemos todos los ingredientes en stock
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

      //Obtenemos todos los ingredientes
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

      //Obtenemos todas las recetas
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

      //Obtenemos todos los detalles de recetas
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

      //Obtenemos todos los productos elaborados en stock
      axios
        .get("https://localhost:7089/api/productos_elaborados_stock")
        .then((response) => {
          const data = response.data;
          this.setState({ productos_elaborados_stock: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      //Obtenemos todos los detalles de productos
      axios
        .get("https://localhost:7089/api/detalles_productos")
        .then((response) => {
          const data = response.data;
          this.setState({ detalles_productos: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      //Obtenemos todos los movimientos de stock
      axios
        .get("https://localhost:7089/api/movimiento_stock")
        .then((response) => {
          const data = response.data;
          this.setState({ movimiento_stock: data });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });

      //Obtenemos todos los tipos de movimientos
      axios
        .get("https://localhost:7089/api/tipos_movimientos")
        .then((response) => {
          const data = response.data;
          this.setState({ tipos_movimientos: data });
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
    const { ordenes, productos_elaborados_stock, productos_elaborados } =
      this.state;

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

      if (newState) {
        //Creamos un movimiento_stock por cada producto elaborado que se haya producido con el tipo de movimiento 1 (entrada)

        //Obtenemos la orden de produccion que se acaba de actualizar
        const orden = ordenes.find((orden) => orden.id_orden === id);

        //Obtenemos el producto elaborado que se acaba de producir
        const producto = productos_elaborados.find(
          (producto) =>
            producto.id_producto_elaborado === orden.fk_producto_elaborado
        );

        const movimiento = JSON.stringify({
          fk_producto_elaborado: producto.id_producto_elaborado,
          fk_stock: 2,
          fk_tipo_movimiento: 1,
          fl_cantidad: orden.fl_cantidad,
          date_fecha_ingreso: new Date(),
        });

        await axios.post(
          "https://localhost:7089/api/movimiento_stock",
          movimiento,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        //Insertamos un detalle_producto por cada producto elaborado que exista en ordenes de produccion
        const detalle_producto = JSON.stringify({
          fk_producto_elaborado: producto.id_producto_elaborado,
          date_elaboracion: new Date(),
          //La fecha de vencimiento es la fecha de elaboracion + 2 dias
          date_vencimiento: new Date(
            new Date().setDate(new Date().getDate() + 2)
          ),
          fl_iva: 0.05,
        });

        await axios.post(
          "https://localhost:7089/api/detalles_productos",
          detalle_producto,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        //Buscamos si el producto elaborado ya existe en el stock
        const producto_stock = productos_elaborados_stock.find(
          (producto) =>
            producto.fk_producto_elaborado === orden.fk_producto_elaborado
        );

        //Si el producto elaborado ya existe en el stock, aumentamos su cantidad
        if (producto_stock) {
          const producto_stock_body_exist = JSON.stringify({
            id_producto_stock: producto_stock.id_producto_stock,
            fk_producto_elaborado: producto_stock.fk_producto_elaborado,
            fk_stock: 2,
            fl_cantidad: producto_stock.fl_cantidad + orden.fl_cantidad,
          });

          await axios.put(
            `https://localhost:7089/api/productos_elaborados_stock/${producto_stock.id_producto_stock}`,
            producto_stock_body_exist,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          //Si el producto elaborado no existe en el stock, lo creamos
          const producto_stock_body_noexist = JSON.stringify({
            fk_producto_elaborado: orden.fk_producto_elaborado,
            fk_stock: 2,
            fl_cantidad: orden.fl_cantidad,
          });

          await axios.post(
            "https://localhost:7089/api/productos_elaborados_stock",
            producto_stock_body_noexist,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
      this.fetchData();
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  // Agregar una nueva orden
  async handleSubmit(event) {
    event.preventDefault();
    const {
      cantidad,
      producto_elaborado,
      recetas,
      detalles_recetas,
      productos_elaborados,
      ingredientes,
      ingredientes_stock,
    } = this.state;
    if (!producto_elaborado) {
      alert("Debe seleccionar un producto elaborado");
      return;
    } else if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    //Obtener el producto elaborado a partir del fk_producto_elaborado de la orden
    const producto = productos_elaborados.find(
      (producto) =>
        producto.id_producto_elaborado === Number(producto_elaborado)
    );

    //Obtener la receta del producto elaborado
    const receta = recetas.find(
      (receta) => receta.id_receta === producto.fk_recetas
    );

    //Obtener todos los detalles de recetas de la receta del producto elaborado
    const detallesRecetasFiltrados = detalles_recetas.filter(
      (detalle) => detalle.fk_receta === receta.id_receta
    );

    //Multiplicar la cantidad de cada ingrediente por la cantidad que se indica en la orden
    const ingredientesNecesarios = detallesRecetasFiltrados.map((detalle) => {
      const ingrediente = ingredientes.find(
        (ingrediente) => ingrediente.id_ingrediente === detalle.fk_ingrediente
      );

      return {
        id_ingrediente: ingrediente.id_ingrediente,
        cantidad_necesaria: detalle.fl_cantidad * cantidad,
      };
    });

    //Verificar si hay stock suficiente de cada ingrediente en ingredientes_stock
    const ingredientesInsuficientes = ingredientesNecesarios.filter(
      (ingrediente) => {
        const ingredienteStock = ingredientes_stock.find(
          (stock) => stock.fk_ingredientes === ingrediente.id_ingrediente
        );

        //Si no hay stock del ingrediente, retornar true
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

    //Si hay stock suficiente, restar la cantidad de cada ingrediente en ingredientes_stock
    ingredientesNecesarios.forEach((ingrediente) => {
      const ingredienteStock = ingredientes_stock.find(
        (stock) => stock.fk_ingredientes === ingrediente.id_ingrediente
      );
      ingredienteStock.fl_cantidad -= ingrediente.cantidad_necesaria;

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
      const response = await axios.post(
        "https://localhost:7089/api/ordenes_produccion",
        {
          fl_cantidad: cantidad,
          fk_producto_elaborado: producto_elaborado,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.setState({
        cantidad: 0,
        producto_elaborado: "",
        recetas: [],
        detalles_recetas: [],
        ingredientes_stock: [],
      });
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

    if (producto) {
      const { detalles_recetas } = this.state;
      //Buscamos todos los detalles_recetas de ese receta y obtenemos los ingredientes que se usan
      const detalles_recetas_filtradas = detalles_recetas.filter(
        (detalle_receta) => detalle_receta.fk_receta === producto.fk_receta
      );

      const ingredientes = detalles_recetas_filtradas.map(
        (detalle_receta) => detalle_receta.fk_ingrediente
      );
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
      <div className="col-sm-12 col-md-12">
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
                fl_cantidad,
                fk_producto_elaborado,
                bool_estado_orden,
              }) => (
                <tr key={id_orden}>
                  <td>
                    {this.getNombreProductoElaborado(fk_producto_elaborado)}
                  </td>
                  <td>{fl_cantidad}</td>
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
        <Link to="/InformeProductosDia" className="custom-link">
          <button type="button" className="custom-button">
            {" "}
            Productos por dia Informe
          </button>
        </Link>
      </div>
    );
  }
}
