import { IAchievement, IUserProgress } from "@/types";

type AchievementsListProps = {
  achievements: IAchievement[];
  userProgress: IUserProgress;
};

const AchievementsList = ({ achievements, userProgress }: AchievementsListProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '🥉';
      case 'rare':
        return '🥈';
      case 'epic':
        return '🥇';
      case 'legendary':
        return '💎';
      default:
        return '🏆';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone':
        return '🎯';
      case 'streak':
        return '🔥';
      case 'category':
        return '📚';
      case 'special':
        return '⭐';
      default:
        return '🏆';
    }
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return userProgress.achievements.includes(achievementId);
  };

  const getProgressPercentage = (achievement: IAchievement) => {
    switch (achievement.requirement.type) {
      case 'challenges_solved':
        return Math.min((userProgress.totalChallengesSolved / achievement.requirement.value) * 100, 100);
      case 'points_earned':
        return Math.min((userProgress.totalPoints / achievement.requirement.value) * 100, 100);
      case 'streak_days':
        return Math.min((userProgress.currentStreak / achievement.requirement.value) * 100, 100);
      case 'category_mastery':
        if (achievement.requirement.category) {
          const challengesByCategory = typeof userProgress.challengesByCategory === 'string' 
            ? JSON.parse(userProgress.challengesByCategory) 
            : userProgress.challengesByCategory;
          const categoryCount = challengesByCategory[achievement.requirement.category] || 0;
          return Math.min((categoryCount / achievement.requirement.value) * 100, 100);
        }
        return 0;
      default:
        return 0;
    }
  };

  const unlockedAchievements = achievements.filter(achievement => isAchievementUnlocked(achievement.id));
  const lockedAchievements = achievements.filter(achievement => !isAchievementUnlocked(achievement.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-light-1 mb-2">Achievements</h2>
        <p className="text-light-3">
          {unlockedAchievements.length} of {achievements.length} unlocked
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-light-1 mb-4 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Unlocked ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">
                    {getRarityIcon(achievement.rarity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-green-800">{achievement.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <span>{getCategoryIcon(achievement.category)}</span>
                      <span className="capitalize">{achievement.category}</span>
                      <span>•</span>
                      <span>{achievement.points} points</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-light-1 mb-4 flex items-center gap-2">
            <span className="text-gray-400">🔒</span>
            Locked ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => {
              const progress = getProgressPercentage(achievement);
              return (
                <div
                  key={achievement.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl grayscale">
                      {getRarityIcon(achievement.rarity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-600">{achievement.name}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{getCategoryIcon(achievement.category)}</span>
                        <span className="capitalize">{achievement.category}</span>
                        <span>•</span>
                        <span>{achievement.points} points</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievement Stats */}
      <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
        <h3 className="text-lg font-semibold text-light-1 mb-4">Achievement Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-500">{unlockedAchievements.length}</div>
            <div className="text-sm text-light-3">Total Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {achievements.filter(a => a.rarity === 'legendary' && isAchievementUnlocked(a.id)).length}
            </div>
            <div className="text-sm text-light-3">Legendary</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {achievements.filter(a => a.rarity === 'epic' && isAchievementUnlocked(a.id)).length}
            </div>
            <div className="text-sm text-light-3">Epic</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {achievements.filter(a => a.rarity === 'rare' && isAchievementUnlocked(a.id)).length}
            </div>
            <div className="text-sm text-light-3">Rare</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsList;
