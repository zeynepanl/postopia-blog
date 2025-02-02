export default function StatsCard({ title, count, color }) {
  const colors = {
    purple: "bg-purple-100 text-purple-700",
    blue: "bg-blue-100 text-blue-700",
    pink: "bg-pink-100 text-pink-700",
  };

  return (
    <div className={`w-56 p-5 rounded-lg ${colors[color]} flex flex-col items-center justify-center text-center`}>
      <h3 className="text-lg font-semibold">{count}</h3>
      <p>{title}</p>
    </div>
  );
}
