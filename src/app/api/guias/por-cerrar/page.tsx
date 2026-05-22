"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Guia = {
  id: number;
  numero: string;
  estado: string;
  createdAt: string;
  details: {
    id: number;
  }[];
};

export default function GuiasPorCerrarPage() {

  const [guias, setGuias] = useState<Guia[]>([]);

  const [loading, setLoading] = useState(true);

  const loadGuias = async () => {

    try {

      const res = await fetch(
        "/api/guias/por-cerrar"
      );

      const data = await res.json();

      setGuias(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadGuias();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Cargando guías...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Guías por Cerrar
          </h1>

          <p className="text-gray-500 mt-1">
            Guías creadas sin activos asignados
          </p>

        </div>

        <Link
          href="/guias"
          className="
            bg-slate-800
            hover:bg-slate-700
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Volver
        </Link>

      </div>

      {/* VACIO */}
      {guias.length === 0 && (

        <div
          className="
            bg-white
            rounded-2xl
            shadow
            p-10
            text-center
          "
        >

          <h2 className="text-2xl font-semibold mb-2">
            No hay guías pendientes
          </h2>

          <p className="text-gray-500">
            Todas las guías tienen activos asignados.
          </p>

        </div>

      )}

      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {guias.map((guia) => (

          <div
            key={guia.id}
            className="
              bg-white
              rounded-2xl
              shadow
              border
              p-6
              hover:shadow-lg
              transition
            "
          >

            {/* NUMERO */}
            <div className="mb-4">

              <p className="text-sm text-gray-500">
                Número de guía
              </p>

              <h2 className="text-xl font-bold">
                {guia.numero}
              </h2>

            </div>

            {/* ESTADO */}
            <div className="mb-4">

              <span
                className="
                  inline-flex
                  items-center
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  bg-yellow-100
                  text-yellow-700
                "
              >
                {guia.estado}
              </span>

            </div>

            {/* ACTIVOS */}
            <div className="mb-5">

              <p className="text-sm text-gray-500">
                Activos agregados
              </p>

              <p className="text-2xl font-bold">
                {guia.details.length}
              </p>

            </div>

            {/* FECHA */}
            <div className="mb-6">

              <p className="text-sm text-gray-500">
                Fecha de creación
              </p>

              <p>
                {new Date(
                  guia.createdAt
                ).toLocaleDateString("es-PE")}
              </p>

            </div>

            {/* BOTON */}
            <Link
              href={`/guias/${guia.id}/activos`}
              className="
                w-full
                flex
                items-center
                justify-center
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-3
                rounded-xl
                font-medium
              "
            >
              Continuar Guía
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}