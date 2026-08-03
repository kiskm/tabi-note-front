"use client";

import { useEffect, useRef, useState } from "react";
import { AREA_REGIONS, OVERSEAS_AREA } from "@/app/constants/area";
import { tripFormConfig } from "@/app/constants/form";

const AreaSelect = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (areas: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleArea = (area: string) => {
    if (value.includes(area)) {
      onChange(value.filter((a) => a !== area));
    } else {
      onChange([...value, area]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setOpen((o) => !o)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm flex flex-wrap items-center gap-1 cursor-pointer min-h-[38px]"
      >
        {value.length === 0 ? (
          <span className="text-gray-400">
            {tripFormConfig.areaPlaceholder}
          </span>
        ) : (
          value.map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
            >
              {area}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleArea(area);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </span>
          ))
        )}
        <span className="ml-auto text-gray-400 text-xs">
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-72 overflow-y-auto">
          {AREA_REGIONS.map(({ region, prefectures }) => (
            <div
              key={region}
              className="border-b border-gray-100 last:border-b-0"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenRegion(openRegion === region ? null : region)
                }
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>{region}</span>
                <span className="text-gray-400 text-xs">
                  {openRegion === region ? "▾" : "▸"}
                </span>
              </button>
              {openRegion === region && (
                <div className="px-3 py-2 flex flex-wrap gap-x-3 gap-y-1">
                  {prefectures.map((pref) => (
                    <label
                      key={pref}
                      className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={value.includes(pref)}
                        onChange={() => toggleArea(pref)}
                      />
                      {pref}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(OVERSEAS_AREA)}
              onChange={() => toggleArea(OVERSEAS_AREA)}
            />
            {OVERSEAS_AREA}
          </label>
        </div>
      )}
    </div>
  );
};

export default AreaSelect;
