"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Local = {
  id: number;
  nombre: string;
};

type UsuarioSoporte = {
  id: number;
  nombre: string;
};

type CurrentUser = {
  id: number;
  nombre: string;
  role: "CENTRAL" | "LOCAL";
  localId?: number;
};

export default function NuevaGuiaPage() {

  const [locales, setLocales] =
    useState<Local[]>([]);

  const [usuariosSoporte, setUsuariosSoporte] =
    useState<UsuarioSoporte[]>([]);

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [numero, setNumero] =
    useState("");

  const [encargadoTipo, setEncargadoTipo] =
    useState<"SOPORTE" | "TRANSPORTE">(
      "SOPORTE"
    );

  const [encargadoId, setEncargadoId] =
    useState("");

  const [destinoTipo, setDestinoTipo] =
    useState<"LOCAL" | "OTROS">(
      "LOCAL"
    );

  const [destinoLocalId, setDestinoLocalId] =
    useState("");

  const [otroDestino, setOtroDestino] =
    useState("");

  const [observaciones, setObservaciones] =
    useState("");

  const fechaActual =
    new Date().toLocaleDateString("es-PE");

  /**
   * LOAD DATA
   */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const [
        localesRes,
        userRes,
        soporteRes,
      ] = await Promise.all([
        fetch("/api/locales"),
        fetch("/api/auth/me"),
        fetch("/api/users/soporte"),
      ]);

      const localesData =
        await localesRes.json();

      const userData =
        await userRes.json();

      const soporteData =
        await soporteRes.json();

      setLocales(
        Array.isArray(localesData)
          ? localesData
          : []
      );

      setUsuariosSoporte(
        Array.isArray(soporteData)
          ? soporteData
          : []
      );

      setUser(userData);

      /**
       * SI ES LOCAL
       */
      if (userData.role === "LOCAL") {

        setEncargadoTipo(
          "TRANSPORTE"
        );
      }

    } catch (error) {

      console.error(error);

    }
  };

  /**
   * SUBMIT
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const esUsuarioLocal =
        user?.role === "LOCAL";

      /**
       * DESTINO FINAL
       */
      let destinoFinalTipo:
        | "CENTRAL"
        | "LOCAL"
        | "OTROS";

      let destinoFinalLocalId:
        number | null = null;

      /**
       * LOCAL -> CENTRAL
       */
      if (esUsuarioLocal) {

        destinoFinalTipo =
          "CENTRAL";

        /**
         * ID CENTRAL
         */
        destinoFinalLocalId = 9;

      } else {

        /**
         * CENTRAL
         */
        destinoFinalTipo =
          destinoTipo;

        /**
         * CENTRAL -> LOCAL
         */
        if (
          destinoTipo === "LOCAL"
        ) {

          if (!destinoLocalId) {

            alert(
              "Selecciona un local"
            );

            return;
          }

          destinoFinalLocalId =
            Number(destinoLocalId);

          console.log(
            "LOCAL DESTINO:",
            destinoFinalLocalId
          );
        }
      }

      /**
       * BODY
       */
      const body = {

        numero:
          `180 - N° ${numero}`,

        encargadoTipo,

        encargadoId:
          encargadoTipo ===
            "SOPORTE" &&
          encargadoId
            ? Number(
                encargadoId
              )
            : null,

        destinoTipo:
          destinoFinalTipo,

        destinoLocalId:
          destinoFinalLocalId,

        otroDestino:
          destinoFinalTipo ===
          "OTROS"
            ? otroDestino
            : null,

        observaciones,
      };

      console.log(
        "BODY ENVIADO:",
        body
      );

      const res = await fetch(
        "/api/guias",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),
        }
      );

      const data =
        await res.json();

      console.log(
        "RESPUESTA:",
        data
      );

      if (!res.ok) {

        alert(
          data.error ||
          "Error creando guía"
        );

        return;
      }

      window.location.href =
        `/guias/${data.id}/activos`;

    } catch (error) {

      console.error(error);

      alert(
        "Error inesperado"
      );
    }
  };

  return (

    <div
      className="
        max-w-4xl
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
            Nueva Guía
          </h1>

          <p
            className="
              text-slate-500
              mt-1
            "
          >
            Registro de traslado
            de activos
          </p>

        </div>

        <Link
          href="/guias"
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

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          sm:p-8
          space-y-8
        "
      >

        {/* DATOS */}
        <div
          className="
            border-b
            border-slate-100
            pb-6
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-slate-900
              mb-5
            "
          >
            Datos Generales
          </h2>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            {/* NUMERO */}
            <div>

              <label
                className="
                  block
                  text-slate-700
                  text-sm
                  font-semibold
                  mb-2
                "
              >
                Número de Guía
              </label>

              <div
                className="
                  flex
                  items-stretch
                  w-full
                  shadow-sm
                  rounded-lg
                  overflow-hidden
                "
              >

                <div
                  className="
                    whitespace-nowrap
                    bg-slate-50
                    border
                    border-slate-300
                    border-r-0
                    rounded-l-lg
                    px-4
                    flex
                    items-center
                    justify-center
                    text-slate-500
                    font-bold
                    font-mono
                    text-sm
                  "
                >
                  180 - N°
                </div>

                <input
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => {

                    const onlyNumbers =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 7);

                    setNumero(
                      onlyNumbers
                    );
                  }}
                  className="
                    flex-1
                    border
                    border-slate-300
                    rounded-r-lg
                    p-3
                    text-sm
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

              <label
                className="
                  block
                  text-slate-700
                  text-sm
                  font-semibold
                  mb-2
                "
              >
                Fecha de Emisión
              </label>

              <input
                type="text"
                disabled
                value={fechaActual}
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-lg
                  p-3
                  bg-slate-50
                  text-slate-500
                  text-sm
                "
              />

            </div>

          </div>

        </div>

        {/* ENCARGADO */}
        <div
          className="
            border-b
            border-slate-100
            pb-6
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-slate-900
              mb-4
            "
          >
            Encargado del Traslado
          </h2>

          {user?.role === "CENTRAL" ? (

            <div className="space-y-5">

              {/* RADIOS */}
              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  gap-6
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    text-sm
                    font-medium
                    text-slate-800
                  "
                >

                  <input
                    type="radio"
                    checked={
                      encargadoTipo ===
                      "SOPORTE"
                    }
                    onChange={() =>
                      setEncargadoTipo(
                        "SOPORTE"
                      )
                    }
                    className="
                      w-4
                      h-4
                      accent-blue-600
                    "
                  />

                  Personal de soporte

                </label>

                <label
                  className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    text-sm
                    font-medium
                    text-slate-800
                  "
                >

                  <input
                    type="radio"
                    checked={
                      encargadoTipo ===
                      "TRANSPORTE"
                    }
                    onChange={() =>
                      setEncargadoTipo(
                        "TRANSPORTE"
                      )
                    }
                    className="
                      w-4
                      h-4
                      accent-blue-600
                    "
                  />

                  Transporte externo

                </label>

              </div>

              {/* LISTA SOPORTE */}
              {encargadoTipo ===
                "SOPORTE" && (

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      mb-2
                    "
                  >
                    Seleccionar personal
                  </label>

                  <select
                    required
                    value={encargadoId}
                    onChange={(e) =>
                      setEncargadoId(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      md:w-96
                      border
                      border-slate-300
                      rounded-lg
                      p-3
                      bg-white
                      text-sm
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  >

                    <option value="">
                      Seleccionar...
                    </option>

                    {usuariosSoporte.map(
                      (usuario) => (

                        <option
                          key={usuario.id}
                          value={usuario.id}
                        >
                          {usuario.nombre}
                        </option>
                      )
                    )}

                  </select>

                </div>

              )}

            </div>

          ) : (

            <div
              className="
                bg-amber-50
                border
                border-amber-200
                text-amber-800
                rounded-xl
                p-4
                text-sm
              "
            >
              El traslado será
              realizado por
              transporte.
            </div>

          )}

        </div>

        {/* DESTINO */}
        <div
          className="
            border-b
            border-slate-100
            pb-6
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-slate-900
              mb-4
            "
          >
            Destinatario
          </h2>

          <div className="space-y-4">

            {user?.role ===
              "CENTRAL" && (

              <div
                className="
                  flex
                  gap-6
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                  "
                >

                  <input
                    type="radio"
                    checked={
                      destinoTipo ===
                      "LOCAL"
                    }
                    onChange={() =>
                      setDestinoTipo(
                        "LOCAL"
                      )
                    }
                    className="
                      w-4
                      h-4
                      accent-blue-600
                    "
                  />

                  Local / Sucursal

                </label>

                <label
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                  "
                >

                  <input
                    type="radio"
                    checked={
                      destinoTipo ===
                      "OTROS"
                    }
                    onChange={() =>
                      setDestinoTipo(
                        "OTROS"
                      )
                    }
                    className="
                      w-4
                      h-4
                      accent-blue-600
                    "
                  />

                  Otros destinos

                </label>

              </div>

            )}

            {user?.role ===
              "LOCAL" && (

              <div
                className="
                  bg-blue-50
                  border
                  border-blue-200
                  text-blue-800
                  rounded-xl
                  p-4
                  text-sm
                "
              >
                Esta guía será enviada
                a la SEDE CENTRAL.
              </div>

            )}

            {/* SELECT LOCAL */}
            {destinoTipo ===
              "LOCAL" &&
              user?.role ===
              "CENTRAL" && (

              <select
                required
                value={destinoLocalId}
                onChange={(e) => {

                  console.log(
                    "LOCAL SELECCIONADO:",
                    e.target.value
                  );

                  setDestinoLocalId(
                    e.target.value
                  );
                }}
                className="
                  w-full
                  md:w-96
                  border
                  border-slate-300
                  rounded-lg
                  p-3
                  bg-white
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="">
                  Seleccionar local...
                </option>

                {locales.map(
                  (local) => (

                    <option
  key={local.id}
  value={String(local.id)}
>
  {local.nombre}
</option>
                  )
                )}

              </select>

            )}

            {/* OTROS */}
            {destinoTipo ===
              "OTROS" &&
              user?.role ===
              "CENTRAL" && (

              <input
                type="text"
                required
                value={otroDestino}
                onChange={(e) =>
                  setOtroDestino(
                    e.target.value
                  )
                }
                placeholder="Escribir destinatario"
                className="
                  w-full
                  md:w-96
                  border
                  border-slate-300
                  rounded-lg
                  p-3
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            )}

          </div>

        </div>

        {/* OBSERVACIONES */}
        <div>

          <h2
            className="
              text-lg
              font-bold
              text-slate-900
              mb-3
            "
          >
            Observaciones
          </h2>

          <textarea
            rows={4}
            value={observaciones}
            onChange={(e) =>
              setObservaciones(
                e.target.value
              )
            }
            placeholder="Notas adicionales..."
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              p-3
              text-sm
              outline-none
              resize-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        {/* FOOTER */}
        <div
          className="
            flex
            justify-end
            gap-4
            pt-4
            border-t
            border-slate-100
          "
        >

          <Link
            href="/guias"
            className="
              bg-white
              hover:bg-slate-50
              border
              border-slate-300
              text-slate-700
              text-sm
              font-semibold
              px-5
              py-2.5
              rounded-lg
            "
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-sm
              font-semibold
              px-6
              py-2.5
              rounded-lg
            "
          >
            Crear Guía
          </button>

        </div>

      </form>

    </div>
  );
}