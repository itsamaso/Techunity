import React, { useState, useEffect, useRef } from 'react';
import { Models } from 'appwrite';
import PostCard from './PostCard';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface PostCarouselProps {
  posts: Models.Document[];
  onSaveChange?: () => void;
  autoSlideInterval?: number;
}

const PostCarousel: React.FC<PostCarouselProps> = ({ 
  posts, 
  onSaveChange,
  autoSlideInterval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Show 1 post at a time
  const postsPerView = 1;
  const totalSlides = Math.ceil(posts.length / postsPerView);

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered && totalSlides > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
        );
      }, autoSlideInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, totalSlides, autoSlideInterval]);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentIndex(prevIndex => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  // Get current slide posts
  const currentSlidePosts = posts.slice(currentIndex * postsPerView, (currentIndex + 1) * postsPerView);

  return (
    <div 
      className="relative w-full max-w-[99vw] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Navigation Arrows - Outside the carousel */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToPrevious();
              }
            }}
            className="absolute left-[-100px] top-1/2 transform -translate-y-1/2 z-40 p-4 rounded-full bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-gray-200 hover:border-primary-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Previous posts"
            type="button"
            tabIndex={0}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
          </button>
          
          <button
            onClick={goToNext}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToNext();
              }
            }}
            className="absolute right-[-100px] top-1/2 transform -translate-y-1/2 z-40 p-4 rounded-full bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-gray-200 hover:border-primary-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Next posts"
            type="button"
            tabIndex={0}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
          </button>
        </>
      )}
      
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 h-[700px] w-full flex flex-col">
        
        {/* Current Slide Posts */}
        <div className="p-8 pb-16 flex-1 flex items-center justify-center">
          <div className="flex justify-center items-center w-full px-16">
            {currentSlidePosts.map((post) => (
              <div key={post.$id} className="w-full h-[580px] flex overflow-hidden">
                <PostCard post={post} onSaveChange={onSaveChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-lg">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary-500 scale-125' 
                    : 'bg-gray-400/60 hover:bg-gray-400/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
      
      {/* Control Panel - Centered on Carousel Corner */}
      {totalSlides > 1 && (
        <div className="absolute -top-6 -right-6 z-[60]">
          <button
            onClick={toggleAutoPlay}
            className="p-3 rounded-full bg-gradient-to-br from-white/98 via-gray-50/95 to-white/98 backdrop-blur-lg hover:from-white hover:via-gray-100 hover:to-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/70 hover:border-primary-500/80 hover:scale-110 ring-2 ring-white/30"
            aria-label={isAutoPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5 text-gray-800 drop-shadow-sm" />
            ) : (
              <Play className="w-5 h-5 text-gray-800 drop-shadow-sm" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCarousel;
