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
  const {datosIngredientesStock, setDatosIngredientesStock} = useState([]);
  const {datosIngredientes_stock,setDatosIngredientes_stock} = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [ultimaCompra, setUltimaCompra] = useState("");

  useEffect(() => {
    obtenerIngredientes();
    obtenerProveedores();
    obtenerCompra();
    //obtenerIngredientesStock();
  }, []);

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

  /*
  const obtenerIngredientesStock = async () => {
    try {
      const response = await axios.get("https://localhost:7089/api/ingredientes_stock");
      const ingredientes_stock = response.data;

      const datosIngredientes_stock = ingredientes_stock.map((ingredientes) => ({
        id_ingrediente_stock: ingredientes_stock.id_ingrediente_stock,
        fk_producto_elaborado: ingredientes_stock.fk_producto_elaborado,
        fk_stock: ingredientes_stock.fk_stock,
        fl_cantidad: ingredientes_stock.fl_cantidad,
      }));

      setDatosIngredientes_stock(datosIngredientes_stock);

      console.log(datosCompras);
    } catch (error) {
      console.error(error);
    }
  };*/

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
    const nuevoItem = {
      proveedor: proveedorSeleccionado,
      ingrediente: ingredienteSeleccionado,
      cantidad: parseFloat(cantidad),
      precioUnitario: parseFloat(precioUnitario),
    };

    //Comprobamos el nombre del nuevoItem con los items existentes
    const nombreItem = nuevoItem.ingrediente;
    console.log(nombreItem);

    console.log(datosIngredientes);

    //Buscamos si existe el item comparando el nombre con el nombre en datosIngredientes
    const itemExistente = datosIngredientes.find(
      (ingrediente) => ingrediente.nombre === nombreItem
    );

    console.log(itemExistente.id);

    //Obtenemos todas las compras
    const compras = datosCompras;

    //Buscamos la ultima compra en la lista de compras
    const ultimaCompra = compras[compras.length - 1];

    if (itemExistente) {
      //Hacemos un detalle de compra con el item existente
      const detalleCompra = {
        fk_compra: ultimaCompra.id_compra,
        fk_ingrediente: itemExistente.id,
        fk_stock: 1,
        int_cantidad: parseInt(cantidad),
        fl_precio_unidad: parseFloat(precioUnitario),
        fl_iva: 0.05,
      };

      console.log(detalleCompra);

      axios
        .post("https://localhost:7089/api/detalles_de_compras", detalleCompra)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setItems([...items, nuevoItem]);
    const Total = parseFloat(precioUnitario) * parseFloat(cantidad);
    setTotal((prevTotal) => prevTotal + Total);
    // Restablecer los valores de entrada a su estado inicial
    setIngredienteSeleccionado("");
    setCantidad("");
    setPrecioUnitario("");
    setImpuesto("");
  };

  const handleGuardarCompra = () => {
    //Obtenemos todas las compras
    const compras = datosCompras;

    console.log(compras);


    const nuevoItem = {
      proveedor: proveedorSeleccionado,
      fl_precio_total: total,
    };

    console.log(nuevoItem);

    //Comprobamos el nombre del proveedor de nuevoItem con los proveedores
    const nombreProveedor = nuevoItem.proveedor;
    console.log(nombreProveedor);

    //Buscamos si existe el proveedor comparando el nombre con el nombre en datosProveedores
    const proveedorExistente = datosProveedores.find(
      (proveedor) => proveedor.nombre === nombreProveedor
    );

    console.log(proveedorExistente.id);

    //Obtenemos el precio total
    const precioTotal = nuevoItem.fl_precio_total;

    console.log(precioTotal);

    //Generamos el numero de factura aleatorio
    const numeroFactura = nroFacturaAleatorio().toString();

    //Hacemos un put sobre la ultima compra para actualizar el proveedor y el precio total
    const ultimaCompra = datosCompras[datosCompras.length - 1];

    const compraActualizada = JSON.stringify({
      id_compra: ultimaCompra.id_compra,
      fk_proveedor: proveedorExistente.id,
      fl_precio_total: precioTotal,
      date_compra: fechaActual,
      str_numero_factura: numeroFactura,
    });

    console.log(compraActualizada);

    axios.put(
      `https://localhost:7089/api/compras/${ultimaCompra.id_compra}`,
      compraActualizada,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //Agregamos los ingredientes seleccionados al ingredientes_stock
    const ingredientesSeleccionados = items;

    console.log(ingredientesSeleccionados);

    //Obtenemos todos los ingredientes_stock
    const ingredientes_stock = datosIngredientes_stock;

    console.log(ingredientes_stock);

    //Buscamos lo detalles_de_compras de la ultima compra y guardamos la cantidad y el id del ingrediente

    



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
          <Link to="/Compras" className="custom-link">
            <button
              type="button"
              className="btn btn-outline-success facturaAgg"
              onClick={handleGuardarCompra}
            >
              Guardar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
