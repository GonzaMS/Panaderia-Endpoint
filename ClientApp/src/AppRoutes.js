import { Proveedores } from "./components/Proveedores";
import { ProductosElaborados } from "./components/ProductosElaborados";
import { Cajeros } from "./components/Cajeros";
import { Recetas } from "./components/Recetas";
import { Clientes } from "./components/Clientes";
import { Caja } from "./components/Caja";

import { Compras } from "./components/Compras";
import { FacturaCompra } from "./components/FacturaCompra";

import { Ventas } from "./components/Ventas";
import { FacturaVentas } from "./components/FacturaVentas";

import { StockIngrediente } from "./components/StockIngrediente";
import { StockProductos } from "./components/StockProductos";

//Informes
import { InformeProductosDia } from "./components/InformeProductosDia";
import { InformeProductosVencer } from "./components/InformeProductosVencer";

//Ordenes
import { OrdenesProduccion } from "./components/OrdenesProduccion";
import { Ordenes } from "./components/Ordenes";

//import { Home } from "./components/Home";
import { Login } from "./components/Login";

const AppRoutes = [
  {
    index: true,
    element: <Login />,
  },
  {
    path: "/Proveedores",
    element: <Proveedores />,
  },
  {
    path: "/Cajeros",
    element: <Cajeros />,
  },
  {
    path: "/Clientes",
    element: <Clientes />,
  },
  {
    path: "/Recetas",
    element: <Recetas />,
  },
  {
    path: "/ProductosElaborados",
    element: <ProductosElaborados />,
  },
  {
    path: "/OrdenesProduccion",
    element: <OrdenesProduccion />,
  },
  {
    path: "/Ordenes",
    element: <Ordenes />,
  },
  {
    path: "/Compras",
    element: <Compras />,
  },
  {
    path: "/FacturaCompra",
    element: <FacturaCompra />,
  },
  {
    path: "/Ventas",
    element: <Ventas />,
  },
  {
    path: "/FacturaVentas",
    element: <FacturaVentas />,
  },
  {
    path: "/StockIngrediente",
    element: <StockIngrediente />,
  },
  {
    path: "/StockProductos",
    element: <StockProductos />,
  },
  {
    path: "/InformeProductosDia",
    element: <InformeProductosDia />,
  },
  {
    path: "/InformeProductosVencer",
    element: <InformeProductosVencer />,
  },
  {
    path: "/Caja",
    element: <Caja />,
  },
  {
    path: "/Cajeros",
    element: <Cajeros />,
  },
];

export default AppRoutes;
