"use client";

import Link from "next/link";

export default function GuiasPage() {

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Guías
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión de traslados y recepciones
          </p>
        </div>

        <Link
          href="/guias/nueva"
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            shadow
            transition
          "
        >
          + Nueva Guía
        </Link>

      </div>

      {/* CONTENIDO */}

      <div className="bg-white rounded-2xl p-6 shadow">

        <p className="text-gray-500">
          Aquí se visualizarán las guías generadas.
        </p>

      </div>

    </div>
  );
}