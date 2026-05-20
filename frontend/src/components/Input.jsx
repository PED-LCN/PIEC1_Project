export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-3 rounded-xl border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-emerald-800
          transition-all duration-300 ${className}`}
      />
    </div>
  );
}
