"use client";

import {
  ClipboardList,
  Users,
  Building2,
  Package
} from "lucide-react";import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadData = async () => {

      try {

        const res =
          await fetch(
            "/api/dashboard"
          );

        const json =
          await res.json();

        setData(json);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    loadData();

  }, []);

  if (loading) {

    return (
      <div className="p-6">
        Cargando dashboard...
      </div>
    );
  }

  const estadoColor = (
    estado: string
  ) => {

    switch (estado) {

      case "BORRADOR":
        return "bg-amber-100 text-amber-700";

      case "TRANSITO":
        return "bg-blue-100 text-blue-700";

      case "RECIBIDA":
        return "bg-emerald-100 text-emerald-700";

      case "PARCIAL":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1
          className="
            text-4xl
            font-bold
            text-slate-900
          "
        >
          Dashboard
        </h1>

        <p
          className="
            text-slate-500
            mt-2
          "
        >
          Resumen general del sistema
        </p>

      </div>

      {/* KPIs */}
        <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        {/* LOCALES */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            p-5
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
            "
          >

            <div>

              <p
                className="
                  text-slate-500
                  text-sm
                "
              >
                Locales
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  text-slate-900
                  mt-2
                "
              >
                {data.totalLocales}
              </h2>

            </div>

            <div
              className="
                bg-blue-100
                p-3
                rounded-xl
              "
            >
              <Building2
                className="
                  w-6
                  h-6
                  text-blue-600
                "
              />
            </div>

          </div>

        </div>

        {/* GUIAS */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            p-5
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
            "
          >

            <div>

              <p
                className="
                  text-slate-500
                  text-sm
                "
              >
                Guías
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  text-slate-900
                  mt-2
                "
              >
                {data.totalGuias}
              </h2>

            </div>

            <div
              className="
                bg-emerald-100
                p-3
                rounded-xl
              "
            >
              <ClipboardList
                className="
                  w-6
                  h-6
                  text-emerald-600
                "
              />
            </div>

          </div>

        </div>

        {/* USUARIOS CENTRAL */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            p-5
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
            "
          >

            <div>

              <p
                className="
                  text-slate-500
                  text-sm
                "
              >
                Usuarios Central
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  text-slate-900
                  mt-2
                "
              >
                {data.totalUsuariosCentral}
              </h2>

            </div>

            <div
              className="
                bg-violet-100
                p-3
                rounded-xl
              "
            >
              <Users
                className="
                  w-6
                  h-6
                  text-violet-600
                "
              />
            </div>

          </div>

        </div>

        {/* ACTIVOS */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            p-5
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
            "
          >

            <div>

              <p
                className="
                  text-slate-500
                  text-sm
                "
              >
                Activos
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  text-slate-900
                  mt-2
                "
              >
                {data.totalActivos}
              </h2>
              
</div>

<div
              className="
                bg-amber-100
                p-3
                rounded-xl
              "
            >
              <Package
                className="
                  w-6
                  h-6
                  text-amber-600
                "
              />
            </div>

</div>
</div>
            </div>

      {/* TABLAS */}
      <div
        className="
          grid
          xl:grid-cols-2
          gap-6
        "
      >

        {/* ESTADOS */}
        <div
          className="
            bg-white
            rounded-2xl
            border
            shadow-sm
          "
        >

          <div
            className="
              p-5
              border-b
              font-bold
              text-lg
            "
          >
            Estado de Guías
          </div>

          <div className="p-5 space-y-4">

            {data.estadosGuias.map(
              (item: any) => {

                const icono =
                  item.estado ===
                  "BORRADOR"
                    ? "🟡"
                    : item.estado ===
                      "TRANSITO"
                    ? "🔵"
                    : item.estado ===
                      "RECIBIDA"
                    ? "🟢"
                    : "🔴";

                return (

                  <div
                    key={item.estado}
                    className="
                      flex
                      justify-between
                      items-center
                    "
                  >
                    <span>
                      {icono} {item.estado}
                    </span>

                    <span
                      className="
                        font-bold
                      "
                    >
                      {
                        item._count
                          .estado
                      }
                    </span>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* GUIAS POR USUARIO */}
        <div
          className="
            bg-white
            rounded-2xl
            border
            shadow-sm
          "
        >

          <div
            className="
              p-5
              border-b
              font-bold
              text-lg
            "
          >
            Guías por Usuario
          </div>

          <div className="p-5 space-y-4">

            {data.guiasPorCentral.map(
              (usuario: any) => (

                <div
                  key={usuario.id}
                  className="
                    flex
                    justify-between
                    items-center
                  "
                >
                  <span>
                    {usuario.nombre}
                  </span>

                  <span
                    className="
                      font-bold
                    "
                  >
                    {
                      usuario._count
                        .guidesEnviadas
                    }
                  </span>

                </div>
              )
            )}

          </div>

        </div>

      </div>

      {/* ULTIMAS GUIAS */}
      <div
        className="
          bg-white
          rounded-2xl
          border
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            p-5
            border-b
            font-bold
            text-lg
          "
        >
          Últimas Guías Registradas
        </div>

        <table className="w-full">

          <thead
            className="
              bg-slate-50
              text-sm
            "
          >
            <tr>

              <th className="p-4 text-left">
                Número
              </th>

              <th className="p-4 text-left">
                Ruta
              </th>

              <th className="p-4 text-center">
                Estado
              </th>

            </tr>
          </thead>

          <tbody>

            {data.ultimasGuias.map(
              (guia: any) => (

                <tr
                  key={guia.id}
                  className="
                    border-t
                  "
                >

                  <td className="p-4 font-mono">
                    {guia.numero}
                  </td>

                  <td className="p-4">

                    {guia.origenLocal
                      ?.nombre ||
                      "CENTRAL"}

                    {" → "}

                    {guia.destinoLocal
                      ?.nombre ||
                      guia.otroDestino ||
                      "CENTRAL"}

                  </td>

                  <td className="p-4 text-center">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold
                        ${estadoColor(
                          guia.estado
                        )}
                      `}
                    >
                      {guia.estado}
                    </span>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}