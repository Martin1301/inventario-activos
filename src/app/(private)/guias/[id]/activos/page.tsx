"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Asset = {
  id: number;
  codigo: string;
  serie: string;
  categoria: string;
  marca: string;
  modelo: string;
  dispositivo: string;
};

export default function GuiaActivosPage() {

  const params = useParams();

  const router = useRouter();

  const [assets, setAssets] = useState<Asset[]>([]);

  const [selected, setSelected] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [categoria, setCategoria] = useState("TODOS");

  /**
   * =========================
   * CARGAR ACTIVOS
   * =========================
   */

  const loadAssets = async () => {

    try {

      const res = await fetch(
        `/api/guias/${params.id}/activos`
      );

      const data = await res.json();

      setAssets(data);

    } catch (error) {

      console.error(error);

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

      setSelected(
        selected.filter((item) => item !== id)
      );

    } else {

      setSelected([...selected, id]);
    }
  };

  /**
   * =========================
   * GUARDAR GUIA
   * =========================
   */

  const guardar = async () => {

    if (selected.length === 0) {
      alert("Selecciona al menos un activo");
      return;
    }

    try {

      const res = await fetch(
        `/api/guias/${params.id}/agregar-activos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activos: selected,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Guía guardada correctamente");

      router.push("/guias");

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

    const values = assets.map(
      (a) => a.categoria
    );

    return ["TODOS", ...new Set(values)];

  }, [assets]);

  const filteredAssets = assets.filter((asset) => {

    const text =
      `${asset.codigo} ${asset.serie} ${asset.marca} ${asset.modelo} ${asset.dispositivo}`
        .toLowerCase();

    const matchesSearch =
      text.includes(search.toLowerCase());

    const matchesCategoria =
      categoria === "TODOS"
        ? true
        : asset.categoria === categoria;

    return matchesSearch && matchesCategoria;
  });

  /**
   * =========================
   * LOADING
   * =========================
   */

  if (loading) {

    return (
      <div className="p-10">
        <p className="text-lg text-gray-500">
          Cargando activos...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Agregar Activos
          </h1>

          <p className="text-gray-500 mt-1">
            Selecciona los activos que serán enviados en la guía
          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="
            bg-blue-100
            text-blue-700
            px-4
            py-2
            rounded-xl
            font-semibold
          ">
            {selected.length} seleccionados
          </div>

          <button
            onClick={guardar}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-xl
              font-medium
              shadow
            "
          >
            Guardar Guía
          </button>

        </div>

      </div>

      {/* FILTROS */}
      <div className="
        bg-white
        rounded-2xl
        shadow
        p-5
        flex
        flex-col
        md:flex-row
        gap-4
      ">

        <input
          type="text"
          placeholder="Buscar por código, serie, marca..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            flex-1
            border
            rounded-xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <select
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value)
          }
          className="
            border
            rounded-xl
            px-4
            py-3
            min-w-[220px]
          "
        >

          {categorias.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}

        </select>

      </div>

      {/* GRID */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-5
      ">

        {filteredAssets.map((asset) => {

          const active =
            selected.includes(asset.id);

          return (

            <div
              key={asset.id}
              onClick={() =>
                toggleAsset(asset.id)
              }
              className={`
                border-2
                rounded-2xl
                p-5
                cursor-pointer
                transition-all
                bg-white
                hover:shadow-lg
                ${
                  active
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-200"
                }
              `}
            >

              <div className="
                flex
                items-start
                justify-between
                mb-4
              ">

                <div>

                  <h2 className="
                    font-bold
                    text-lg
                  ">
                    {asset.dispositivo}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {asset.categoria}
                  </p>

                </div>

                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    toggleAsset(asset.id)
                  }
                  className="w-5 h-5"
                />

              </div>

              <div className="space-y-2 text-sm">

                <div>
                  <span className="font-semibold">
                    Código:
                  </span>{" "}
                  {asset.codigo}
                </div>

                <div>
                  <span className="font-semibold">
                    Serie:
                  </span>{" "}
                  {asset.serie}
                </div>

                <div>
                  <span className="font-semibold">
                    Marca:
                  </span>{" "}
                  {asset.marca}
                </div>

                <div>
                  <span className="font-semibold">
                    Modelo:
                  </span>{" "}
                  {asset.modelo}
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* VACIO */}
      {filteredAssets.length === 0 && (

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-10
          text-center
          text-gray-500
        ">
          No se encontraron activos
        </div>

      )}

    </div>
  );
}