export default function DashboardPage() {
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4 mt-4">

        <div className="bg-white p-4 rounded shadow">
          Activos Central
        </div>

        <div className="bg-white p-4 rounded shadow">
          En tránsito
        </div>

        <div className="bg-white p-4 rounded shadow">
          Locales
        </div>

      </div>

    </div>
  );
}