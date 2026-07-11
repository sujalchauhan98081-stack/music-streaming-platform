const Button = ({ children, loading, ...props }) => {
  return (
    <button
      disabled={loading}
      className="w-full bg-primary text-black font-semibold py-3 rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;