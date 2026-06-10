export interface Badge {
  title: string;
  image: string;
  earnedDate: string;
  type?: "skill" | "trivia" | "game" | "course";
  points?: number;
}

export interface ProfileData {
  profileId: string;
  userName: string;
  avatarUrl: string;
  badgesCount: number;
  badges: Badge[];
}

export interface CalculationBreakdown {
  triviaPoints: number;
  gamePoints: number;
  skillMilestonePoints: number;
  totalPoints: number;
}
