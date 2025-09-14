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
    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={`/coding/challenge/${challenge.id}`}>
        <div className="p-6">
          {/* Header with Icon and Title */}
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl flex-shrink-0">
              {getCategoryIcon(challenge.category)}
            </div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
              {challenge.title}
            </h3>
          </div>

          {/* Difficulty and Points */}
          <div className="flex items-center justify-between">
            <div 
              className={`px-3 py-2 rounded-xl text-sm font-semibold border ${getDifficultyColor(challenge.difficulty)}`}
              style={challenge.difficulty === 'Hard' ? { backgroundColor: '#fecaca', color: '#991b1b', borderColor: '#fca5a5' } : {}}
            >
              {challenge.difficulty}
            </div>
            <div className="flex items-center gap-2 text-primary-600 font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{challenge.points}</span>
            </div>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </Link>
    </div>
  );
};

export default ChallengeCard;
