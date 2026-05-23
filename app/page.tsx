"use client";

import { useEffect, useState, useMemo } from "react";
import { Match } from "@/types/match";
import MatchCard from "./components/MatchCard";
import StreamModal from "./components/StreamModal";

const FALLBACK_LOGO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%234B5563'/%3E%3C/svg%3E";

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/matches");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr: Match[] = Array.isArray(data) ? data : Object.values(data);
      setMatches(arr);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 60_000);
    return () => clearInterval(interval);
  }, []);

  const allDates = useMemo(() => {
    const seen = new Set<string>();
    matches.forEach((m) => seen.add(m.Date?.trim()));
    return Array.from(seen).sort();
  }, [matches]);

  const filtered = useMemo(() => {
    if (selectedDate === "all") return matches;
    return matches.filter((m) => m.Date?.trim() === selectedDate);
  }, [matches, selectedDate]);

  const byLeague = useMemo(() => {
    const map = new Map<string, Match[]>();
    filtered.forEach((m) => {
      const key = m.League?.trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    });
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">
                OvoGoal
              </h1>
              <p className="text-[10px] text-green-400 font-medium tracking-widest">
                LIVE STREAMS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-gray-500 text-xs hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => {
                setLoading(true);
                fetchMatches();
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Refresh"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Date filters */}
        {allDates.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              <button
                onClick={() => setSelectedDate("all")}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedDate === "all"
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                All Dates
              </button>
              {allDates.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedDate === d
                      ? "bg-green-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            <p className="text-gray-400">Loading streams...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-red-400 font-medium">Failed to load matches</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                fetchMatches();
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && byLeague.size === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-gray-400">No matches available</p>
          </div>
        )}

        {!loading && !error && byLeague.size > 0 && (
          <div className="space-y-8">
            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {filtered.length}
                </p>
                <p className="text-gray-400 text-xs mt-1">Total Streams</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {byLeague.size}
                </p>
                <p className="text-gray-400 text-xs mt-1">Leagues / Sports</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {allDates.length}
                </p>
                <p className="text-gray-400 text-xs mt-1">Days</p>
              </div>
            </div>

            {/* League sections */}
            {Array.from(byLeague.entries()).map(([league, leagueMatches]) => (
              <section key={league}>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={leagueMatches[0]?.Leaguelogo || FALLBACK_LOGO}
                    alt={league}
                    className="w-7 h-7 object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_LOGO;
                    }}
                  />
                  <h2 className="text-base font-bold text-white">{league}</h2>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                    {leagueMatches.length}{" "}
                    {leagueMatches.length === 1 ? "match" : "matches"}
                  </span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {leagueMatches.map((match) => (
                    <div key={`${match["Match ID"]}-${match.iframeURL}-${match["Team 1 "]}`}>
                      {selectedDate === "all" && (
                        <p className="text-[10px] text-gray-500 mb-1 ml-1">
                          {match.Date?.trim()}
                        </p>
                      )}
                      <MatchCard
                        match={match}
                        onClick={() => setActiveMatch(match)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-12 py-6 text-center">
        <p className="text-gray-600 text-xs">
          Streams refresh every 60 seconds · Click any match to watch live
        </p>
      </footer>

      {activeMatch && (
        <StreamModal
          match={activeMatch}
          onClose={() => setActiveMatch(null)}
        />
      )}
    </div>
  );
}
