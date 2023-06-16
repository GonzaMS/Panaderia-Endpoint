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
  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    obtenerIngredientes();
    obtenerProveedores();
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

      console.log(datosIngredientes);
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
    try {
      const factura = {
        
      };

      const facturasResponse = await axios.post(
        
      );
      const facturaGuardada = facturasResponse.data;

      console.log("Factura guardada:", facturaGuardada);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAgregarItem = () => {
    const nuevoItem = {
      proveedor: proveedorSeleccionado,
      ingrediente: ingredienteSeleccionado,
      cantidad: parseFloat(cantidad),
      precioUnitario: parseFloat(precioUnitario),
      impuesto: parseFloat(impuesto),
    };

    setItems([...items, nuevoItem]);
    const Total = parseFloat(precioUnitario) * parseFloat(cantidad);
    setTotal(prevTotal => prevTotal + Total);
    // Restablecer los valores de entrada a su estado inicial
    setProveedorSeleccionado("");
    setIngredienteSeleccionado("");
    setCantidad("");
    setPrecioUnitario("");
    setImpuesto("");
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
                        <option
                          key={ingrediente.id}
                          value={ingrediente.nombre}
                        >
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
          <Link to="" className="custom-link">
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