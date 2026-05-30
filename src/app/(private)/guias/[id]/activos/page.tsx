"use client";

import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";

type Asset = {
  id: number;
  codigo: string;
  serie: string;
  categoria: string;
  marca: string;
  modelo: string;
  dispositivo: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function GuiaActivosPage({ params }: PageProps) {
  const { id: guiaId } = use(params);
  const router = useRouter();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("TODOS");

  /**
   * =======================================================
   * CARGAR ACTIVOS DISPONIBLES
   * =======================================================
   */
  const loadAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/activos/disponibles"); 

      if (!res.ok) {
        console.error(`Error en el servidor: Estado ${res.status}`);
        setAssets([]);
        return;
      }

      const textData = await res.text();
      if (!textData) {
        setAssets([]);
        return;
      }

      const data = JSON.parse(textData);
      setAssets(Array.isArray(data) ? data : data.assets || []);
    } catch (error) {
      console.error("Error crítico parseando los activos:", error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  /**
   * =========================
   * SELECCIONAR ACTIVO
   * =========================
   */
  const toggleAsset = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  /**
   * =======================================================
   * GUARDAR GUIA 
   * =======================================================
   */
  const guardar = async () => {
    if (selected.length === 0) {
      alert("Selecciona al menos un activo");
      return;
    }

    try {
      const res = await fetch(`/api/guias/${guiaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activos: selected, 
        }),
      });

      const textData = await res.text();
      const data = textData ? JSON.parse(textData) : {};

      if (!res.ok) {
        alert(data.error || "Error al procesar la solicitud en el servidor");
        return;
      }

      alert("Guía guardada correctamente con sus activos");
      router.push("/guias/por-cerrar"); 
    } catch (error) {
      console.error(error);
      alert("Error guardando guía");
    }
  };

  /**
   * =========================
   * FILTROS
   * =========================
   */
  const categorias = useMemo(() => {
    const values = assets.map((a) => a.categoria).filter(Boolean);
    return ["TODOS", ...new Set(values)];
  }, [assets]);

  const filteredAssets = assets.filter((asset) => {
    const text =
      `${asset.codigo || ""} ${asset.serie || ""} ${asset.marca || ""} ${asset.modelo || ""} ${asset.dispositivo || ""}`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesCategoria =
      categoria === "TODOS" ? true : asset.categoria === categoria;

    return matchesSearch && matchesCategoria;
  });

  // IMITACIÓN: Pantalla de carga integrada a la estética de fondo blanco
  if (loading) {
    return (
      <div className="p-10 max-w-6xl mx-auto">
        <p className="text-lg text-slate-600 font-medium animate-pulse">
          Cargando activos disponibles...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-slate-900 p-2 space-y-6">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agregar Activos</h1>
          <p className="text-slate-500 mt-1">
            Selecciona los activos de inventario que serán enviados en la guía.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Contador en Badge Azul de alto contraste claro */}
          <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
            {selected.length} seleccionados
          </div>

          <button
            onClick={guardar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm text-sm"
          >
            Guardar Guía
          </button>
        </div>
      </div>

      {/* FILTROS: Estilizado con contenedores blancos e inputs limpios */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row gap-4 shadow-sm">
        <input
          type="text"
          placeholder="Buscar por código, serie, marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 min-w-[220px] text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm cursor-pointer"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* GRID DE TARJETAS DE ACTIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => {
          const active = selected.includes(asset.id);

          return (
            <div
              key={asset.id}
              onClick={() => toggleAsset(asset.id)}
              className={`border rounded-2xl p-5 cursor-pointer transition-all bg-white shadow-sm flex flex-col justify-between ${
                active
                  ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/10 shadow-md shadow-blue-600/5"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div>
                    <h2 className="font-bold text-base text-slate-900">
                      {asset.dispositivo}
                    </h2>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                      {asset.categoria}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={active}
                    readOnly
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2 text-sm text-slate-700 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400 font-semibold text-xs uppercase block">Código</span>
                    <span className="font-mono font-bold text-sm text-blue-600">{asset.codigo}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-400 font-semibold text-xs uppercase block">Serie</span>
                      <span className="font-medium text-slate-800 break-words">{asset.serie || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold text-xs uppercase block">Marca / Modelo</span>
                      <span className="font-medium text-slate-800 break-words">{asset.marca} {asset.modelo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECCIÓN VACÍA */}
      {filteredAssets.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-medium shadow-sm">
          No se encontraron activos disponibles que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}