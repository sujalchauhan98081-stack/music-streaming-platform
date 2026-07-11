const InputField = ({ label, type = "text", value, onChange, error, ...props }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm text-textSecondary font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`bg-surface text-textPrimary px-4 py-3 rounded-md outline-none border ${
          error ? "border-red-500" : "border-transparent"
        } focus:border-primary transition-colors`}
        {...props}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default InputField;