export const HATS = [
  {
    id: 'straw_hat',
    name: 'Farmer Straw',
    cost: 50,
    desc: '+1 milk per manual tap',
    effect: { type: 'click_bonus', value: 1 },
    // SVG snippet rendered right on top of the cow's head
    svg: `
      <g id="hat-straw">
        <ellipse cx="50" cy="30" rx="30" ry="6" fill="#e9c46a" stroke="#333" stroke-width="2"/>
        <path d="M35 30 Q50 15 65 30" fill="#f4a261" stroke="#333" stroke-width="2"/>
        <rect x="36" y="27" width="28" height="4" fill="#e76f51"/>
      </g>
    `
  },
  {
    id: 'propeller_beanie',
    name: 'Propeller Beanie',
    cost: 250,
    desc: '+20% to passive milk production',
    effect: { type: 'mps_multiplier', value: 0.20 },
    svg: `
      <g id="hat-propeller">
        <path d="M36 32 C36 20 64 20 64 32 Z" fill="#2a9d8f" stroke="#333" stroke-width="2"/>
        <line x1="50" y1="20" x2="50" y2="14" stroke="#333" stroke-width="2"/>
        <ellipse cx="50" cy="14" rx="14" ry="3" fill="#e76f51" stroke="#333" stroke-width="1.5"/>
        <circle cx="50" cy="14" r="2" fill="#ffd166"/>
      </g>
    `
  },
  {
    id: 'viking_helmet',
    name: 'Viking Horns',
    cost: 1000,
    desc: '+5 click power & +50% passive milk',
    effect: { type: 'hybrid', clickVal: 5, mpsMultiplier: 0.50 },
    svg: `
      <g id="hat-viking">
        <path d="M34 32 C34 22 66 22 66 32 Z" fill="#6c757d" stroke="#333" stroke-width="2"/>
        <path d="M34 30 Q22 25 24 15 Q30 20 35 25" fill="#f8f9fa" stroke="#333" stroke-width="2"/>
        <path d="M66 30 Q78 25 76 15 Q70 20 65 25" fill="#f8f9fa" stroke="#333" stroke-width="2"/>
      </g>
    `
  }
];