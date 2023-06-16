import { Link } from "react-router-dom";
import logImage from "../img/logo.png";
import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BsInboxesFill,
  BsFillCartFill,
  BsFillFolderFill,
  BsClipboard2HeartFill,
  BsUiChecks,
  BsGraphUpArrow,
  BsPersonBoundingBox,
  BsBuildingFillGear,
} from "react-icons/bs";

export const Menu = () => {
  return (
    <div
      style={{ boxShadow: "3px 3px 6px rgba(0,0,0,1.5)" }}
      className={`d-flex flex-column justify-content-start`}
    >
      <div className={`text-center py-1 my-1`}></div>
      <div className="log-image">
        <img src={logImage} alt="logimage" />
      </div>

      <Link
        to="/ProductosElaborados"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsFillFolderFill /> Productos Elaborados
      </Link>

      <Link
        to="/Recetas"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsClipboard2HeartFill /> Recetas
      </Link>

      <Link
        to="/StockIngrediente"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsUiChecks /> Stock de Ingredientes
      </Link>

      <Link
        to="/StockProductos"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsUiChecks /> Stock de Productos
      </Link>

      <Link
        to="/Compras"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsFillCartFill />
        Compras
      </Link>

      <Link
        to="/Ventas"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsGraphUpArrow /> Ventas
      </Link>

      <Link
        to="/Clientes"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsPersonBoundingBox /> Clientes
      </Link>

      <Link
        to="/Proveedores"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsBuildingFillGear /> Proveedores
      </Link>

      <Link
        to="/Caja"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsInboxesFill />
        Caja
      </Link>

      <Link
        to="/OrdenesProduccion"
        className="btn btn-outline-danger"
        style={{ color: "black", border: "none", fontWeight: "bold" }}
      >
        <BsInboxesFill />
        OrdenesProduccion
      </Link>
    </div>
  );
};
