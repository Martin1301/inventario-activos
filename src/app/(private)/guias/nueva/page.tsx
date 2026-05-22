"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Local = {
  id: number;
  nombre: string;
};

type User = {
  id: number;
  nombre: string;
};

export default function NuevaGuiaPage() {
  const [locales, setLocales] = useState<Local[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);

  const [numero, setNumero] = useState("");

  const [encargadoTipo, setEncargadoTipo] = useState<
    "SOPORTE" | "TRANSPORTE"
  >("SOPORTE");

  const [encargadoId, setEncargadoId] = useState("");

  const [destinoTipo, setDestinoTipo] = useState<
    "LOCAL" | "OTROS"
  >("LOCAL");

  const [destinoLocalId, setDestinoLocalId] = useState("");

  const [otroDestino, setOtroDestino] = useState("");

  const [observaciones, setObservaciones] = useState("");

  const fechaActual = new Date().toLocaleDateString("es-PE");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [localesRes, usersRes] = await Promise.all([
        fetch("/api/locales"),
        fetch("/api/users/soporte"),
      ]);

      const localesData = await localesRes.json();
      const usersData = await usersRes.json();

      setLocales(localesData);
      setUsuarios(usersData);

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {

      const body = {
        numero: `180 - N° ${numero}`,

        encargadoTipo,

        encargadoId:
          encargadoTipo === "SOPORTE"
            ? Number(encargadoId)
            : null,

        destinoTipo,

        destinoLocalId:
          destinoTipo === "LOCAL"
            ? Number(destinoLocalId)
            : null,

        otroDestino:
          destinoTipo === "OTROS"
            ? otroDestino
            : null,

        observaciones,
      };

      const res = await fetch("/api/guias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

if (!res.ok) {
  alert(data.error || "Error creando guía");
  return;
}

window.location.href = `/guias/${data.id}/activos`;

    } catch (error) {
      console.error(error);
      alert("Error inesperado");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Nueva Guía
          </h1>

          <p className="text-gray-500 mt-1">
            Registro de traslado de activos
          </p>
        </div>

        <Link
          href="/guias"
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Volver
        </Link>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-8 space-y-8"
      >

        {/* DATOS GENERALES */}
        <div>

          <h2 className="text-xl font-semibold mb-5">
            Datos Generales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NUMERO */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Número de Guía
              </label>

              <div className="flex items-stretch w-full">

  <div className="
    whitespace-nowrap
    bg-gray-100
    border
    border-r-0
    rounded-l-lg
    px-4
    flex
    items-center
    justify-center
    text-gray-700
    font-medium
  ">
    180 - N°
  </div>

      <input
  type="text"
  required
  value={numero}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 7);
    setNumero(onlyNumbers);
  }}
  inputMode="numeric"
  pattern="[0-9]*"
  className="
    flex-1
    border
    rounded-r-lg
    p-3
    outline-none
    focus:ring-2
    focus:ring-blue-500
  "
  placeholder="000123"
/>

</div>

            </div>

            {/* FECHA */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Fecha
              </label>

              <input
                type="text"
                value={fechaActual}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100 text-gray-600"
              />

            </div>

          </div>

        </div>

        {/* ENCARGADO */}
        <div>

          <h2 className="text-xl font-semibold mb-5">
            Encargado del Traslado
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-6">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={encargadoTipo === "SOPORTE"}
                  onChange={() =>
                    setEncargadoTipo("SOPORTE")
                  }
                />
                Personal de soporte
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={encargadoTipo === "TRANSPORTE"}
                  onChange={() =>
                    setEncargadoTipo("TRANSPORTE")
                  }
                />
                Transporte
              </label>

            </div>

            {encargadoTipo === "SOPORTE" && (
              <select
                required
                value={encargadoId}
                onChange={(e) =>
                  setEncargadoId(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              >

                <option value="">
                  Seleccionar personal
                </option>

                {usuarios.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.nombre}
                  </option>
                ))}

              </select>
            )}

          </div>

        </div>

        {/* DESTINO */}
        <div>

          <h2 className="text-xl font-semibold mb-5">
            Destinatario
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-6">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={destinoTipo === "LOCAL"}
                  onChange={() =>
                    setDestinoTipo("LOCAL")
                  }
                />
                Local
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={destinoTipo === "OTROS"}
                  onChange={() =>
                    setDestinoTipo("OTROS")
                  }
                />
                Otros
              </label>

            </div>

            {destinoTipo === "LOCAL" ? (
              <select
                required
                value={destinoLocalId}
                onChange={(e) =>
                  setDestinoLocalId(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              >

                <option value="">
                  Seleccionar local
                </option>

                {locales.map((local) => (
                  <option
                    key={local.id}
                    value={local.id}
                  >
                    {local.nombre}
                  </option>
                ))}

              </select>
            ) : (
              <input
                type="text"
                required
                value={otroDestino}
                onChange={(e) =>
                  setOtroDestino(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                placeholder="Escribir destinatario"
              />
            )}

          </div>

        </div>

        {/* OBSERVACIONES */}
        <div>

          <h2 className="text-xl font-semibold mb-5">
            Observaciones
          </h2>

          <textarea
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
            rows={4}
            className="w-full border rounded-lg p-3"
            placeholder="Observaciones adicionales..."
          />

        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4 pt-4">

          <Link
            href="/guias"
            className="px-5 py-3 rounded-lg border hover:bg-gray-100"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Crear Guía
          </button>

        </div>

      </form>

    </div>
  );
}