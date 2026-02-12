import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number | null;
    onRate: (rating: number) => void;
    interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, interactive = true }) => {
    const [hover, setHover] = useState<number | null>(null);

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    className={`${interactive ? 'cursor-pointer' : 'cursor-default'
                        } transition-all duration-200 focus:outline-none`}
                    onClick={() => interactive && onRate(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(null)}
                >
                    <Star
                        className={`w-4 h-4 ${star <= (hover || rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-200 fill-transparent'
                            } transition-colors`}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    );
};
