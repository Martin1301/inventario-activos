"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UsuarioLocal = {
  id: number;

  nombre: string;

  email: string;

  role: string;

  createdAt: string;

  local: {
    id: number;
    nombre: string;
    direccion: string;
  } | null;
};

export default function LocalesPage() {

  const [usuarios, setUsuarios] =
    useState<UsuarioLocal[]>([]);

  const [loading, setLoading] =
    useState(true);

  /**
   * LOAD
   */
  useEffect(() => {

    async function fetchUsuarios() {

      try {

        const res = await fetch(
          "/api/locales"
        );

        const data = await res.json();

        setUsuarios(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(error);

        setUsuarios([]);

      } finally {

        setLoading(false);
      }
    }

    fetchUsuarios();

  }, []);

  /**
   * LOADING
   */
  if (loading) {

    return (

      <div className="p-6 text-slate-600 font-medium">

        Cargando personal...

      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto text-slate-900 p-2">

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
            Personal de Locales
          </h1>

          <p className="text-slate-500 mt-1">

            Usuarios encargados de
            sucursales y boticas

          </p>

        </div>

        <Link
          href="/dashboard"
          className="
            bg-slate-100
            hover:bg-slate-200
            text-slate-700
            text-sm
            font-semibold
            px-4
            py-2.5
            rounded-lg
            transition-colors
            border
            border-slate-200
            shadow-sm
          "
        >
          Volver
        </Link>

      </div>

      {/* TABLA */}
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

                <th className="p-4">
                  Encargado
                </th>

                <th className="p-4">
                  Correo Electrónico
                </th>

                <th className="p-4">
                  Local
                </th>

                <th className="p-4">
                  Dirección
                </th>

                <th className="p-4 text-center w-32">
                  Rol
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

              {usuarios.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="
                      p-10
                      text-center
                      text-slate-400
                      font-medium
                    "
                  >
                    No existen usuarios
                    de locales registrados
                  </td>

                </tr>

              ) : (

                usuarios.map((usuario) => (

                  <tr
                    key={usuario.id}
                    className="
                      hover:bg-slate-50/80
                      transition-colors
                    "
                  >

                    {/* NOMBRE */}
                    <td
                      className="
                        p-4
                        font-semibold
                        text-slate-900
                      "
                    >
                      {usuario.nombre}
                    </td>

                    {/* EMAIL */}
                    <td
                      className="
                        p-4
                        text-slate-600
                        font-mono
                      "
                    >
                      {usuario.email}
                    </td>

                    {/* LOCAL */}
                    <td
                      className="
                        p-4
                        font-medium
                        text-slate-800
                      "
                    >

                      {usuario.local
                        ? usuario.local.nombre
                        : (
                          <span className="text-red-500">
                            Sin local asignado
                          </span>
                        )}

                    </td>

                    {/* DIRECCION */}
                    <td
                      className="
                        p-4
                        text-slate-500
                      "
                    >

                      {usuario.local
                        ? usuario.local.direccion
                        : "—"}

                    </td>

                    {/* ROL */}
                    <td className="p-4 text-center">

                      <span
                        className="
                          bg-amber-50
                          text-amber-700
                          border
                          border-amber-200
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-bold
                          inline-block
                        "
                      >
                        {usuario.role}
                      </span>

                    </td>

                  </tr>

                ))

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
            Mostrando {usuarios.length} usuarios
          </span>

        </div>

      </div>

    </div>
  );
}