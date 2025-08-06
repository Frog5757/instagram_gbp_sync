// src/components/StatsCard.tsx
import React from "react";
import type { Stats } from "../types/insta";

interface StatsCardProps {
  stats: Stats;
}

interface CardProps {
  title: string;
  value: number;
  icon: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="card">
      <div className="card-container">
        <div>
          <p className="card-title">{title}</p>
          <p className="card-value">{value}</p>
        </div>
        <div className="card-icon-container">
          <span className="card-icon">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="stats-container">
      <Card title="総投稿数" value={stats.total} icon="📊" />
      <Card title="同期済み" value={stats.synced} icon="✔️" />
      <Card title="未同期" value={stats.unsynced} icon="❌" />
    </div>
  );
};

export default StatsCard;

