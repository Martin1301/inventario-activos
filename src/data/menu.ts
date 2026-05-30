import {
  LayoutDashboard,
  Package,
  Truck,
  ClipboardList,
  MapPin,
  ClipboardCheck,
  Clock3,
  Warehouse 
} from "lucide-react";

export const menu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Activos",
    path: "/activos",
    icon: Package,
  },
{
        title: "Stock Local",
        path: "/activos/stock",
        icon: Warehouse,
      },
  {
    title: "Guías",
    icon: ClipboardList,
    path: "/guias",
    children: [
      {
        title: "Todas las guías",
        path: "/guias",
        icon: ClipboardList,
      },
      {
        title: "Guías por cerrar",
        path: "/guias/por-cerrar",
        icon: Clock3,
      },
      {
        title: "Validar guías",
        path: "/guias/validar",
        icon: ClipboardCheck,
      },
    ],
  },

  {
    title: "En tránsito",
    path: "/transito",
    icon: Truck,
  },
  {
    title: "Locales",
    path: "/locales",
    icon: MapPin,
  },
];