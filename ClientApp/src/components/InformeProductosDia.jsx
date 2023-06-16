import React, { Component } from "react";
import axios from "axios";
import "../css/custom.css";
import { Table, Container } from "reactstrap";

export class InformeProductosDia extends Component {
  state = {
    detalles_productos: [], // Estado para almacenar los productos elaborados
    productos_elaborados: [], // Estado para almacenar las recetas
    ordenes_produccion: [], // Estado para almacenar los detalles de las recetas
  };

  componentDidMount() {
    this.fetchData();
  }

  // Función para obtener los datos de la API
  fetchData() {
    try {
      // Se obtienen los productos elaborados
      axios
        .get("https://localhost:7089/api/productos_elaborados")
        .then((response) => {
          const productos_elaborados = response.data;
          this.setState({ productos_elaborados });
        })
        .catch((error) => {
          alert("Error al obtener los productos elaborados");
          console.error("Error al obtener los productos elaborados:", error);
        });

      // Se obtienen los detalles_productos
      axios
        .get("https://localhost:7089/api/detalles_productos")
        .then((response) => {
          const detalles_productos = response.data;
          this.setState({ detalles_productos });
        })
        .catch((error) => {
          alert("Error al obtener los detalles de los productos");
          console.error(
            "Error al obtener los detalles de los productos:",
            error
          );
        });

      // Se obtienen las ordenes de producción
      axios
        .get("https://localhost:7089/api/ordenes_produccion")
        .then((response) => {
          const ordenes_produccion = response.data;
          this.setState({ ordenes_produccion });
        })
        .catch((error) => {
          alert("Error al obtener las ordenes de produccion");
          console.error("Error al obtener las ordenes de produccion:", error);
        });
    } catch (error) {
      alert("Error al obtener los datos");
      console.error("Error al obtener los datos:", error);
    }
  }

  //Funcion para obtener la cantidad
  obtenerCantidad = (fk_producto_elaborado) => {
    const { ordenes_produccion } = this.state;

    //Se busca la orden de produccion
    const orden = ordenes_produccion.find(
      (orden) => orden.fk_producto_elaborado === fk_producto_elaborado
    );

    //Se retorna la cantidad
    if (orden) {
      return orden.fl_cantidad;
    }
  };

  //Funcion para obtener el nombre del producto
  obtenerProducto = (fk_producto_elaborado) => {
    const { productos_elaborados } = this.state;

    //Se busca el producto
    const producto = productos_elaborados.find(
      (producto) => producto.id_producto_elaborado === fk_producto_elaborado
    );

    //Se retorna el nombre del producto
    if (producto) {
      return producto.str_nombre_producto;
    }
  };

  //Funcion para filtrar por nombre de producto
  filtrarPorFecha = (fecha) => {
    if(fecha === ""){
        this.fetchData();
    }
    this.setState({ fechaFiltro: fecha });

    console.log(fecha);
  
    // Realizar la llamada a la API con el filtro de fecha
    axios
      .get(`https://localhost:7089/api/detalles_productos/fecha/${fecha}`)
      .then((response) => {
        this.setState({ detalles_productos: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { detalles_productos } = this.state;

    return (
      <>
        <Container>
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-3">
              <p>Productos Elaborados por Dia</p>
            </div>
            <div className="col-sm-12 col-md-5">
              <div className="input-group">
                <input
                  type="date"
                  className="form-control rounded"
                  placeholder="Filtrar por fecha"
                  onChange={(e) => this.filtrarPorFecha(e.target.value)}
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
          </div>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Producto</th>
                <th>Fecha elaboracion</th>
                <th>Fecha vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {detalles_productos.map((producto) => (
                <tr key={producto.id_detalle_producto}>
                  <td>
                    {this.obtenerCantidad(producto.fk_producto_elaborado)}
                  </td>
                  <td>
                    {this.obtenerProducto(producto.fk_producto_elaborado)}
                  </td>
                  <td>{producto.date_elaboracion}</td>
                  <td>{producto.date_vencimiento}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </>
    );
  }
}
