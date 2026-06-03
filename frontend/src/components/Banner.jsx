import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80',
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 50% Off on Laptops, Headphones & More',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80',
    title: 'Fashion Upgrade Week',
    subtitle: 'Latest Summer Collection | Extra 10% Off for Plus Members',
  },
  {
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80',
    title: 'Ultimate Gaming Setup',
    subtitle: 'Consoles, Monitors & Gaming Accessories | Shop Now',
  }
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[220px] md:h-[350px] overflow-hidden rounded-2xl shadow-lg group">
      {/* Banner Slides */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-12 text-white">
              <span className="text-xs md:text-sm font-bold tracking-widest text-flipkart-yellow uppercase mb-2">
                Special Offer
              </span>
              <h2 className="text-xl md:text-4xl font-extrabold mb-1 md:mb-2 max-w-2xl drop-shadow-md">
                {banner.title}
              </h2>
              <p className="text-xs md:text-base text-gray-200 font-medium max-w-lg drop-shadow-md">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/25 hover:bg-white/40 border border-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/25 hover:bg-white/40 border border-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              current === i ? 'bg-flipkart-yellow w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
