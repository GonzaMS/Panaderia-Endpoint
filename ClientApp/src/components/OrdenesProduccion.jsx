import React, { Component } from "react";
import axios from "axios";
import "../css/custom.css";
import { Link } from "react-router-dom";

import { Table, Label, Input, Button, Row, Col } from "reactstrap";

export class OrdenesProduccion extends Component {
  state = {
    ordenes: [], // Lista de ordenes de produccion
    productos_elaborados: [], // Lista de productos elaborados
    productos_elaborados_stock: [], // Lista de productos elaborados en stock
    detalles_productos: [], // Lista de detalles de productos
    movimiento_stock: [], // Lista de movimientos de stock
    tipos_movimientos: [], // Lista de tipos de movimientos
    filtroEstado: "", // Estado del filtro
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
        });
    } catch (error) {
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

      if(data.bool_estado_orden && newState === false){
        return;
      }

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

  render() {
    const { ordenes, filtroEstado } = this.state;

    // Filtrar las ordenes por estado
    const ordenesFiltradas = this.filtrarPorEstado(ordenes, filtroEstado);

    return (
      <div className="col-sm-12 col-md-12">
        <h1>Órdenes de producción</h1>
        <Row className="justify-content-center mt-5">
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
          <Col md={6}>
            <div className="text-right mt-3">
              <Link to={"/Ordenes"}>
                <Button color="primary">Agregar Orden/es</Button>
              </Link>
            </div>
          </Col>
        </Row>

        <Table>
          <thead>
            <tr>
              <th>Producto elaborado</th>
              <th>Cantidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map((orden) => (
              <tr key={orden.id_orden}>
                <td>
                  {this.getNombreProductoElaborado(orden.fk_producto_elaborado)}
                </td>
                <td>{orden.fl_cantidad}</td>
                <td>
                  {orden.bool_estado_orden ? (
                    <Button color="success" disabled>
                      Finalizado
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() =>
                        this.handleUpdateOrden(orden.id_orden, true)
                      }
                    >
                      En Curso
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}
