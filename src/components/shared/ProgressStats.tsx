import { IUserProgress } from "@/types";

type ProgressStatsProps = {
  progress: IUserProgress;
  showAchievements?: boolean;
};

const ProgressStats = ({ progress, showAchievements = true }: ProgressStatsProps) => {
  const getLevelProgress = () => {
    const currentLevelExp = progress.experience % 100;
    const nextLevelExp = 100;
    const progressPercentage = (currentLevelExp / nextLevelExp) * 100;
    
    return {
      current: currentLevelExp,
      next: nextLevelExp,
      percentage: progressPercentage,
    };
  };

  // Parse JSON strings back to objects
  const challengesByDifficulty = typeof progress.challengesByDifficulty === 'string' 
    ? JSON.parse(progress.challengesByDifficulty) 
    : progress.challengesByDifficulty;
  
  const challengesByCategory = typeof progress.challengesByCategory === 'string' 
    ? JSON.parse(progress.challengesByCategory) 
    : progress.challengesByCategory;

  const levelProgress = getLevelProgress();

  return (
    <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-light-1">Your Progress</h3>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {progress.level}
          </div>
          <span className="text-sm text-light-3">Level {progress.level}</span>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-light-3 mb-2">
          <span>Experience</span>
          <span>{levelProgress.current}/{levelProgress.next} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${levelProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{progress.totalChallengesSolved}</div>
          <div className="text-sm text-blue-700">Challenges Solved</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="text-2xl font-bold text-green-600">{progress.totalPoints}</div>
          <div className="text-sm text-green-700">Total Points</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">{progress.currentStreak}</div>
          <div className="text-sm text-orange-700">Current Streak</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{progress.longestStreak}</div>
          <div className="text-sm text-purple-700">Best Streak</div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-light-1 mb-3">By Difficulty</h4>
        <div className="space-y-2">
          {Object.entries(challengesByDifficulty).map(([difficulty, count]) => (
            <div key={difficulty} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  difficulty === 'Easy' ? 'bg-green-500' :
                  difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-light-2 capitalize">{difficulty}</span>
              </div>
              <span className="text-sm font-semibold text-light-1">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-light-1 mb-3">By Category</h4>
        <div className="space-y-2">
          {Object.entries(challengesByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {category === 'arrays' ? '📊' :
                   category === 'strings' ? '📝' :
                   category === 'math' ? '🔢' :
                   category === 'logic' ? '🧠' :
                   category === 'loops' ? '🔄' :
                   category === 'functions' ? '⚙️' : '💻'}
                </span>
                <span className="text-sm text-light-2 capitalize">{category}</span>
              </div>
              <span className="text-sm font-semibold text-light-1">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {showAchievements && (
        <div>
          <h4 className="text-sm font-semibold text-light-1 mb-3">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {progress.achievements.length > 0 ? (
              progress.achievements.map((achievementId, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  title={`Achievement ${index + 1}`}
                >
                  🏆
                </div>
              ))
            ) : (
              <p className="text-sm text-light-3">No achievements yet. Keep coding!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressStats;
