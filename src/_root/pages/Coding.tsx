import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Loader, 
  ChallengeCard, 
  ProgressStats, 
  AchievementsList,
  ChallengeFilters,
  PageHeader
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
        <PageHeader
          title="Coding Challenges"
          subtitle="Sharpen your skills with interactive coding challenges"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          }
        />

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
              <span className="text-base">{tab.label}</span>
            </button>
          ))}
        </div>


        {/* Content based on active tab */}
        {activeTab === 'challenges' && (
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row w-full">
              {/* Filters Section - Left Side */}
              <div className="lg:w-80 flex-shrink-0 lg:pr-6 relative z-10">
                <ChallengeFilters
                  selectedDifficulty={selectedDifficulty}
                  selectedCategory={selectedCategory}
                  onDifficultyChange={(value) => setSelectedDifficulty(value as any)}
                  onCategoryChange={setSelectedCategory}
                  className="sticky top-4"
                />
              </div>

              {/* Vertical Separator */}
              <div className="hidden lg:flex flex-col items-center justify-start py-4 px-2">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full my-2"></div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full my-1"></div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
              </div>

              {/* Challenges Section - Right Side */}
              <div className="flex-1 min-w-0 lg:pl-6 relative z-10">
                <div className="bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-xl p-6 overflow-visible">
                  {/* Challenges Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200/50 shadow-sm">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <span className="font-bold text-lg text-gray-800 tracking-wide">Available Challenges</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} found
                    </p>
                  </div>

                  {/* Challenges Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredChallenges.map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        showStats={true}
                      />
                    ))}
                  </div>

                  {/* Empty State */}
                  {filteredChallenges.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">No challenges found</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try adjusting your filters to discover more coding challenges that match your interests.
                      </p>
                      <div className="flex justify-center gap-2">
                        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                      </div>
                    </div>
                  )}


                  {/* Footer Decoration */}
                  <div className="mt-6 flex justify-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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