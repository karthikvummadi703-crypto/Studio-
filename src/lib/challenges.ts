
export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'walk-7-days',
    title: 'Walk for 7 Days',
    description: 'Walk for 7 consecutive days to build a sustainable habit.',
    reward: 100,
    icon: 'Footprints'
  },
  {
    id: 'public-transport-5',
    title: 'Public Transport Pro',
    description: 'Use public transport 5 times this week instead of driving.',
    reward: 150,
    icon: 'Bus'
  },
  {
    id: 'reduce-electricity-7',
    title: 'Energy Saver',
    description: 'Reduce non-essential electricity usage for 7 days.',
    reward: 200,
    icon: 'Zap'
  }
];
