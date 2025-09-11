import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Loader, 
  ChallengeDetail as ChallengeDetailComponent 
} from "@/components/shared";
import { 
  useGetChallengeById, 
  useGetUserChallengeAttempts, 
  useSubmitChallengeAttempt, 
  useGetCurrentUser 
} from "@/lib/react-query/queries";
import { sampleChallenges } from "@/constants/challenges";

const ChallengeDetailPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: currentUser } = useGetCurrentUser();
  const { data: challenge, isLoading: isChallengeLoading } = useGetChallengeById(challengeId || '');
  const { data: userAttempts, isLoading: isAttemptsLoading } = useGetUserChallengeAttempts(
    currentUser?.$id || '', 
    challengeId
  );
  const submitAttemptMutation = useSubmitChallengeAttempt();

  // Use sample data if API data is not available
  const challengeData = challenge || sampleChallenges.find(c => c.id === challengeId);

  const handleSubmitAttempt = async (code: string, language: 'javascript' | 'python' | 'java' | 'cpp') => {
    if (!currentUser || !challengeId) return;

    setIsSubmitting(true);
    try {
      await submitAttemptMutation.mutateAsync({
        userId: currentUser.$id,
        challengeId: challengeId,
        code: code,
        language: language,
      });
    } catch (error) {
      console.error('Failed to submit attempt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChallengeLoading || isAttemptsLoading) {
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <Loader />
        </div>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <div className="flex-center w-full h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-light-1 mb-2">Challenge not found</h3>
              <p className="text-light-3 mb-6">The challenge you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/coding')}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Challenges
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lastAttempt = userAttempts?.documents?.[0];

  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/coding')}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Challenges
          </button>
        </div>

        <ChallengeDetailComponent
          challenge={challengeData}
          userAttempts={userAttempts?.documents || []}
          onSubmitAttempt={handleSubmitAttempt}
          isSubmitting={isSubmitting}
          lastAttempt={lastAttempt}
        />
      </div>
    </div>
  );
};

export default ChallengeDetailPage;
