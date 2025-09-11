import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Loader, 
  ChallengeCard, 
  ProgressStats, 
  AchievementsList 
} from "@/components/shared";
import { 
  useGetChallenges, 
  useGetUserProgress, 
  useGetAchievements, 
  useGetCurrentUser 
} from "@/lib/react-query/queries";
import { sampleChallenges, sampleAchievements } from "@/constants/challenges";

const Coding = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'challenges' | 'progress' | 'achievements'>('challenges');

  const { data: currentUser } = useGetCurrentUser();
  const { data: challenges, isLoading: isChallengesLoading } = useGetChallenges();
  const { data: userProgress, isLoading: isProgressLoading } = useGetUserProgress(currentUser?.$id || '');
  const { data: achievements, isLoading: isAchievementsLoading } = useGetAchievements();

  // Use sample data if API data is not available or empty
  const challengesData = (challenges?.documents && challenges.documents.length > 0) ? challenges.documents : sampleChallenges;
  const achievementsData = (achievements && achievements.length > 0) ? achievements : sampleAchievements;
  

  const filteredChallenges = challengesData.filter(challenge => {
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
    return difficultyMatch && categoryMatch;
  });


  const difficulties = [
    { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-800', icon: '🎯' },
    { value: 'Easy', label: 'Easy', color: 'bg-green-100 text-green-800', icon: '🟢' },
    { value: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
    { value: 'Hard', label: 'Hard', color: '!bg-red-100 !text-red-800 !border-red-300', icon: '🔴' },
  ];

  const categories = [
    { value: 'all', label: 'All Topics', icon: '📚' },
    { value: 'arrays', label: 'Arrays', icon: '📊' },
    { value: 'strings', label: 'Strings', icon: '📝' },
    { value: 'math', label: 'Math', icon: '🔢' },
    { value: 'logic', label: 'Logic', icon: '🧠' },
    { value: 'loops', label: 'Loops', icon: '🔄' },
    { value: 'functions', label: 'Functions', icon: '⚙️' },
  ];

  if (isChallengesLoading || isProgressLoading || isAchievementsLoading) {
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 p-6 rounded-3xl bg-gradient-to-br from-blue-100/85 via-indigo-100/80 to-purple-100/85 border-2 border-primary-500/30 shadow-2xl backdrop-blur-md">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/25 to-secondary-500/25 shadow-md">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">Coding Challenges</h2>
            <p className="text-base text-gray-800 font-bold mt-2">Practice coding with beginner-friendly challenges</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'challenges', label: 'Challenges', icon: '💻' },
            { id: 'progress', label: 'Progress', icon: '📊' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>


        {/* Content based on active tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-light-4/30 shadow-lg p-6 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-light-1 mb-2">🎯 Filter Challenges</h3>
                <p className="text-sm text-light-3">Choose your difficulty and topic to find the perfect challenge</p>
              </div>
              
              <div className="space-y-6">
                {/* Difficulty Filter */}
                <div className="text-center">
                  <label className="block text-sm font-semibold text-light-1 mb-3">💪 Difficulty Level</label>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty.value}
                        onClick={() => setSelectedDifficulty(difficulty.value as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                          selectedDifficulty === difficulty.value
                            ? difficulty.color + ' shadow-md scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                        }`}
                        style={selectedDifficulty === difficulty.value && difficulty.value === 'Hard' ? { backgroundColor: '#fecaca', color: '#991b1b', borderColor: '#fca5a5' } : {}}
                      >
                        <span className="text-lg">{difficulty.icon}</span>
                        <span>{difficulty.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="text-center">
                  <label className="block text-sm font-semibold text-light-1 mb-3">📚 Topic Category</label>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                          selectedCategory === category.value
                            ? 'bg-primary-100 text-primary-600 border-primary-300 shadow-md scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                        }`}
                      >
                        <span className="text-base">{category.icon}</span>
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  showStats={true}
                />
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-light-1 mb-2">No challenges found</h3>
                <p className="text-light-3">Try adjusting your filters to see more challenges.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && userProgress && (
          <ProgressStats progress={userProgress} />
        )}

        {activeTab === 'achievements' && userProgress && (
          <AchievementsList achievements={achievementsData} userProgress={userProgress} />
        )}
      </div>
    </div>
  );
};

export default Coding; 