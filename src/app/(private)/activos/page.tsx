"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Categoria = {
  categoria: string;
  total: number;
  central: number;
  locales: number;
};

const iconMap: Record<string, string> = {
  CPU: "/icons/cpu.png",
  MONITOR: "/icons/monitor.png",
  IMPRESORA: "/icons/impresora.png",
  SWITCH_ROUTER: "/icons/switch.png",
  LECTORA: "/icons/lectora.png",
  CELULAR: "/icons/celular.png",
  TABLET: "/icons/tablet.png",
  TECLADO: "/icons/teclado.png",
  MOUSE: "/icons/mouse.png",
  GAVETA: "/icons/gaveta.png",
  CAMARAS: "/icons/camara.png",
  OTROS: "/icons/default.png",
};

export default function ActivosPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/activos/resumen");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Error en API");
      }

      if (!Array.isArray(data)) {
        throw new Error("Respuesta inválida");
      }

      setCategorias(data);

    } catch (err: any) {
      console.error(err);
      setCategorias([]);
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Activos
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión general de activos tecnológicos
          </p>
        </div>

        <Link
          href="/activos/facturas/nueva"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow transition-all duration-300"
        >
          + Nueva Factura
        </Link>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      )}

      {/* GRID */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {categorias.map((item, index) => (

            <div
              key={item.categoria}
              className="group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6"
              style={{
                animation: `fadeIn 0.5s ease forwards`,
                animationDelay: `${index * 80}ms`,
                opacity: 0,
              }}
            >

              {/* ICON */}
              <div className="flex flex-col items-center text-center mb-5">

                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-105 transition-all duration-300">

                  <Image
                    src={iconMap[item.categoria]}
                    alt={item.categoria}
                    width={56}
                    height={56}
                    className="object-contain w-14 h-14"
                  />

                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-800">
                  {item.categoria.replace("_", " / ")}
                </h2>

              </div>

              

              {/* ACTIONS */}
              <div className="mt-6 space-y-3">

                <Link
                  href={`/activos/${item.categoria}/central`}
                  className="block text-center bg-slate-900 hover:bg-slate-700 text-white py-3 rounded-xl transition-all duration-300"
                >
                  Ver Central
                </Link>

                <Link
                  href={`/activos/${item.categoria}/locales`}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all duration-300"
                >
                  Ver Locales
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* ANIMACIONES */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}