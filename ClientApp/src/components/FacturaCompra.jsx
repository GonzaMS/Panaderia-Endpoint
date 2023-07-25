import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/custom.css";
import axios from "axios";

export const FacturaCompra = () => {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [impuesto, setImpuesto] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [datosIngredientes, setDatosIngredientes] = useState([]);
  const [datosProveedores, setDatosProveedores] = useState([]);
  const [datosCompras, setDatosCompras] = useState([]);
  const [datosStocks, setDatosStocks] = useState([]);
  const [datosIngredientesStock, setDatosIngredientesStock] = useState([]);
  const [fechaActual, setFechaActual] = useState("");
  const [ultimaCompra, setUltimaCompra] = useState("");

  useEffect(() => {
    obtenerIngredientes();
    obtenerProveedores();
    obtenerCompra();
    obtenerStocks();
    obtenerIngredientesStock();
  }, []);
  //obtenemos el ingregientes stock
  const obtenerIngredientesStock = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/ingredientes_stock"
      );
      const IngredientesStock = response.data;

      const datosIngredientesStock = IngredientesStock.map((Ingredientestock) => ({
        id_ingrediente_stock: Ingredientestock.id_ingrediente_stock,
        fk_ingredientes: Ingredientestock.fk_ingredientes,
        fk_stock: Ingredientestock.fk_stock,
        fl_cantidad: Ingredientestock.fl_cantidad,
      }));

      setDatosIngredientesStock(datosIngredientesStock);

      console.log(datosIngredientesStock);
    } catch (error) {
      console.error(error);
    }
  };

  //Obtenemos los Stock de la base de datos
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


  //Obtenemos los ingredientes de la base de datos
  const obtenerIngredientes = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/ingredientes"
      );
      const ingredientes = response.data;

      const datosIngredientes = ingredientes.map((ingrediente) => ({
        id: ingrediente.id_ingrediente,
        nombre: ingrediente.str_nombre_ingrediente,
        precioUnitario: ingrediente.fl_precio_unitario,
      }));

      setDatosIngredientes(datosIngredientes);
    } catch (error) {
      console.error(error);
    }
  };


  //Obtenemos proveedores de la base de datos
  const obtenerProveedores = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/proveedores"
      );
      const proveedores = response.data;

      const datosProveedores = proveedores.map((proveedor) => ({
        id: proveedor.id_proveedor,
        nombre: proveedor.str_nombre_proveedor,
      }));

      setDatosProveedores(datosProveedores);

      console.log(datosProveedores);
    } catch (error) {
      console.error(error);
    }
  };
  //Obtenemos compras de la base de datos
  const obtenerCompra = async () => {
    try {
      const response = await axios.get("https://localhost:7089/api/compras");
      const compras = response.data;

      const datosCompras = compras.map((compras) => ({
        id_compra: compras.id_compra,
        fk_proveedor: compras.fk_proveedor,
        fl_precio_total: compras.fl_precio_total,
        date_compra: compras.date_compra,
        str_numero_factura: compras.str_numero_factura,
      }));

      setDatosCompras(datosCompras);

      console.log(datosCompras);
    } catch (error) {
      console.error(error);
    }
  };

  const nroFacturaAleatorio = () => {
    const nroFactura = Math.floor(Math.random() * 1000000000);
    return nroFactura;
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


  
  const handleAgregarItem = () => {
    const ingredienteEncontrado = datosIngredientes.find(
      (ingrediente) => ingrediente.nombre === ingredienteSeleccionado
    );

    console.log(ingredienteEncontrado);

    const item = {
      ingrediente: ingredienteSeleccionado,
      cantidad: parseFloat(cantidad),
      precioUnitario: parseFloat(precioUnitario),
      impuesto: parseFloat(impuesto),
    };

    console.log(item.cantidad);

    console.log(ingredienteEncontrado.id);
    console.log(datosIngredientesStock);

    const ingredienteStockEncontrado = datosIngredientesStock.find(
      (ingrediente) => ingrediente.fk_ingredientes === ingredienteEncontrado.id
    );

    console.log(ingredienteStockEncontrado);

    setItems([...items, item]);

    const itemTotal =
      parseFloat(item.precioUnitario) * parseFloat(item.cantidad);
    setTotal((prevTotal) => prevTotal + itemTotal);

    setIngredienteSeleccionado("");
    setCantidad("");
    setPrecioUnitario("");
    setImpuesto("");

    console.log(ingredienteStockEncontrado.id_ingrediente_stock);

    //Descontar del stock
    const ingredienteStock = {
      id_ingrediente_stock: ingredienteStockEncontrado.id_ingrediente_stock,
      fk_ingredientes: ingredienteStockEncontrado.fk_ingredientes,
      fk_stock: ingredienteStockEncontrado.fk_stock,
      fl_cantidad: ingredienteStockEncontrado.fl_cantidad + item.cantidad,
    };

    const body = JSON.stringify(ingredienteStock);

    try {
      axios
        .put(
          `https://localhost:7089/api/ingredientes_stock/${ingredienteStockEncontrado.id_ingrediente_stock}`,
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

    console.log(ingredienteStock);
  };

  const guardarCompra = async () => {

    const proveerdorEncontrado = datosProveedores.find(
      (proveedor) => proveedor.nombre === proveedorSeleccionado
    );
    // Crear la compra
    try {
      const compra = {
        fk_proveedor: proveerdorEncontrado.id,
        fl_precio_total: total,
        date_compra: fechaActual,
        str_numero_factura: nroFacturaAleatorio().toString()
      };
      console.log(compra);
      const body = JSON.stringify(compra);
      console.log(body);

      const facturaResponse = await axios.post(
        "https://localhost:7089/api/compras",
        body, {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const compraGuardada = facturaResponse.data;

      // Crear los detalles de la factura
      const detallesCompra = items.map((item) => {
        const ingredienteEncontrado = datosIngredientes.find(
          (ingrediente) => ingrediente.nombre === item.ingrediente
        );
        console.log(ingredienteEncontrado);

        if (ingredienteEncontrado) {
          return {
            int_cantidad: item.cantidad,
            fk_compra: compraGuardada.id_compra,
            fk_ingrediente: ingredienteEncontrado.id,
            fk_stock: 1,
            fl_precio_unidad: item.precioUnitario,
            fl_iva: 0.05
          };
        } else {
          return null;
        }
      });

      console.log(detallesCompra);

      // Filtrar los detalles de la factura que no se encontraron
      const detallesCompraValidos = detallesCompra.filter(
        (detalle) => detalle !== null
      );

      console.log(detallesCompraValidos);

      // Guardar los detalles de la factura
      detallesCompraValidos.forEach(async (detalle) => {
        const body = JSON.stringify(detalle);
        console.log(body);

        const detalleResponse = await axios.post(
          "https://localhost:7089/api/detalles_de_compras",
          body, {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const detalleGuardado = detalleResponse.data;

        console.log(detalleGuardado);
      });
      console.log("Compra guardada:", compraGuardada);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <h1>Nueva Compra</h1>
        <div className="fecha-actual">{fechaActual}</div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <label
                    className="col-sm-3 proveedor-label"
                    htmlFor="proveedorSelect"
                  >
                    Proveedor:
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control proveedor-input"
                      id="proveedorSelect"
                      value={proveedorSeleccionado}
                      onChange={(e) => {
                        setProveedorSeleccionado(e.target.value);
                      }}
                    >
                      <option value="">Seleccionar proveedor</option>
                      {datosProveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.nombre}>
                          {proveedor.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
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
                    htmlFor="ingredienteSelect"
                    style={{ textAlign: "right" }}
                  >
                    Ingrediente:
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      id="ingredienteSelect"
                      value={ingredienteSeleccionado}
                      onChange={(e) => {
                        setIngredienteSeleccionado(e.target.value);
                      }}
                    >
                      <option value="">Seleccionar ingrediente</option>
                      {datosIngredientes.map((ingrediente) => (
                        <option key={ingrediente.id} value={ingrediente.nombre}>
                          {ingrediente.nombre}
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
            <div className="form-group">
              <label className="precioP-label">Precio Unitario:</label>
              <input
                type="text"
                style={{ width: "300px" }}
                className="form-control cantidadP"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(e.target.value)}
              />
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
              <th>Ingrediente</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.ingrediente}</td>
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
          <Link to="/Compras" className="custom-link" /*onClick={() => window.location.replace("/Compras")}*/>
            <button
              type="button"
              className="btn btn-outline-success facturaAgg"
              onClick={guardarCompra}
            >
              Guardar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
