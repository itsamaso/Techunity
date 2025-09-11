import { Link } from "react-router-dom";
import { IChallenge } from "@/types";

type ChallengeCardProps = {
  challenge: IChallenge;
  showStats?: boolean;
};

const ChallengeCard = ({ challenge, showStats = false }: ChallengeCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard':
        return '!bg-red-100 !text-red-800 !border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'arrays':
        return '📊';
      case 'strings':
        return '📝';
      case 'math':
        return '🔢';
      case 'logic':
        return '🧠';
      case 'loops':
        return '🔄';
      case 'functions':
        return '⚙️';
      default:
        return '💻';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-light-4/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={`/coding/challenge/${challenge.id}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {getCategoryIcon(challenge.category)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-light-1 group-hover:text-primary-500 transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-sm text-light-3 capitalize">
                  {challenge.category} • {challenge.points} points
                </p>
              </div>
            </div>
            <div 
              className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getDifficultyColor(challenge.difficulty)}`}
              style={challenge.difficulty === 'Hard' ? { backgroundColor: '#fecaca', color: '#991b1b', borderColor: '#fca5a5' } : {}}
            >
              {challenge.difficulty}
            </div>
          </div>

          {/* Description */}
          <p className="text-light-2 text-sm mb-4 line-clamp-2">
            {challenge.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {challenge.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                +{challenge.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-sm text-light-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  {challenge.testCases.length} test cases
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {challenge.hints.length} hints
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary-500 font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {challenge.points}
              </div>
            </div>
          )}

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </Link>
    </div>
  );
};

export default ChallengeCard;
