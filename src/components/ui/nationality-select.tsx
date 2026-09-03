"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Globe, Search, Check, ChevronDown, X } from "lucide-react";
import { ALL_NATIONALITIES, POPULAR_NATIONALITIES, CountryNationality } from "@/data/nationalities";

interface NationalitySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function NationalitySelect({
  value,
  onChange,
  placeholder = "Select or search nationality...",
  className = "",
  required = false,
}: NationalitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const selectedItem = useMemo(() => {
    if (!value) return null;
    return ALL_NATIONALITIES.find(
      (n) =>
        n.country.toLowerCase() === value.toLowerCase() ||
        n.nationality.toLowerCase() === value.toLowerCase() ||
        `${n.flag} ${n.country}`.toLowerCase() === value.toLowerCase()
    );
  }, [value]);

  const filteredNationalities = useMemo(() => {
    if (!search.trim()) return ALL_NATIONALITIES;
    const query = search.toLowerCase().trim();
    return ALL_NATIONALITIES.filter(
      (n) =>
        n.country.toLowerCase().includes(query) ||
        n.nationality.toLowerCase().includes(query) ||
        n.code.toLowerCase().includes(query)
    );
  }, [search]);

  const handleSelect = (item: CountryNationality) => {
    const formatted = `${item.flag} ${item.country}`;
    onChange(formatted);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Target Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full pl-11 pr-10 py-3 rounded-xl text-sm border text-left flex items-center justify-between transition-colors bg-white ${
          isOpen
            ? "border-brand ring-1 ring-brand"
            : "border-slate-200 hover:border-slate-300"
        }`}
        style={{ color: "#0F172A" }}
      >
        <Globe className="absolute left-4 w-4 h-4 text-slate-400 shrink-0" />

        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap pr-2">
          {selectedItem ? (
            <span className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-base">{selectedItem.flag}</span>
              <span>{selectedItem.country}</span>
              <span className="text-slate-400 text-xs font-normal">
                ({selectedItem.nationality})
              </span>
            </span>
          ) : value ? (
            <span className="font-semibold text-slate-900">{value}</span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-brand" : ""
            }`}
          />
        </div>
      </button>

      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required={required}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[280px] animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country or nationality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-1.5 pr-3 text-xs bg-transparent text-slate-800 placeholder-slate-400 outline-none font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 mr-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* List Options */}
          <div className="overflow-y-auto p-1.5 space-y-1">
            {!search && (
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Popular Destinations & Origins
              </div>
            )}

            {filteredNationalities.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching country found.
              </div>
            ) : (
              filteredNationalities.map((item) => {
                const isSelected =
                  value &&
                  (value.toLowerCase().includes(item.country.toLowerCase()) ||
                    value.toLowerCase().includes(item.nationality.toLowerCase()));
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-slate-100 font-bold text-brand"
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{item.flag}</span>
                      <span className="text-slate-800 font-semibold">{item.country}</span>
                      <span className="text-slate-400 text-[11px]">({item.nationality})</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-brand shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
