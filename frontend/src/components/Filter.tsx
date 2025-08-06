// src/components/Filter.tsx
import React from "react";
import type { FilterProps } from "../types/insta";

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  active,
  onClick,
  count,
}) => {
  return (
    <button
      onClick={onClick}
      className={`filter-button ${active ? "active" : ""}`}
    >
      {label} ({count})
    </button>
  );
};

const Filter: React.FC<FilterProps> = ({ filter, setFilter, stats }) => {
  return (
    <div className="filter-container">
      <div className="filter-buttons">
        <FilterButton
          label="すべて"
          active={filter === "all"}
          onClick={() => setFilter("all")}
          count={stats.total}
        />
        <FilterButton
          label="同期済み"
          active={filter === "synced"}
          onClick={() => setFilter("synced")}
          count={stats.synced}
        />
        <FilterButton
          label="未同期"
          active={filter === "unsynced"}
          onClick={() => setFilter("unsynced")}
          count={stats.unsynced}
        />
      </div>
    </div>
  );
};

export default Filter;

