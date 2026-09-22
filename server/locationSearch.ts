import { Temple } from '../src/types';

export interface KnownLocation {
  name: string;
  aliases: string[];
  lat: number;
  lng: number;
  state: string;
}

export const KNOWN_LOCATIONS: KnownLocation[] = [
  {
    name: 'Tirupati',
    aliases: ['tirupati', 'tirupathi', 'tirumala', 'thirupati', 'sv temple'],
    lat: 13.6288,
    lng: 79.4192,
    state: 'Andhra Pradesh',
  },
  {
    name: 'Srikalahasti',
    aliases: ['srikalahasti', 'srikalahasthi', 'kalahasti', 'kalahasthi'],
    lat: 13.7498,
    lng: 79.7037,
    state: 'Andhra Pradesh',
  },
  {
    name: 'Nandalur',
    aliases: ['nandalur', 'nandaluru', 'rajampet'],
    lat: 14.2589,
    lng: 79.1172,
    state: 'Andhra Pradesh',
  },
  {
    name: 'Ontimitta',
    aliases: ['ontimitta', 'vontimitta', 'kadapa', 'cuddapah'],
    lat: 14.3941,
    lng: 79.0275,
    state: 'Andhra Pradesh',
  },
  {
    name: 'Vijayawada',
    aliases: ['vijayawada', 'bezawada', 'indrakeeladri', 'kanaka durga'],
    lat: 16.5062,
    lng: 80.6480,
    state: 'Andhra Pradesh',
  },
  {
    name: 'Srisailam',
    aliases: ['srisailam', 'srisaila', 'mallikarjuna', 'kurnool'],
    lat: 16.0741,
    lng: 78.8686,
    state: 'Andhra Pradesh',
  },
  {
    name: 'Thiruvannamalai',
    aliases: ['thiruvannamalai', 'tiruvannamalai', 'arunachalam', 'arunachala', 'annamalai'],
    lat: 12.2253,
    lng: 79.0677,
    state: 'Tamil Nadu',
  },
  {
    name: 'Madurai',
    aliases: ['madurai', 'meenakshi', 'pandya'],
    lat: 9.9195,
    lng: 78.1193,
    state: 'Tamil Nadu',
  },
  {
    name: 'Rameswaram',
    aliases: ['rameswaram', 'rameshwaram', 'dhanushkodi', 'ramanathaswamy'],
    lat: 9.2881,
    lng: 79.3174,
    state: 'Tamil Nadu',
  },
  {
    name: 'Thanjavur',
    aliases: ['thanjavur', 'tanjore', 'brihadisvara', 'brihadeeswara', 'chola'],
    lat: 10.7828,
    lng: 79.1318,
    state: 'Tamil Nadu',
  },
  {
    name: 'Visakhapatnam',
    aliases: ['visakhapatnam', 'vizag', 'simhachalam', 'simhadri'],
    lat: 17.7665,
    lng: 83.2505,
    state: 'Andhra Pradesh',
  },
  {
    name: 'Yadagirigutta',
    aliases: ['yadagirigutta', 'yadadri', 'hyderabad', 'secunderabad', 'bhongir'],
    lat: 17.5888,
    lng: 78.9405,
    state: 'Telangana',
  },
  {
    name: 'Bhadrachalam',
    aliases: ['bhadrachalam', 'kothagudem', 'godavari'],
    lat: 17.6688,
    lng: 80.8936,
    state: 'Telangana',
  },
  {
    name: 'Udupi',
    aliases: ['udupi', 'udipi', 'mangalore', 'mangaluru', 'karnataka'],
    lat: 13.3409,
    lng: 74.7523,
    state: 'Karnataka',
  },
  {
    name: 'Dwarka',
    aliases: ['dwarka', 'dwaraka', 'jagat mandir', 'gujarat'],
    lat: 22.2376,
    lng: 68.9678,
    state: 'Gujarat',
  },
  {
    name: 'Somnath',
    aliases: ['somnath', 'prabhas patan', 'veraval', 'gir somnath'],
    lat: 20.8880,
    lng: 70.4013,
    state: 'Gujarat',
  },
  {
    name: 'Thiruvananthapuram',
    aliases: ['thiruvananthapuram', 'trivandrum', 'padmanabhaswamy', 'kerala'],
    lat: 8.4831,
    lng: 76.9436,
    state: 'Kerala',
  },
  {
    name: 'Shirdi',
    aliases: ['shirdi', 'ahmednagar', 'nashik', 'sai baba'],
    lat: 19.7668,
    lng: 74.4762,
    state: 'Maharashtra',
  },
  {
    name: 'Varanasi',
    aliases: ['varanasi', 'kashi', 'banaras', 'benaras', 'vishwanath', 'ganga'],
    lat: 25.3109,
    lng: 83.0107,
    state: 'Uttar Pradesh',
  },
  {
    name: 'Kedarnath',
    aliases: ['kedarnath', 'rudraprayag', 'uttarakhand', 'himalayas', 'char dham'],
    lat: 30.7352,
    lng: 79.0669,
    state: 'Uttarakhand',
  },
  {
    name: 'Chennai',
    aliases: ['chennai', 'madras'],
    lat: 13.0827,
    lng: 80.2707,
    state: 'Tamil Nadu',
  },
  {
    name: 'Bengaluru',
    aliases: ['bengaluru', 'bangalore'],
    lat: 12.9716,
    lng: 77.5946,
    state: 'Karnataka',
  },
];

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface ParsedLocationQuery {
  isLocationQuery: boolean;
  radiusKm?: number;
  centerLocation?: {
    name: string;
    lat: number;
    lng: number;
  };
  isNearMe: boolean;
  isNearSelectedLocation: boolean;
  targetCity?: string;
  targetDeity?: string;
  cleanSearchText: string;
  explanation: string;
}

/**
 * Parses user input for location-based nearby requests:
 * Examples:
 * - "Temples near me"
 * - "Temples within 5 km"
 * - "Temples within 10 km"
 * - "Temples within 25 km"
 * - "Temples within 50 km"
 * - "Temples around my location"
 * - "Temples near Tirupati"
 * - "Temples within 50 km of my selected location"
 * - "Temples within 50 km of Tirupati"
 * - "Shiva temples near Madurai"
 */
export function parseLocationQuery(
  rawQuery: string,
  userLat?: number,
  userLng?: number,
  userCityName?: string
): ParsedLocationQuery {
  const q = rawQuery.trim().toLowerCase();
  let remaining = q;

  // 1. Detect explicit radius: e.g. "within 5 km", "within 10km", "5 km radius", "in 50 km"
  let radiusKm: number | undefined = undefined;
  const radiusRegex = /(?:within|radius|in|under|around)\s*(\d+)\s*(?:km|kms|kilometers|kilometres)?/i;
  const directKmRegex = /(\d+)\s*(?:km|kms|kilometers|kilometres)/i;

  const rMatch = q.match(radiusRegex);
  if (rMatch) {
    radiusKm = parseInt(rMatch[1], 10);
    remaining = remaining.replace(rMatch[0], ' ');
  } else {
    const dMatch = q.match(directKmRegex);
    if (dMatch) {
      radiusKm = parseInt(dMatch[1], 10);
      remaining = remaining.replace(dMatch[0], ' ');
    }
  }

  // 2. Detect "near me", "around me", "around my location", "near my location", "nearby", "close to me"
  const nearMeRegex = /(?:near\s+me|around\s+me|around\s+my\s+location|near\s+my\s+location|close\s+to\s+me|nearby|closest|around\s+here)/i;
  const isNearMe = nearMeRegex.test(q);
  if (isNearMe) {
    remaining = remaining.replace(nearMeRegex, ' ');
  }

  // 3. Detect "my selected location"
  const selectedLocRegex = /(?:my\s+selected\s+location|selected\s+location|current\s+location)/i;
  const isNearSelectedLocation = selectedLocRegex.test(q);
  if (isNearSelectedLocation) {
    remaining = remaining.replace(selectedLocRegex, ' ');
  }

  // 4. Check for known cities/locations specified in query: e.g. "near Tirupati", "in Madurai", "around Vijayawada"
  let matchedLocation: KnownLocation | undefined = undefined;
  for (const loc of KNOWN_LOCATIONS) {
    for (const alias of loc.aliases) {
      // Check if alias is in the remaining query as a word
      const aliasRegex = new RegExp(`\\b${alias}\\b`, 'i');
      if (aliasRegex.test(remaining) || aliasRegex.test(q)) {
        matchedLocation = loc;
        remaining = remaining.replace(aliasRegex, ' ');
        break;
      }
    }
    if (matchedLocation) break;
  }

  // 5. Clean query of filler words like "temples", "temple", "near", "around", "of", "within", "find", "show", "search"
  const fillerRegex = /\b(temples|temple|mandir|kovil|gudi|near|around|close|to|of|in|within|find|show|search|the|all|list|me)\b/gi;
  let cleanSearch = remaining.replace(fillerRegex, ' ').replace(/\s+/g, ' ').trim();

  // 6. Check for deity mentions
  let targetDeity: string | undefined = undefined;
  const deityKeywords: Record<string, string> = {
    shiva: 'Shiva',
    siva: 'Shiva',
    linga: 'Shiva',
    jyotirlinga: 'Shiva',
    vishnu: 'Vishnu',
    venkateswara: 'Venkateswara',
    balaji: 'Venkateswara',
    krishna: 'Krishna',
    durga: 'Durga',
    ammavaru: 'Durga',
    shakthi: 'Durga',
    shakti: 'Durga',
    devi: 'Durga',
    narasimha: 'Narasimha',
    rama: 'Rama',
    ram: 'Rama',
    ganesha: 'Ganesha',
    vinayaka: 'Ganesha',
    saibaba: 'Saibaba',
    sai: 'Saibaba',
  };

  for (const [key, deityName] of Object.entries(deityKeywords)) {
    const dRegex = new RegExp(`\\b${key}\\b`, 'i');
    if (dRegex.test(q)) {
      targetDeity = deityName;
      cleanSearch = cleanSearch.replace(dRegex, ' ').replace(/\s+/g, ' ').trim();
      break;
    }
  }

  // Determine if this is a location-based query
  const hasLocationIntent =
    isNearMe ||
    isNearSelectedLocation ||
    matchedLocation !== undefined ||
    radiusKm !== undefined ||
    /^(temples?\s*(near|around|nearby|close|within|in))/i.test(q);

  let centerLocation: { name: string; lat: number; lng: number } | undefined = undefined;

  if (matchedLocation) {
    centerLocation = {
      name: matchedLocation.name,
      lat: matchedLocation.lat,
      lng: matchedLocation.lng,
    };
  } else if (isNearSelectedLocation || isNearMe) {
    if (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng)) {
      centerLocation = {
        name: userCityName || 'Your Location',
        lat: userLat,
        lng: userLng,
      };
    } else {
      // Fallback default center to Tirupati hub if GPS not yet activated
      centerLocation = {
        name: 'Tirupati (Default Hub)',
        lat: 13.6288,
        lng: 79.4192,
      };
    }
  } else if (radiusKm !== undefined) {
    // e.g. "Temples within 10 km" without explicit city
    if (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng)) {
      centerLocation = {
        name: userCityName || 'Your Location',
        lat: userLat,
        lng: userLng,
      };
    } else {
      centerLocation = {
        name: 'Tirupati (Default Hub)',
        lat: 13.6288,
        lng: 79.4192,
      };
    }
  }

  // Build human-friendly explanation of applied location filter
  let explanation = '';
  if (centerLocation && radiusKm) {
    explanation = `Showing temples within ${radiusKm} km of ${centerLocation.name}, ranked by nearest proximity.`;
  } else if (centerLocation) {
    explanation = `Showing temples near ${centerLocation.name}, ranked by shortest driving/aerial distance.`;
  } else if (hasLocationIntent) {
    explanation = `Showing temples ranked by proximity to your current location.`;
  }

  return {
    isLocationQuery: hasLocationIntent,
    radiusKm,
    centerLocation,
    isNearMe,
    isNearSelectedLocation,
    targetCity: matchedLocation?.name,
    targetDeity,
    cleanSearchText: cleanSearch,
    explanation,
  };
}

/**
 * Applies location-based query parsing & Haversine proximity ranking to any list of temples
 */
export function filterTemplesByLocationQuery(
  allTemples: Temple[],
  rawQuery: string,
  userLat?: number,
  userLng?: number,
  userCityName?: string
): {
  temples: Temple[];
  parsed: ParsedLocationQuery;
  isLocationFilterActive: boolean;
} {
  const parsed = parseLocationQuery(rawQuery, userLat, userLng, userCityName);

  if (!parsed.isLocationQuery && !rawQuery.trim()) {
    // If no search query and user coords provided, just tag distance
    if (userLat !== undefined && userLng !== undefined) {
      const tagged = allTemples.map((t) => ({
        ...t,
        distanceKm: haversineKm(userLat, userLng, t.lat, t.lng),
      }));
      return { temples: tagged, parsed, isLocationFilterActive: false };
    }
    return { temples: allTemples, parsed, isLocationFilterActive: false };
  }

  let candidates = [...allTemples];

  // If a deity was identified, filter by deity
  if (parsed.targetDeity) {
    const dLower = parsed.targetDeity.toLowerCase();
    candidates = candidates.filter((t) => t.deity.toLowerCase().includes(dLower));
  }

  // If remaining cleanSearchText exists, perform keyword check
  if (parsed.cleanSearchText) {
    const kw = parsed.cleanSearchText.toLowerCase();
    const keywordMatches = candidates.filter(
      (t) =>
        t.name.toLowerCase().includes(kw) ||
        t.deity.toLowerCase().includes(kw) ||
        t.city.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw)
    );
    if (keywordMatches.length > 0) {
      candidates = keywordMatches;
    }
  }

  // If we have a center location (either from named city or user coordinates)
  if (parsed.centerLocation) {
    const { lat: cLat, lng: cLng } = parsed.centerLocation;
    // Compute distance for all candidates from this center
    let withDistances = candidates.map((t) => ({
      ...t,
      distanceKm: haversineKm(cLat, cLng, t.lat, t.lng),
    }));

    // If explicit radius is set, apply strict radius threshold
    if (parsed.radiusKm !== undefined && parsed.radiusKm > 0) {
      withDistances = withDistances.filter(
        (t) => t.distanceKm !== undefined && t.distanceKm <= parsed.radiusKm!
      );
    } else if (parsed.targetCity) {
      // If user queried "Temples near [City]" without specifying a km number,
      // show temples in proximity (e.g. within 150 km, or top closest temples)
      // to ensure meaningful nearby results like Tirumala & Srikalahasthi for Tirupati
      const nearbyOnly = withDistances.filter(
        (t) => t.distanceKm !== undefined && t.distanceKm <= 160
      );
      if (nearbyOnly.length > 0) {
        withDistances = nearbyOnly;
      }
    }

    // Always sort by proximity (nearest first)
    withDistances.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));

    return {
      temples: withDistances,
      parsed,
      isLocationFilterActive: true,
    };
  }

  // Fallback keyword search if not a location query
  const qLower = rawQuery.toLowerCase();
  const filtered = candidates.filter(
    (t) =>
      t.name.toLowerCase().includes(qLower) ||
      t.deity.toLowerCase().includes(qLower) ||
      t.city.toLowerCase().includes(qLower) ||
      t.state.toLowerCase().includes(qLower) ||
      t.description.toLowerCase().includes(qLower)
  );

  return {
    temples: filtered,
    parsed,
    isLocationFilterActive: false,
  };
}
