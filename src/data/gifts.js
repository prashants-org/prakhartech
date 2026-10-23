// Corporate gift catalogue (shared by /gifts and /corporate-gifting).
// Images are currently hotlinked from the supplier site; see README.
/*
  large: true  → tile spans 2 rows. Two large tiles anchor the mosaic:
  index 0 (left anchor) and index 7 (right anchor).

  Layout with auto-placement (3-col grid, span-2 on index 0 and 7):
  [ 0 LARGE ] [ 1 ] [ 2 ]
  [ 0 LARGE ] [ 3 ] [ 4 ]
  [ 5 ] [ 6 ] [ 7 LARGE ]
  [ 8 ] [ 9 ] [ 7 LARGE ]
*/
export const GIFT_PRODUCTS = [
  {
    name: 'Titan Watch',
    category: 'Accessories',
    tagline: 'Time, elegantly marked',
    desc: 'Iconic Titan timepieces that carry decades of trust. A watch gifted is a memory worn every single day.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.36.45-AM.png',
    large: true,
  },
  {
    name: 'Gold Coins',
    category: 'Tanishq',
    tagline: 'Certified purity, lasting value',
    desc: 'Certified gold coins from Tanishq — an auspicious and valuable gift for weddings, anniversaries, and corporate milestones.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.38.16-AM.png',
  },
  {
    name: 'Skinn Festive',
    category: 'Fragrances',
    tagline: "A scent they won't forget",
    desc: 'Curated festive fragrance sets by Skinn — luxurious perfumes that leave a lasting impression long after the occasion.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.36.59-AM.png',
  },
  {
    name: 'Silver Articles',
    category: 'Tanishq',
    tagline: 'Crafted for every occasion',
    desc: 'Exquisite silver artefacts that carry cultural significance and aesthetic beauty — perfect for pooja gifts and festive hampers.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.38.02-AM.png',
  },
  {
    name: 'Diya',
    category: 'Festive Decor',
    tagline: 'Light up their space',
    desc: 'Beautifully handcrafted diyas for festivals, weddings, and home decoration — a timeless gifting choice for every occasion.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.37.49-AM.png',
  },
  {
    name: 'Carvaan',
    category: 'Electronics',
    tagline: 'Classic music, reimagined',
    desc: 'A premium digital music player pre-loaded with thousands of classic Hindi songs — the most nostalgic gift you can give.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.39.02-AM.png',
  },
  {
    name: 'Silver Coins',
    category: 'Tanishq',
    tagline: 'Pure silver, pure intent',
    desc: 'Pure silver coins from Tanishq — auspicious and cherished gifts for Diwali, housewarmings, and corporate events.',
    img: 'https://amananindia.com/wp-content/uploads/2022/11/Screenshot-2024-09-23-at-11.25.06-AM.png',
  },
  {
    name: 'VIP Bags',
    category: 'Bags',
    tagline: 'Carry it with confidence',
    desc: 'Premium VIP travel and lifestyle bags — a sophisticated choice for business travellers and high-value client gifts.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-11.30.48-AM.png',
    large: true,
  },
  {
    name: 'Pigeon',
    category: 'Kitchen',
    tagline: 'Practical, premium, purposeful',
    desc: 'Quality kitchen appliances from Pigeon — thoughtful gifts for new homes, housewarmings, and festive occasions.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-11.39.25-AM.png',
  },
  {
    name: 'IRTH Bags',
    category: 'Bags',
    tagline: 'Style that travels with them',
    desc: 'Stylish and functional bags from IRTH — designed for daily use and built for corporate gifting at any scale.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.37.21-AM.png',
  },
]
