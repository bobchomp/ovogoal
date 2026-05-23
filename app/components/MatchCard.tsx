"use client";

import { Match } from "@/types/match";

interface Props {
  match: Match;
  onClick: () => void;
}

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3C/svg%3E";

export default function MatchCard({ match, onClick }: Props) {
  const team1 = match["Team 1 "]?.trim();
  const team2 = match.Team2?.trim();
  const isFullDay =
    match.Time?.toLowerCase() === "full day" ||
    match.Time?.toLowerCase() === "tbd";

  return (
    <button
      onClick={onClick}
      className="w-full group bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50 hover:border-green-500/50 rounded-xl p-4 transition-all duration-200 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Team 1 */}
        <div className="flex flex-col items-center gap-1.5 w-[30%]">
          <img
            src={match.Team1Logo || FALLBACK_IMG}
            alt={team1}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
          <span className="text-white text-xs font-medium text-center leading-tight line-clamp-2">
            {team1}
          </span>
        </div>

        {/* VS / Time */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center justify-center gap-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/15 border border-green-500/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px] font-semibold uppercase tracking-wide">
                Live
              </span>
            </span>
          </div>
          <span className="text-gray-300 font-bold text-sm">VS</span>
          <span className="text-gray-400 text-[11px] text-center">
            {isFullDay ? match.Time : match.Time}
          </span>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center gap-1.5 w-[30%]">
          <img
            src={match.Team2Logo || FALLBACK_IMG}
            alt={team2}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
          <span className="text-white text-xs font-medium text-center leading-tight line-clamp-2">
            {team2}
          </span>
        </div>
      </div>

      {/* Watch button */}
      <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-center gap-2 text-green-400 group-hover:text-green-300 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wide">
          Watch Stream
        </span>
      </div>
    </button>
  );
}
