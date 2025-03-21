import { ChangeEvent, useState } from "react";
import "./SearchInput.scss";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (searchTerm: string) => void;
  className?: string;
}

const SearchInput = ({
  placeholder = "بحث...",
  value,
  onChange,
  onSearch,
  className = "",
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };
  
  const handleClear = () => {
    const event = {
      target: { value: "" }
    } as ChangeEvent<HTMLInputElement>;
    onChange(event);
  };
  
  return (
    <div className={`input search-input-wrapper ${className}`}>
      <label htmlFor="search-input">البحث عن كشاف</label>
      <div className={`search-input-container ${isFocused ? "focused" : ""}`}>
        <div className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <input
          id="search-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="search-input"
        />
        
        {value && (
          <button 
            type="button" 
            className="clear-button"
            onClick={handleClear}
            aria-label="مسح البحث"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;