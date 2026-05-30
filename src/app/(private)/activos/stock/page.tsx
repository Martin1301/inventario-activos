"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Asset = {
  id: number;
  codigo: string;
  dispositivo: string;
  marca: string;
  modelo: string;
  estado: string;
};

type CurrentUser = {
  id: number;
  role: "CENTRAL" | "LOCAL";
  nombre: string;
  localId?: number;
};

export default function StockLocalPage() {
  const [activos, setActivos] = useState<Asset[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarInventario = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener la sesión y datos del usuario logueado
        const userRes = await fetch("/api/auth/me");
        if (!userRes.ok) throw new Error("No se pudo cargar la sesión del usuario");
        const userData: CurrentUser = await userRes.json();
        setUser(userData);

        // 2. Cargar activos disponibles (Ajusta este fetch a tu endpoint de disponibles)
        // Pasamos el localId en los parámetros si el rol del usuario es LOCAL
        const url = userData.role === "LOCAL" 
          ? `/api/activos/disponibles?localId=${userData.localId}`
          : "/api/activos/disponibles";

        const activosRes = await fetch(url);
        if (!activosRes.ok) throw new Error("Error al obtener los activos en stock");
        const activosData = await activosRes.json();
        
        setActivos(Array.isArray(activosData) ? activosData : []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Ocurrió un error al cargar el stock");
      } finally {
        setLoading(false);
      }
    };

    cargarInventario();
  }, []);

  // Filtro de búsqueda dinámico (por código, dispositivo o marca)
  const activosFiltrados = activos.filter((activo) => {
    const termino = busqueda.toLowerCase();
    return (
      activo.codigo.toLowerCase().includes(termino) ||
      activo.dispositivo.toLowerCase().includes(termino) ||
      activo.marca.toLowerCase().includes(termino) ||
      activo.modelo.toLowerCase().includes(termino)
    );
  });

  if (loading) return <div className="p-6 text-slate-600 font-medium">Cargando inventario de activos...</div>;
  if (error) return <div className="p-6 text-red-600 font-medium">❌ Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto text-slate-900 p-2">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Stock de Activos</h1>
          <p className="text-slate-500 mt-1">
            Visualizando activos en estado <span className="text-emerald-600 font-bold">DISPONIBLE / STOCK</span> en{" "}
            <span className="font-semibold text-blue-600">
              {user?.role === "CENTRAL" ? "SEDE CENTRAL" : `SUCURSAL (ID: ${user?.localId})`}
            </span>
          </p>
        </div>
        <Link
          href="/guias/nueva"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors text-sm"
        >
          📦 Crear Guía de Traslado
        </Link>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código, dispositivo o marca..."
            className="w-full border border-slate-300 rounded-lg p-3 pl-10 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm"
          />
          <span className="absolute left-3 top-3.5 text-slate-400 pointer-events-none text-sm">🔍</span>
        </div>
      </div>

      {/* TABLA DE ACTIVOS EN STOCK */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 w-40">Código</th>
                <th className="p-4">Dispositivo</th>
                <th className="p-4">Marca / Modelo</th>
                <th className="p-4 text-center">Estado Logístico</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
              {activosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400 font-medium">
                    No se encontraron activos disponibles en el stock actual de este local.
                  </td>
                </tr>
              ) : (
                activosFiltrados.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {asset.codigo}
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {asset.dispositivo}
                    </td>
                    <td className="p-4 text-slate-500">
                      {asset.marca} / {asset.modelo}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold inline-block">
                        {asset.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER CONTADOR */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Mostrando {activosFiltrados.length} de {activos.length} activos en total</span>
        </div>
      </div>

    </div>
  );
}