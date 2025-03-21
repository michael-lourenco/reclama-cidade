interface MatchHistoryEntry {
  id: number;
  date: Date;
  score: number;
  errors: number;
  duration: string;
}

interface BestScoreData {
  value: number;
  updatedAt: Date;
}

interface CurrencyData {
  value: number;
  updatedAt: Date;
}

interface BestScore {
  value: number;
  updatedAt: Date;
}

export interface Credit {
  value: number;
  updatedAt: Date;
}

interface Currency {
  value: number;
  updatedAt: Date;
}
interface FirestoreUser {
  id: string;
  displayName: string;
  email: string;
  best_score?: BestScore;
  currency?: Currency;
}
interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: Date;
}

export interface StoryEntry {
  id: number;
  date: Date;
  prompt: string;
  title: string;
  story: string;
}

interface LeaderboardPayload {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: LeaderboardEntry[];
  date: string;
  type: string;
}
interface TotalGamesData {
  value: number;
  updatedAt: Date;
}

interface Votes {
  [key: string]: string;
}

export interface UserMarker {
  id: string;
  lat: number;
  lng: number;
  type: string;
  createdAt: Date;
}

export interface UserData {
  displayName: string;
  credits: Credit;
  currency: CurrencyData;
  email: string;
  photoURL: string;
  userMarkers?: UserMarker[];
}