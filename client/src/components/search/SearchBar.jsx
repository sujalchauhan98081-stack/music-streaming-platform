import { Search as SearchIcon, X } from "lucide-react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <SearchIcon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What do you want to listen to?"
        className="w-full bg-surface text-textPrimary pl-11 pr-10 py-3 rounded-full outline-none focus:ring-2 focus:ring-primary transition-shadow"
        autoFocus
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;