/**
 * @fileOverview Centralised TypeScript interfaces for EcoPulse AI.
 */

export interface UserProfile {
  fullName: string;
  email: string;
  greenPoints: number;
  sustainabilityScore: number;
  level: 'Seedling' | 'Eco Warrior' | 'Climate Champion' | 'Planet Guardian';
  createdAt: any; // Firestore Timestamp
  completedChallenges: string[];
  id?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: any;
  updatedAt: any;
}

export interface CarbonRecord {
  id?: string;
  userId: string;
  mode: string;
  start: string;
  destination: string;
  distance: number;
  co2: number;
  pointsEarned: number;
  timestamp: any;
}

export interface Activity {
  id?: string;
  userId: string;
  type: 'milestone' | 'initialization' | 'challenge_complete' | 'carbon_log';
  description: string;
  pointsEarned: number;
  timestamp: any;
}

export interface EmissionsBreakdown {
  transportation: number;
  homeEnergy: number;
  food: number;
  lifestyle: number;
}
