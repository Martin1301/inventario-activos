"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Guia = {
  id: number;
  numero: string;
  estado: string;

  fechaEnvio: string;

  destinoTipo: string;

  otroDestino?: string | null;

  encargadoTipo?: string;

  origenLocal?: {
    nombre: string;
  } | null;

  destinoLocal?: {
    nombre: string;
  } | null;

  enviadoPor?: {
    nombre: string;
    role: "CENTRAL" | "LOCAL";
  } | null;

  encargadoUser?: {
    nombre: string;
  } | null;
};

export default function ValidarGuiasPage() {

  const [guias, setGuias] =
    useState<Guia[]>([]);

  const [loading, setLoading] =
    useState(true);

  /**
   * LOAD GUIAS
   */
  const loadGuias = async () => {

    try {

      const res = await fetch(
        "/api/guias?estado=TRANSITO"
      );

      const data =
        await res.json();

      setGuias(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      setGuias([]);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuias();
  }, []);

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
        Cargando guías pendientes...
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
            Guías por validar
          </h1>

          <p
            className="
              text-slate-500
              mt-1
            "
          >
            Guías en tránsito
            pendientes de validación
            y recepción.
          </p>

        </div>

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

        <div className="overflow-x-auto">

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

                <th className="p-4 w-44">
                  Número
                </th>

                <th className="p-4">
                  Origen
                </th>

                <th className="p-4">
                  Encargado
                </th>

                <th className="p-4">
                  Destino
                </th>

                <th className="p-4">
                  Fecha Envío
                </th>

                <th className="p-4 text-center w-32">
                  Estado
                </th>

                <th className="p-4 text-center w-40">
                  Acción
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

              {guias.length === 0 ? (

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
                    No hay guías pendientes
                    en tránsito para validar.
                  </td>

                </tr>

              ) : (

                guias.map((guia) => {

                  /**
                   * ORIGEN
                   */
                  const origenTexto =
                    guia.enviadoPor?.nombre ||
                    "Sin usuario";

                  /**
                   * TRASLADO
                   */
                  let trasladoTexto =
                    "Transporte Bys";

                  if (
                    guia.encargadoTipo ===
                      "SOPORTE" &&
                    guia.encargadoUser
                      ?.nombre
                  ) {

                    trasladoTexto =
                      guia.encargadoUser
                        .nombre;
                  }

                  /**
                   * DESTINO
                   */
                  let destinoTexto =
                    "N/A";

                  if (
                    guia.destinoTipo ===
                    "OTROS"
                  ) {

                    destinoTexto =
                      guia.otroDestino ||
                      "OTROS";

                  } else {

                    destinoTexto =
                      guia.destinoLocal
                        ?.nombre ||
                      "N/A";
                  }

                  return (

                    <tr
                      key={guia.id}
                      className="
                        hover:bg-slate-50/80
                        transition-colors
                      "
                    >

                      {/* NUMERO */}
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

                      {/* ORIGEN */}
                      <td
                        className="
                          p-4
                          font-medium
                          text-slate-800
                        "
                      >
                        {origenTexto}
                      </td>

                      {/* TRASLADO */}
                      <td className="p-4">

                        
                          {trasladoTexto}

                      </td>

                      {/* DESTINO */}
                      <td
                        className="
                          p-4
                          text-slate-600
                        "
                      >
                        {destinoTexto}
                      </td>

                      {/* FECHA */}
                      <td
                        className="
                          p-4
                          text-slate-500
                        "
                      >

                        {new Date(
                          guia.fechaEnvio
                        ).toLocaleDateString(
                          "es-PE",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}

                      </td>

                      {/* ESTADO */}
                      <td className="p-4 text-center">

                        <span
                          className="
                            bg-blue-50
                            text-blue-700
                            border
                            border-blue-200
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-bold
                            inline-block
                          "
                        >
                          {guia.estado}
                        </span>

                      </td>

                      {/* ACCION */}
                      <td className="p-4 text-center">

                        <Link
                          href={`/guias/validar/${guia.id}`}
                          className="
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            text-xs
                            font-semibold
                            px-4
                            py-2
                            rounded-lg
                            inline-block
                            transition-colors
                            shadow-sm
                          "
                        >
                          Validar
                        </Link>

                      </td>

                    </tr>
                  );
                })
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
            Mostrando {guias.length} {" "}
            guías en tránsito
          </span>

        </div>

      </div>

    </div>
  );
}