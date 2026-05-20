export default function Button({
  text,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-emerald-600 hover:bg-emerald-700 hover:scale-105 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 ${className}`}
    >
      {text}
    </button>
  );
}
