"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Guia = {
  id: number;
  numero: string;
  estado: string;
  fechaRecepcion?: string;

  origenLocal?: {
    nombre: string;
  } | null;

  destinoLocal?: {
    nombre: string;
  } | null;

  enviadoPor?: {
    nombre: string;
  } | null;

  encargadoUser?: {
    nombre: string;
  } | null;

  encargadoTipo?: "SOPORTE" | "TRANSPORTE";

  _count?: {
    details: number;
  };
};

export default function ListadoGuiasPage() {

  const [guias, setGuias] =
    useState<Guia[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorApi, setErrorApi] =
    useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<
      "transito" | "validadas"
    >("transito");

  /**
   * LOAD GUIAS
   */
  const loadGuias = async () => {

    try {

      setErrorApi(null);

      const res = await fetch(
        "/api/guias"
      );

      const data =
        await res.json();

      if (
        res.ok &&
        Array.isArray(data)
      ) {

        setGuias(data);

      } else {

        setErrorApi(
          data.error ||
          "Error desconocido al cargar las guías"
        );

        setGuias([]);
      }

    } catch (error) {

      console.error(
        "Error cargando las guías:",
        error
      );

      setErrorApi(
        "No se pudo conectar con el servidor"
      );

      setGuias([]);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuias();
  }, []);

  const listaSegura =
    Array.isArray(guias)
      ? guias
      : [];

  /**
   * FILTRO
   */
  const guiasFiltradas =
    listaSegura.filter(
      (guia) => {

        if (
          activeTab ===
          "transito"
        ) {

          return (
            guia.estado ===
            "TRANSITO"
          );
        }

        return (
          guia.estado ===
            "RECIBIDA" ||
          guia.estado ===
            "PARCIAL"
        );
      }
    );

  const totalTransito =
    listaSegura.filter(
      (g) =>
        g.estado ===
        "TRANSITO"
    ).length;

  const totalValidadas =
    listaSegura.filter(
      (g) =>
        g.estado ===
          "RECIBIDA" ||
        g.estado ===
          "PARCIAL"
    ).length;

  /**
   * LOADING
   */
  if (loading) {

    return (
      <div
        className="
          p-6
          text-slate-600
          font-medium
        "
      >
        Cargando listado
        de guías...
      </div>
    );
  }

  /**
   * ERROR
   */
  if (errorApi) {

    return (

      <div className="p-6">

        <div
          className="
            bg-red-50
            border
            border-red-200
            p-4
            rounded-xl
            text-red-700
          "
        >

          <h2
            className="
              font-bold
              text-lg
            "
          >
            Hubo un problema
          </h2>

          <p
            className="
              text-sm
              mt-1
            "
          >
            {errorApi}
          </p>

        </div>

      </div>
    );
  }

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        text-slate-900
        p-2
      "
    >

      {/* HEADER */}
      <div
        className="
          mb-8
          flex
          flex-col
          sm:flex-row
          justify-between
          items-start
          sm:items-center
          gap-4
          border-b
          border-slate-200
          pb-5
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Control de Guías
          </h1>

          <p
            className="
              text-slate-500
              mt-1
            "
          >
            Gestiona el estado y
            validación de activos.
          </p>

        </div>

        <Link
          href="/guias/nueva"
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            text-sm
            font-semibold
            px-5
            py-2.5
            rounded-lg
            inline-block
            transition-colors
            shadow-sm
            whitespace-nowrap
          "
        >
          + Nueva Guía
        </Link>

      </div>

      {/* TABS */}
      <div
        className="
          flex
          border-b
          border-slate-200
          mb-6
          gap-2
        "
      >

        <button
          onClick={() =>
            setActiveTab(
              "transito"
            )
          }
          className={`
            px-5
            py-2.5
            font-bold
            text-sm
            transition-all
            rounded-t-lg
            border-b-2
            ${
              activeTab ===
              "transito"
                ? `
                  bg-slate-50
                  text-blue-600
                  border-blue-600
                `
                : `
                  text-slate-500
                  border-transparent
                  hover:text-slate-900
                `
            }
          `}
        >
          En Tránsito (
          {totalTransito})
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "validadas"
            )
          }
          className={`
            px-5
            py-2.5
            font-bold
            text-sm
            transition-all
            rounded-t-lg
            border-b-2
            ${
              activeTab ===
              "validadas"
                ? `
                  bg-slate-50
                  text-emerald-600
                  border-emerald-600
                `
                : `
                  text-slate-500
                  border-transparent
                  hover:text-slate-900
                `
            }
          `}
        >
          Validadas (
          {totalValidadas})
        </button>

      </div>

      {/* TABLE */}
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              w-full
              text-left
              border-collapse
            "
          >

            <thead
  className="
    bg-slate-50
    text-slate-700
    text-xs
    uppercase
    font-bold
    tracking-wider
    border-b
    border-slate-200
  "
>

  <tr>

    <th className="p-4">
      Número
    </th>

    <th className="p-4">
      Origen
    </th>

    <th className="p-4">
      Destino
    </th>

    <th className="p-4">
      Traslado
    </th>

    <th className="p-4">
      Encargado
    </th>

    {activeTab === "validadas" && (

      <th className="p-4">
        Fecha Recepción
      </th>

    )}

    <th className="p-4 text-center">
      Items
    </th>

    <th className="p-4 text-center">
      Estado
    </th>

  </tr>

</thead>

            <tbody
              className="
                text-slate-700
                text-sm
                divide-y
                divide-slate-100
              "
            >

              {guiasFiltradas.length ===
              0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="
                      p-10
                      text-center
                      text-slate-400
                      font-medium
                    "
                  >
                    No hay guías
                    disponibles.
                  </td>

                </tr>

              ) : (

                guiasFiltradas.map(
                  (guia) => {

                    /**
                     * ORIGEN
                     */
                    const origenTexto =
                    guia.enviadoPor?.nombre ||
                    "Sin usuario";

                    /**
                     * DESTINO
                     */
                    const destino =
                      guia.destinoLocal
                        ?.nombre ||
                      "OTROS";

                    /**
                     * TRASLADO
                     */
                    const traslado =
                      guia.encargadoTipo ===
                      "TRANSPORTE"
                        ? "TRANSPORTE"
                        : "SOPORTE";

                    /**
                     * ENCARGADO
                     */
                    const encargado =
                      guia.encargadoTipo ===
                      "TRANSPORTE"
                        ? "Transporte BYS"
                        : guia
                            .encargadoUser
                            ?.nombre ||
                          "Sin encargado";

                    return (

                      <tr
                        key={guia.id}
                        className="
                          hover:bg-slate-50
                          transition-colors
                        "
                      >

                        <td
                          className="
                            p-4
                            font-mono
                            font-bold
                            text-slate-900
                          "
                        >
                          {guia.numero}
                        </td>

                        <td
                          className="
                            p-4
                            font-medium
                            text-slate-800
                          "
                        >
                          {origenTexto}
                        </td>

                        <td
                          className="
                            p-4
                            text-slate-600
                          "
                        >
                          {destino}
                        </td>

                        <td
                          className="
                            p-4
                          "
                        >

                          <span
                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              border
                              ${
                                traslado ===
                                "TRANSPORTE"
                                  ? `
                                    bg-amber-50
                                    text-amber-700
                                    border-amber-200
                                  `
                                  : `
                                    bg-cyan-50
                                    text-cyan-700
                                    border-cyan-200
                                  `
                              }
                            `}
                          >
                            {traslado}
                          </span>

                        </td>

                        <td
                          className="
                            p-4
                            text-slate-700
                          "
                        >
                          {encargado}
                        </td>

                        {/* FECHA RECEPCION */}
{activeTab === "validadas" && (

  <td
    className="
      p-4
      text-slate-500
      whitespace-nowrap
    "
  >

    {guia.fechaRecepcion
      ? new Date(
          guia.fechaRecepcion
        ).toLocaleDateString(
          "es-PE",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )
      : "--"}

  </td>

)}

{/* ITEMS */}
<td
  className="
    p-4
    text-center
    font-mono
    font-bold
  "
>
  {guia._count
    ?.details || 0}
</td>

                        <td
                          className="
                            p-4
                            text-center
                          "
                        >

                          <span
                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              border
                              inline-block
                              ${
                                guia.estado ===
                                "TRANSITO"
                                  ? `
                                    bg-blue-50
                                    text-blue-700
                                    border-blue-200
                                  `
                                  : `
                                    bg-emerald-50
                                    text-emerald-700
                                    border-emerald-200
                                  `
                              }
                            `}
                          >
                            {guia.estado}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div
          className="
            bg-slate-50
            px-4
            py-3
            border-t
            border-slate-200
            flex
            justify-between
            items-center
            text-xs
            font-semibold
            text-slate-500
          "
        >

          <span>
            Mostrando{" "}
            {
              guiasFiltradas.length
            }{" "}
            guías
          </span>

        </div>

      </div>

    </div>
  );
}