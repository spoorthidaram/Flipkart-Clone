const products = [
  {
    _id: '665048133142000000000001',
    name: 'iPhone 15 Pro Max (256GB) - Titanium Blue',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    description: 'Experience the power of titanium design, groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
    brand: 'Apple',
    category: 'Mobiles',
    price: 139900,
    countInStock: 10,
    rating: 4.8,
    numReviews: 2,
    reviews: [
      {
        _id: 'r1',
        name: 'Sarah K.',
        rating: 5,
        comment: 'Absolutely amazing performance and the camera is outstanding!',
        createdAt: '2026-05-15T12:00:00.000Z',
      },
      {
        _id: 'r2',
        name: 'Rahul M.',
        rating: 4.6,
        comment: 'Excellent build quality, battery life is much improved.',
        createdAt: '2026-05-20T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000002',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Industry-leading noise cancellation, exceptional sound quality, crystal-clear hands-free calling, and up to 30 hours of battery life with quick charging.',
    brand: 'Sony',
    category: 'Electronics',
    price: 29990,
    countInStock: 15,
    rating: 4.6,
    numReviews: 1,
    reviews: [
      {
        _id: 'r3',
        name: 'Amit P.',
        rating: 4.6,
        comment: 'Best noise cancellation in the market. Super comfortable to wear.',
        createdAt: '2026-05-10T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000003',
    name: 'MacBook Air M3 13-inch (16GB RAM, 512GB SSD) - Space Grey',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'Supercharged by the next-generation M3 chip, this ultra-portable laptop delivers up to 18 hours of battery life, striking Liquid Retina display, and silent fanless operation.',
    brand: 'Apple',
    category: 'Electronics',
    price: 114900,
    countInStock: 7,
    rating: 4.7,
    numReviews: 1,
    reviews: [
      {
        _id: 'r4',
        name: 'David S.',
        rating: 5,
        comment: 'Incredibly fast and light. M3 chip is a huge upgrade.',
        createdAt: '2026-05-12T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000004',
    name: 'Samsung 55-inch Crystal 4K Ultra HD Smart TV',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    description: 'Unveil stunning details in true 4K resolution. Connect seamlessly with Smart Hub, HDR, and Object Tracking Sound Lite for an immersive cinematic experience.',
    brand: 'Samsung',
    category: 'Appliances',
    price: 43990,
    countInStock: 5,
    rating: 4.4,
    numReviews: 1,
    reviews: [
      {
        _id: 'r5',
        name: 'Vikram R.',
        rating: 4,
        comment: 'Great picture quality for the price. OS interface is slightly laggy sometimes.',
        createdAt: '2026-05-14T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000005',
    name: 'Nike Air Max Pulse Sneakers - White/Cobalt',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    description: 'The Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Textile-wrapped midsole and point-loaded cushioning.',
    brand: 'Nike',
    category: 'Fashion',
    price: 12995,
    countInStock: 20,
    rating: 4.5,
    numReviews: 1,
    reviews: [
      {
        _id: 'r6',
        name: 'Neha G.',
        rating: 5,
        comment: 'Very comfortable and style is spot on!',
        createdAt: '2026-05-18T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000006',
    name: 'Rolex Submariner Date Steel Black Ceramic Dial',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80',
    description: 'The oyster perpetual submariner date in oystersteel with a cerachrom bezel insert in black ceramic and a black dial with large luminescent hour markers.',
    brand: 'Rolex',
    category: 'Fashion',
    price: 850000,
    countInStock: 2,
    rating: 4.9,
    numReviews: 1,
    reviews: [
      {
        _id: 'r7',
        name: 'Rohan J.',
        rating: 5,
        comment: 'A timeless masterpiece. Absolute luxury.',
        createdAt: '2026-05-22T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000007',
    name: 'Nespresso Vertuo Next Coffee and Espresso Maker',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'The Vertuo Next coffee maker takes the full range of Nespresso coffee styles even further. Brew delicious coffee or authentic espresso in multiple sizes.',
    brand: 'Nespresso',
    category: 'Home',
    price: 15999,
    countInStock: 12,
    rating: 4.3,
    numReviews: 1,
    reviews: [
      {
        _id: 'r8',
        name: 'Simran K.',
        rating: 4,
        comment: 'Makes great espresso. Pods can be slightly expensive.',
        createdAt: '2026-05-08T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000008',
    name: 'iPad Pro 11-inch M4 (256GB, Wi-Fi) - Silver',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    description: 'Thinpossible. The all-new iPad Pro is supercharged by the outrageously fast Apple M4 chip with an breakthrough tandem OLED Ultra Retina XDR display.',
    brand: 'Apple',
    category: 'Mobiles',
    price: 99900,
    countInStock: 8,
    rating: 4.8,
    numReviews: 1,
    reviews: [
      {
        _id: 'r9',
        name: 'Kabir S.',
        rating: 5,
        comment: 'OLED screen is gorgeous. Performance is next level.',
        createdAt: '2026-05-25T12:00:00.000Z',
      }
    ]
  },
  {
    _id: '665048133142000000000009',
    name: 'Samsung Galaxy S24 Ultra (512GB) - Titanium Black',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
    brand: 'Samsung',
    category: 'Mobiles',
    price: 129999,
    countInStock: 14,
    rating: 4.7,
    numReviews: 0,
    reviews: []
  },
  {
    _id: '665048133142000000000010',
    name: 'Canon EOS R5 C Mirrorless Cinema Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    description: 'For all the filmmakers, creators and hybrid photographers. The EOS R5 C is a true hybrid camera, combining the professional video features of the Cinema EOS range.',
    brand: 'Canon',
    category: 'Electronics',
    price: 359990,
    countInStock: 4,
    rating: 4.9,
    numReviews: 0,
    reviews: []
  },
  {
    _id: '665048133142000000000011',
    name: 'Adidas Ultraboost 1.0 Running Shoes - Core Black',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    description: 'From a walk in the park to a weekend run with friends, these Adidas Ultraboost 1.0 shoes are designed to keep you comfortable. Primeknit upper wraps around the feet.',
    brand: 'Adidas',
    category: 'Fashion',
    price: 17999,
    countInStock: 25,
    rating: 4.6,
    numReviews: 0,
    reviews: []
  },
  {
    _id: '665048133142000000000012',
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    description: 'Dysons most powerful, intelligent cordless vacuum. Laser reveals microscopic dust. Intelligently optimizes suction and run time based on dust level.',
    brand: 'Dyson',
    category: 'Appliances',
    price: 65900,
    countInStock: 6,
    rating: 4.5,
    numReviews: 0,
    reviews: []
  },
  {
    _id: '665048133142000000000013',
    name: 'Ray-Ban Wayfarer Classic Sunglasses - Tortoise/Green',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    description: 'Ray-Ban Original Wayfarer Classics are the most recognizable style in the history of sunglasses. Since its initial design in 1952, Wayfarer Classics gained popularity.',
    brand: 'Ray-Ban',
    category: 'Fashion',
    price: 10990,
    countInStock: 30,
    rating: 4.4,
    numReviews: 0,
    reviews: []
  },
  {
    _id: '665048133142000000000014',
    name: 'Herman Miller Aeron Office Ergonomic Chair - Graphite',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
    description: 'The benchmark for ergonomic office seating. Aeron features a pioneering suspension material, PostureFit SL back support, and fully adjustable tilt mechanisms.',
    brand: 'Herman Miller',
    category: 'Home',
    price: 145000,
    countInStock: 3,
    rating: 4.8,
    numReviews: 0,
    reviews: []
  }
];

export default products;
