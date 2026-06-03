import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = 'text-yellow-400' }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<Star key={i} className={`w-4 h-4 fill-current ${color}`} />);
    } else if (value >= i - 0.5) {
      stars.push(<StarHalf key={i} className={`w-4 h-4 fill-current ${color}`} />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300 dark:text-zinc-600" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">{stars}</div>
      {text && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{text}</span>}
    </div>
  );
};

export default Rating;
