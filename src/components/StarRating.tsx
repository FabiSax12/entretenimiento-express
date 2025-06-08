interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'medium',
  showNumber = false
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className={`text-yellow-400 text-shadow-2xs filled ${size}`}>★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className={`text-yellow-400 text-shadow-2xs bg-clip-text bg-linear-to-r from-yellow-400 to-transparent ${size}`}>★</span>);
    } else {
      stars.push(<span key={i} className={`text-yellow-400 text-shadow-2xs empty ${size}`}>☆</span>);
    }
  }

  return (
    <div className="star-rating">
      {stars}
      {showNumber && <span className="rating-number">({rating.toFixed(1)})</span>}
    </div>
  );
};