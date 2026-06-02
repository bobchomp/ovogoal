// Copyright (c) 2026 Ross Mackenzie. All rights reserved.
"use client";

import { useEffect } from "react";
import { Match } from "@/types/match";

interface Props {
  match: Match;
  onClose: () => void;
}

export default function StreamModal({ match, onClose }: Props) {
  const team1 = match["Team 1 "]?.trim();
  const team2 = match.Team2?.trim();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3 min-w-0">
          {/* Team logos */}
          <div className="flex items-center gap-2">
            <img
              src={match.Team1Logo}
              alt={team1}
              className="w-8 h-8 object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23374151'/%3E%3C/svg%3E";
              }}
            />
            <span className="text-white font-semibold text-sm truncate max-w-[120px]">
              {team1}
            </span>
          </div>
          <span className="text-green-400 font-bold text-xs px-2 py-0.5 bg-green-400/10 rounded">
            VS
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm truncate max-w-[120px]">
              {team2}
            </span>
            <img
              src={match.Team2Logo}
              alt={team2}
              className="w-8 h-8 object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23374151'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <div className="text-right hidden sm:block">
            <p className="text-gray-400 text-xs">{match.League}</p>
            <p className="text-white text-xs">
              {match.Date} · {match.Time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Stream iframe */}
      <div className="flex-1 relative">
        <iframe
          src={match.iframeURL}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title={`${team1} vs ${team2}`}
        />
      </div>
    </div>
  );
}
