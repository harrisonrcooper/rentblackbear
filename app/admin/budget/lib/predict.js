// Smart category prediction. Given an expense description and the
// user's category list, return the best-guess category (or null).
//
// Strategy:
//   1) Run the description against a curated list of regex predictors
//      that ship with the app — each maps to a list of "hints" (the
//      kinds of category labels we'd expect to find on a budget).
//   2) For the first matching predictor, find the first hint that
//      matches a real category in the user's data.
//   3) Fallback: direct substring match against category labels.
//
// All matching is case-insensitive; word-boundaries keep "gas" from
// matching "gasoline-station-on-mars" while still hitting "gas bill"
// and "Shell gas." Hints are ordered by specificity so "Gas" wins over
// "Transport" when both exist.

const PREDICTORS = [
  // Food
  { match: /\b(grocer(y|ies)?|safeway|kroger|publix|trader|whole foods|aldi|costco|sam'?s|h-?e-?b|wegmans|sprouts)\b/i, hints: ["grocer", "food"] },
  { match: /\b(restaurant|chipotle|mcdonald|mcd|burger|pizza|sushi|wendy|chick|taco|panera|olive garden|cheesecake|outback|texas roadhouse)\b/i, hints: ["restaur", "dining"] },
  { match: /\b(bar|brewery|happy hour|cocktail)\b/i, hints: ["restaur", "personal"] },
  { match: /\b(cafe|coffee|starbucks|dutch bros|dunkin)\b/i, hints: ["coffee", "restaur"] },

  // Transport
  { match: /\b(gas|shell|chevron|exxon|bp|76|mobil|sunoco|valero|wawa)\b/i, hints: ["gas"] },
  { match: /\b(uber|lyft|taxi|cab)\b/i, hints: ["uber", "lyft", "transport", "gas"] },
  { match: /\b(parking|toll|metro|transit|bus|train)\b/i, hints: ["transport", "tag", "park"] },
  { match: /\b(oil change|brake|tire|mechanic|jiffy|firestone)\b/i, hints: ["oil", "maintenance"] },
  { match: /\b(car wash|carwash|detail)\b/i, hints: ["car"] },
  { match: /\b(geico|progressive|allstate|state farm|car insurance|auto insurance)\b/i, hints: ["car ins", "truck ins", "insurance"] },

  // Personal / lifestyle
  { match: /\b(amazon|amzn|amzn\.com)\b/i, hints: ["amazon"] },
  { match: /\b(walmart|wal-mart|wmt)\b/i, hints: ["walmart"] },
  { match: /\b(target)\b/i, hints: ["walmart", "amazon", "misc"] },
  { match: /\b(spotify|netflix|disney|hulu|max|paramount|apple music|apple tv|prime video|peacock)\b/i, hints: ["youtube", "stream", "subscription"] },
  { match: /\b(gym|fitness|peloton|crossfit|orange theory|planet fitness|equinox)\b/i, hints: ["gym"] },
  { match: /\b(salon|spa|hair|nails|barber|massage)\b/i, hints: ["pamper", "personal"] },
  { match: /\b(medicine|doctor|hospital|cvs|walgreens|pharmacy|copay|prescription)\b/i, hints: ["medicine", "drs"] },

  // Giving
  { match: /\b(tithe|church|donation|charity|offering)\b/i, hints: ["tithe", "giving"] },

  // Housing
  { match: /\b(mortgage|rent|hoa)\b/i, hints: ["mortgage", "rent"] },
  { match: /\b(electric|comed|pge|electricity|power bill)\b/i, hints: ["utilit", "electric"] },
  { match: /\b(water|water bill|sewer)\b/i, hints: ["utilit", "water"] },
  { match: /\b(internet|wifi|comcast|xfinity|spectrum|att u-?verse|verizon|fios)\b/i, hints: ["internet"] },
  { match: /\b(cell|phone|cellular|t-?mobile|verizon|sprint|cricket|mint mobile|att)\b/i, hints: ["cell", "phone"] },
  { match: /\b(home depot|lowes|menards|ace hardware|hardware)\b/i, hints: ["house maint", "maintenance"] },

  // Kids
  { match: /\b(daycare|preschool|babysitter|nanny|school|tuition)\b/i, hints: ["kid", "ollie", "school"] },
  { match: /\b(toy|toys r us|target kids)\b/i, hints: ["kid", "ollie"] },

  // Pets
  { match: /\b(vet|pet|petco|petsmart|chewy)\b/i, hints: ["pet"] },

  // Travel
  { match: /\b(airline|delta|united|southwest|jetblue|spirit|hotel|airbnb|booking|expedia)\b/i, hints: ["vacation", "travel"] },
];

// `categories` accepts EITHER an array of category objects ({ label })
// OR an array of bare label strings. The return type mirrors the
// input: objects in → object out, strings in → string out. Callers
// that always want a string can do `.label || result` on the result.
export function predictCategory(label, categories) {
  if (!label || !categories || categories.length === 0) return null;
  const l = label.toLowerCase().trim();
  if (!l) return null;

  // Normalize each category to a { src, label } pair so the matchers
  // work uniformly. `src` is what we return — preserves the input
  // shape.
  const norm = categories
    .map((c) => {
      if (typeof c === "string") return { src: c, label: c.toLowerCase() };
      return { src: c, label: ((c?.label) || "").toLowerCase() };
    })
    .filter((n) => n.label);

  // 1) Curated predictor pass — first matching regex wins.
  for (const p of PREDICTORS) {
    if (p.match.test(l)) {
      for (const hint of p.hints) {
        const cat = norm.find((n) => n.label.includes(hint));
        if (cat) return cat.src;
      }
    }
  }

  // 2) Direct substring match against category labels (cheap heuristic).
  const firstToken = l.split(/\s+/)[0];
  const direct = norm.find((n) => l.includes(n.label) || n.label.includes(firstToken));
  return direct?.src || null;
}

// Helpful debug/inspect — returns the predictor row that matched.
export function debugPredict(label) {
  if (!label) return null;
  const l = label.toLowerCase().trim();
  for (const p of PREDICTORS) {
    if (p.match.test(l)) return p;
  }
  return null;
}
