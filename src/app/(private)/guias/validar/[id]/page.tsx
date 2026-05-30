"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Detail = {
  id: number;
  recibido: boolean;
  observaciones?: string;
  asset: {
    codigo: string;
    dispositivo: string;
    marca: string;
    modelo: string;
    serie: string;
  };
};

type Guia = {
  id: number;
  numero: string;
  estado: string;
  details: Detail[];
};

export default function ValidarGuiaPage() {
  const params = useParams();
  const [guia, setGuia] = useState<Guia | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * LOAD GUIA
   */
  const loadGuia = async () => {
    try {
      const res = await fetch(`/api/guias/${params.id}`);
      const data = await res.json();
      setGuia(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuia();
  }, []);

  /**
   * TOGGLE
   */
  const toggleRecibido = (detailId: number) => {
    if (!guia || !guia.details) return;

    setGuia({
      ...guia,
      details: guia.details.map((d) =>
        d.id === detailId
          ? {
              ...d,
              recibido: !d.recibido,
            }
          : d
      ),
    });
  };

  /**
   * GUARDAR
   */
  const guardarRecepcion = async () => {
    if (!guia) return;

    try {
      const res = await fetch(`/api/guias/${guia.id}/recepcionar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details: guia.details || [],
        }),
      });

      if (!res.ok) {
        alert("Error recepcionando");
        return;
      }

      alert("Guía validada");
      window.location.href = "/guias/validar";
    } catch (error) {
      console.error(error);
    }
  };

  // IMITACIÓN: Mensaje de carga integrado al Light Mode
  if (loading) {
    return <div className="p-6 text-slate-600 font-medium">Cargando detalles de la guía...</div>;
  }

  // IMITACIÓN: Mensaje de error / estado vacío integrado al Light Mode
  if (!guia) {
    return <div className="p-6 text-slate-500 font-medium">❌ Guía no encontrada</div>;
  }

  return (
    <div className="max-w-6xl mx-auto text-slate-900 p-2">
      
      {/* CABECERA DE LA GUÍA */}
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold text-slate-900">Validar Guía</h1>
        <p className="text-blue-600 font-mono font-bold text-lg mt-1 tracking-wider">{guia.numero}</p>
      </div>

      {/* TABLA DE DETALLES DE ITEMS: Estructura unificada blanca rounded-2xl */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 w-44">Código</th>
                <th className="p-4">Dispositivo</th>
                <th className="p-4">Serie / Modelo</th>
                <th className="p-4 text-center w-32">Recibido</th>
              </tr>
            </thead>

            <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
              {(guia.details || []).map((detail) => (
                <tr key={detail.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* CÓDIGO ASSET */}
                  <td className="p-4 font-mono font-bold text-slate-900">
                    {detail.asset?.codigo || "N/A"}
                  </td>
                  
                  {/* DISPOSITIVO */}
                  <td className="p-4 font-medium text-slate-800">
                    {detail.asset?.dispositivo || "N/A"}
                  </td>
                  
                  {/* SERIE */}
                  <td className="p-4 text-slate-500">
                    {detail.asset?.serie || "N/A"} {detail.asset?.marca ? `(${detail.asset.marca})` : ""}
                  </td>
                  
                  {/* CHECKBOX INTERACTIVO DE TRASLADO */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={detail.recibido}
                      onChange={() => toggleRecibido(detail.id)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER CONTADOR */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Total de activos asignados en este documento: {(guia.details || []).length} items</span>
        </div>
      </div>

      {/* ACCION GENERAL: Botón esmeralda con sombras y comportamiento fluido */}
      <div className="flex justify-end mt-6">
        <button
          onClick={guardarRecepcion}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          ✔ Confirmar Recepción
        </button>
      </div>

    </div>
  );
}