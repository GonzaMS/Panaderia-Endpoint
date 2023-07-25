import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/custom.css";
import axios from "axios";

export const FacturaVentas = () => {
  const [cliente, setCliente] = useState(""); // Nuevo estado para el campo cliente
  const [ruc, setRuc] = useState(""); // Nuevo estado para el campo RUC
  const [ci, setCI] = useState(""); // Nuevo estado para el campo CI
  const [idCliente, setIdCliente] = useState(""); // Nuevo estado para el campo ID del cliente
  const [productoSeleccionado, setProductoSeleccionado] = useState(""); // Nuevo estado para el campo producto seleccionado
  const [cantidad, setCantidad] = useState(""); // Nuevo estado para el campo cantidad
  const [precioUnitario, setPrecioUnitario] = useState(""); // Nuevo estado para el campo precio unitario
  const [impuesto, setImpuesto] = useState(""); // Nuevo estado para el campo impuesto
  const [items, setItems] = useState([]); // Nuevo estado para los items
  const [total, setTotal] = useState(0); // Nuevo estado para el total
  const [datosProductosElaborados, setDatosProductosElaborados] = useState([]); // Nuevo estado para los productos elaborados
  const [datosClientes, setDatosClientes] = useState([]); // Nuevo estado para los clientes
  const [fechaActual, setFechaActual] = useState(""); // Nuevo estado para la fecha actual
  const [datosProductosStock, setDatosProductosStock] = useState([]); // Nuevo estado para los productos en stock
  const [datosTiposMovimientos, setDatosTiposMovimientos] = useState([]); // Nuevo estado para los tipos de movimientos
  const [datosMovimientoStock, setDatosMovimientoStock] = useState([]); // Nuevo estado para los movimientos de stock
  const [datosStocks, setDatosStocks] = useState([]); // Nuevo estado para los stocks
  const [datosDetallesFacturas, setDatosDetallesFacturas] = useState([]); // Nuevo estado para los detalles de las facturas
  const [datosFacturas, setDatosFacturas] = useState([]); // Nuevo estado para las facturas

  useEffect(() => {
    obtenerProductosElaborados();
    obtenerClientes();
    obtenerProductosStock();
    obtenerTiposMovimientos();
    obtenerMovimientoStock();
    obtenerStocks();
    obtenerDetallesFacturas();
    obtenerFacturas();
  }, []);

  const obtenerProductosElaborados = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/productos_elaborados"
      );
      const productosElaborados = response.data;

      const datosProductosElaborados = productosElaborados.map(
        (productoElaborado) => ({
          id: productoElaborado.id_producto_elaborado,
          nombre: productoElaborado.str_nombre_producto,
          precioUnitario: productoElaborado.fl_precio_unitario,
        })
      );

      setDatosProductosElaborados(datosProductosElaborados);

      console.log(datosProductosElaborados);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerClientes = async () => {
    try {
      const response = await axios.get("https://localhost:7089/api/clientes");
      const clientes = response.data;

      const datosClientes = clientes.map((cliente) => ({
        id: cliente.id_cliente,
        nombre: cliente.str_nombre_cliente,
        ruc: cliente.str_ruc_cliente,
      }));

      setDatosClientes(datosClientes);

      console.log(datosClientes);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerProductosStock = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/productos_elaborados_stock"
      );
      const productosStock = response.data;

      const datosProductosStock = productosStock.map((productoStock) => ({
        id_producto_stock: productoStock.id_producto_stock,
        fk_producto_elaborado: productoStock.fk_producto_elaborado,
        fk_stock: productoStock.fk_stock,
        fl_cantidad: productoStock.fl_cantidad,
      }));

      setDatosProductosStock(datosProductosStock);

      console.log(datosProductosStock);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerTiposMovimientos = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/tipos_movimientos"
      );
      const tiposMovimientos = response.data;

      const datosTiposMovimientos = tiposMovimientos.map((tipoMovimiento) => ({
        id_tipo_movimiento: tipoMovimiento.id_tipo_movimiento,
        int_movimiento: tipoMovimiento.int_movimiento,
        str_tipo: tipoMovimiento.str_tipo,
      }));

      setDatosTiposMovimientos(datosTiposMovimientos);

      console.log(datosTiposMovimientos);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerMovimientoStock = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/movimiento_stock"
      );
      const movimientosStock = response.data;

      const datosMovimientosStock = movimientosStock.map((movimientoStock) => ({
        id_transferencia_stock: movimientoStock.id_transferencia_stock,
        fk_producto_elaborado: movimientoStock.fk_producto_elaborado,
        fk_Stock: movimientoStock.fk_stock,
        fk_tipo_movimiento: movimientoStock.fk_tipo_movimiento,
        fl_cantidad: movimientoStock.fl_cantidad,
        date_fecha_ingreso: movimientoStock.date_fecha_ingreso,
      }));

      setDatosMovimientoStock(datosMovimientosStock);

      console.log(datosMovimientosStock);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerStocks = async () => {
    try {
      const response = await axios.get("https://localhost:7089/api/stocks");
      const stocks = response.data;

      const datosStocks = stocks.map((stock) => ({
        id_stock: stock.id_stock,
        str_nombre_stock: stock.str_nombre_stock,
        str_direccion: stock.str_direccion,
      }));

      setDatosStocks(datosStocks);

      console.log(datosStocks);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerDetallesFacturas = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/detalles_facturas"
      );
      const detallesFacturas = response.data;

      const datosDetallesFacturas = detallesFacturas.map((detalleFactura) => ({
        id_detalle_factura: detalleFactura.id_detalle_factura,
        int_cantidad: detalleFactura.int_cantidad,
        fl_iva: 0.05,
        fk_factura: detalleFactura.fk_factura,
        fk_producto: detalleFactura.fk_producto,
      }));

      setDatosDetallesFacturas(datosDetallesFacturas);

      console.log(datosDetallesFacturas);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerFacturas = async () => {
    try {
      const response = await axios.get("https://localhost:7089/api/facturas");
      const facturas = response.data;

      const datosFacturas = facturas.map((factura) => ({
        id_factura: factura.id_factura,
        int_timbrado: factura.int_timbrado,
        str_ruc_cliente: factura.str_ruc_cliente,
        str_nombre_cliente: factura.str_nombre_cliente,
        date_fecha_emision: factura.date_fecha_emision,
        fl_total_pagar: factura.fl_total_pagar,
        fl_iva: factura.fl_iva,
        fk_cliente: factura.fk_cliente,
        bool_estado_factura: factura.bool_estado_factura,
      }));

      setDatosFacturas(datosFacturas);

      console.log(datosFacturas);
    } catch (error) {
      console.error(error);
    }
  };

  const buscarClientePorRUC = async (ruc) => {
    try {
      const response = await axios.get(
        `https://localhost:7089/api/clientes?str_ruc_cliente=${ruc}`
      );
      const clientes = response.data;

      const clienteEncontrado = clientes.find(
        (cliente) => cliente.str_ruc_cliente === ruc
      );

      if (clienteEncontrado) {
        setCliente(clienteEncontrado.str_nombre_cliente);
        setIdCliente(clienteEncontrado.id_cliente);
      } else {
        setCliente("");
        setIdCliente("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const buscarClientePorCI = async (ci) => {
    try {
      const response = await axios.get(
        `https://localhost:7089/api/clientes?str_ci_cliente=${ci}`
      );
      const clientes = response.data;

      const clienteEncontrado = clientes.find(
        (cliente) => cliente.str_ci_cliente === ci
      );

      if (clienteEncontrado) {
        setCliente(clienteEncontrado.str_nombre_cliente);
        setIdCliente(clienteEncontrado.id_cliente);
      } else {
        setCliente("");
        setIdCliente("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const obtenerFechaActual = () => {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = fechaActual.getMonth() + 1;
      const day = fechaActual.getDate();
      const fechaFormateada = `${year}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      return fechaFormateada;
    };

    const interval = setInterval(() => {
      const fechaActual = obtenerFechaActual();
      setFechaActual(fechaActual);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const guardarFactura = async () => {
    if (!idCliente) {
      console.log("No se encontró ningún cliente con el RUC/CI proporcionado");
      return;
    }

    // Crear la factura
    try {
      const factura = {
        int_timbrado: generarNumeroAzar(),
        str_ruc_cliente: ruc,
        str_nombre_cliente: cliente,
        date_fecha_emision: fechaActual,
        fl_total_pagar: total,
        fl_iva: 0.05,
        fk_cliente: idCliente,
        bool_estado_factura: false,
      };

      const facturaResponse = await axios.post(
        "https://localhost:7089/api/facturas",
        factura
      );
      const facturaGuardada = facturaResponse.data;

      // Crear los detalles de la factura
      const detallesFactura = items.map((item) => {
        const productoEncontrado = datosProductosElaborados.find(
          (producto) => producto.nombre === item.producto
        );

        if (productoEncontrado) {
          return {
            int_cantidad: item.cantidad,
            fl_iva: 0,
            fk_factura: facturaGuardada.id_factura,
            fk_producto: productoEncontrado.id,
          };
        } else {
          return null;
        }
      });

      // Filtrar los detalles de la factura que no se encontraron
      const detallesFacturaValidos = detallesFactura.filter(
        (detalle) => detalle !== null
      );

      // Guardar los detalles de la factura
      const guardarDetallesPromises = detallesFacturaValidos.map((detalle) =>
        axios.post("https://localhost:7089/api/detalles_facturas", detalle)
      );
      await Promise.all(guardarDetallesPromises);

      console.log("Factura guardada:", facturaGuardada);
    } catch (error) {
      console.error(error);
    }
  };

  const generarNumeroAzar = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };

  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth() + 1;
    const day = fechaActual.getDate();
    const fechaFormateada = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    return fechaFormateada;
  };

  const buscarPrecioProducto = (nombreProducto) => {
    const productoEncontrado = datosProductosElaborados.find(
      (producto) => producto.nombre === nombreProducto
    );
    if (productoEncontrado) {
      setPrecioUnitario(productoEncontrado.precioUnitario.toString());
    } else {
      setPrecioUnitario("");
    }
  };

  const handleAgregarItem = () => {
    const productoEncontrado = datosProductosElaborados.find(
      (producto) => producto.nombre === productoSeleccionado
    );

    console.log(productoEncontrado);

    const item = {
      producto: productoSeleccionado,
      cantidad: parseFloat(cantidad),
      precioUnitario: parseFloat(precioUnitario),
      impuesto: parseFloat(impuesto),
    };

    console.log(item.cantidad);

    console.log(productoEncontrado.id);

    const productoStockEncontrado = datosProductosStock.find(
      (producto) => producto.fk_producto_elaborado === productoEncontrado.id
    );

    console.log(productoStockEncontrado);

    if (
      !productoStockEncontrado ||
      productoStockEncontrado.fl_cantidad < item.cantidad
    ) {
      alert("No hay suficiente cantidad del producto en stock.");
      console.log("No hay suficiente cantidad del producto en stock.");
      return;
    }

    setItems([...items, item]);

    const itemTotal =
      parseFloat(item.precioUnitario) * parseFloat(item.cantidad);
    setTotal((prevTotal) => prevTotal + itemTotal);

    setProductoSeleccionado("");
    setCantidad("");
    setPrecioUnitario("");
    setImpuesto("");

    console.log(productoStockEncontrado.id_producto_stock);

    //Descontar del stock
    const productoStock = {
      id_producto_stock: productoStockEncontrado.id_producto_stock,
      fk_producto_elaborado: productoStockEncontrado.fk_producto_elaborado,
      fk_stock: productoStockEncontrado.fk_stock,
      fl_cantidad: productoStockEncontrado.fl_cantidad - item.cantidad,
    };

    const body = JSON.stringify(productoStock);

    try {
      axios
        .put(
          `https://localhost:7089/api/productos_elaborados_stock/${productoStockEncontrado.id_producto_stock}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.error(error);
    }

    console.log(productoStock);
  };

  return (
    <div>
      <div>
        <h1>Nueva Venta</h1>
        <div className="fecha-actual">{fechaActual}</div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>RUC/CI:</label>
              <input
                type="text"
                className="form-control custom-input"
                value={ruc}
                onChange={(e) => {
                  const value = e.target.value;
                  setRuc(value);

                  // Verificar si es un RUC válido (formato XXXXXXX-Y)
                  if (/^\d{7}-\d$/.test(value)) {
                    buscarClientePorRUC(value);
                  } else if (value.length === 7) {
                    buscarClientePorCI(value);
                  } else {
                    setCliente("");
                    setIdCliente("");
                  }
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label className="nameCliente">Cliente:</label>
              <input
                type="text"
                className="form-control client-input"
                value={cliente}
                readOnly
              />
            </div>
          </div>
        </div>

        <br></br>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="productoSelect"
                    style={{ textAlign: "right" }}
                  >
                    Producto:
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      id="productoSelect"
                      value={productoSeleccionado}
                      onChange={(e) => {
                        setProductoSeleccionado(e.target.value);
                        buscarPrecioProducto(e.target.value);
                      }}
                    >
                      <option value="">Seleccionar producto</option>
                      {datosProductosElaborados.map((productoElaborado) => (
                        <option
                          key={productoElaborado.id}
                          value={productoElaborado.nombre}
                        >
                          {productoElaborado.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="cantidadP-label">Cantidad:</label>
                  <input
                    type="text"
                    style={{ width: "300px" }}
                    className="form-control cantidadP"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-success facturaAgg"
          onClick={handleAgregarItem}
        >
          Agregar
        </button>
        <br></br>
        <table id="customers">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.producto}</td>
                <td>{item.cantidad}</td>
                <td>{item.precioUnitario}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br></br>
        <div>
          <label className="totalP-label">Total:</label>
          <input
            type="text"
            style={{ width: "150px" }}
            className="form-control totalP"
            value={total}
            readOnly
          />
        </div>
        <div className="col-sm-12 col-md-4">
          <Link to="/Caja" className="custom-link">
            <button
              type="button"
              className="btn btn-outline-success facturaAgg"
              onClick={guardarFactura}
            >
              Guardar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
