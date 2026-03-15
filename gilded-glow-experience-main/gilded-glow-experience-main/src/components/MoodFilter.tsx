import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export type MoodCategory = 'all' | 'happy' | 'sad' | 'romantic' | 'angry' | 'wishlist';

interface MoodFilterProps {
  selectedMood: MoodCategory;
  onMoodChange: (mood: MoodCategory) => void;
  showWishlist?: boolean;
}

const moods: { id: MoodCategory; label: string; icon?: boolean }[] = [
  { id: 'all', label: 'All' },
  { id: 'happy', label: 'Happy' },
  { id: 'sad', label: 'Calm' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'angry', label: 'Bold' },
];

const MoodFilter = forwardRef<HTMLDivElement, MoodFilterProps>(
  ({ selectedMood, onMoodChange, showWishlist = false }, ref) => {
    const displayMoods = showWishlist 
      ? [...moods, { id: 'wishlist' as MoodCategory, label: 'Wishlist', icon: true }]
      : moods;

    return (
      <div ref={ref} className="flex flex-wrap items-center justify-center gap-3 sticky top-20 z-40 py-4 bg-background/95 backdrop-blur-sm">
        {displayMoods.map((mood) => (
          <motion.button
            key={mood.id}
            onClick={() => onMoodChange(mood.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-6 py-2 rounded-full text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
              selectedMood === mood.id
                ? 'text-primary bg-primary/10'
                : 'text-foreground/60 hover:text-primary hover:bg-primary/5'
            }`}
          >
            {mood.icon && <Star size={14} className="fill-current" />}
            {mood.label}
            {selectedMood === mood.id && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full shadow-[0_0_10px_hsl(43_45%_59%_/_0.6)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    );
  }
);

MoodFilter.displayName = 'MoodFilter';

export default MoodFilter;
