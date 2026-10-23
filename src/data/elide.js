// Fire classes the Elide Fire Ball is rated for (shared by the Elide pages).
// Source: the manufacturer's product sheet (public/elidefireball/assets/img/bt2.webp),
// which lists classes A, B, C, E and F. It is NOT rated for class D (metal fires).
export const FIRE_CLASSES = [
  { cls: 'A', label: 'Solids', desc: 'Wood, paper, textiles, plastic, rubber' },
  { cls: 'B', label: 'Flammable liquids', desc: 'Fuels, paints, solvents' },
  { cls: 'C', label: 'Combustible gases', desc: 'Gas leaks and gas fires' },
  { cls: 'E', label: 'Electrical', desc: 'Energised electrical equipment' },
  { cls: 'F', label: 'Cooking oils', desc: 'Cooking oils and fats' },
]

// YouTube demo video. The previous video (0LE5cKdM96M) was removed from YouTube;
// set a new ID here and both Elide pages show it. null → product infographic.
export const ELIDE_VIDEO_ID = null
