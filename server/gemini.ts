import { GoogleGenAI } from '@google/genai';
import { db } from './db';
import { Temple, Vacancy, PriestProfile } from '../src/types';
import { filterTemplesByLocationQuery, haversineKm } from './locationSearch';

let genAIClient: GoogleGenAI | null = null;

// Preferred model fallback hierarchy
const PREFERRED_MODELS = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

// In-memory response caches to minimize quota consumption and accelerate repeat requests
const priestMatchCache = new Map<string, any>();
const duplicateDetectCache = new Map<string, any>();
const templeAssistantCache = new Map<string, string>();
const aiSearchCache = new Map<string, any>();

function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

/**
 * Execute a generation call across prioritized model aliases with rate-limit handling.
 */
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  config?: any
): Promise<string | null> {
  for (const model of PREFERRED_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      const isQuotaOrRate =
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('limit');

      if (isQuotaOrRate) {
        // Try the next candidate model quietly without throwing
        continue;
      }
      // If it's another non-quota error, break to let fallback heuristic handle it
      break;
    }
  }
  return null;
}

/**
 * 1. Natural Language Temple Search
 * Parses queries like "ancient Shiva temple near Madurai with evening arati" or "goddess temple in south"
 */
export async function aiTempleSearch(query: string, userLat?: number, userLng?: number): Promise<{
  matchedTempleIds: string[];
  explanation: string;
  extractedCriteria: { deity?: string; city?: string; rituals?: string[] };
}> {
  const cacheKey = `${query.trim().toLowerCase()}_${userLat || 0}_${userLng || 0}`;
  if (aiSearchCache.has(cacheKey)) {
    return aiSearchCache.get(cacheKey)!;
  }

  // First, check if this is a location-based nearby query (e.g. "Temples near me", "within 50 km of Tirupati")
  const locationSearchResult = filterTemplesByLocationQuery(db.temples, query, userLat, userLng);

  const ai = getGenAI();

  // If it's a recognized location query with results, we can either enhance explanation with AI or use parsed explanation
  if (locationSearchResult.isLocationFilterActive && locationSearchResult.temples.length > 0) {
    const ids = locationSearchResult.temples.map((t) => t.id);
    const topTemples = locationSearchResult.temples.slice(0, 3).map((t) => `${t.name} (${t.distanceKm} km away)`).join(', ');
    const fallbackExp = `${locationSearchResult.parsed.explanation} Closest: ${topTemples}.`;

    if (ai) {
      try {
        const prompt = `Devotee query: "${query}"
Matched nearby temples by real coordinates:
${JSON.stringify(locationSearchResult.temples.slice(0, 5).map(t => ({ name: t.name, city: t.city, deity: t.deity, distanceKm: t.distanceKm })), null, 2)}

Provide a concise 1-2 sentence response summarizing these nearby temples, their exact distances, and spiritual significance.
Return valid JSON: { "explanation": "..." }`;

        const text = await callGeminiWithFallback(ai, prompt, {
          responseMimeType: 'application/json',
          temperature: 0.2,
        });

        if (text) {
          const parsed = JSON.parse(text.trim() || '{}');
          const result = {
            matchedTempleIds: ids,
            explanation: parsed.explanation || fallbackExp,
            extractedCriteria: {
              deity: locationSearchResult.parsed.targetDeity,
              city: locationSearchResult.parsed.centerLocation?.name,
              rituals: [],
            },
          };
          aiSearchCache.set(cacheKey, result);
          return result;
        }
      } catch (e) {
        // Fallback to computed explanation
      }
    }

    const result = {
      matchedTempleIds: ids,
      explanation: fallbackExp,
      extractedCriteria: {
        deity: locationSearchResult.parsed.targetDeity,
        city: locationSearchResult.parsed.centerLocation?.name,
        rituals: [],
      },
    };
    aiSearchCache.set(cacheKey, result);
    return result;
  }

  const templeCatalog = db.temples.map((t) => ({
    id: t.id,
    name: t.name,
    deity: t.deity,
    city: t.city,
    state: t.state,
    description: t.description,
    pujas: t.pujas.map((p) => p.name).join(', '),
    timings: `${t.timings.morning}; ${t.timings.evening}`,
  }));

  if (ai) {
    try {
      const prompt = `You are an expert Hindu temple search assistant for TempleConnect.
User query: "${query}"
Candidate Temples database:
${JSON.stringify(templeCatalog, null, 2)}

Analyze the user's intent (deities, traditions, location preferences, rituals, timings).
Select matching temple IDs ranked by relevance.
Return valid JSON only in this format:
{
  "matchedTempleIds": ["id1", "id2"],
  "explanation": "Brief 1-sentence rationale for the devotee",
  "extractedCriteria": {
    "deity": "Identified deity or null",
    "city": "Identified city or null",
    "rituals": ["identified ritual names"]
  }
}`;

      const text = await callGeminiWithFallback(ai, prompt, {
        responseMimeType: 'application/json',
        temperature: 0.2,
      });

      if (text) {
        const parsed = JSON.parse(text.trim() || '{}');
        if (Array.isArray(parsed.matchedTempleIds) && parsed.matchedTempleIds.length > 0) {
          aiSearchCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (err) {
      // Fallback cleanly
    }
  }

  // Rule-based fallback using location search filter
  if (locationSearchResult.temples.length > 0) {
    const result = {
      matchedTempleIds: locationSearchResult.temples.map((m) => m.id),
      explanation: locationSearchResult.parsed.explanation || `Found ${locationSearchResult.temples.length} temples matching "${query}".`,
      extractedCriteria: {
        deity: locationSearchResult.parsed.targetDeity,
        city: locationSearchResult.parsed.centerLocation?.name,
        rituals: [],
      },
    };
    aiSearchCache.set(cacheKey, result);
    return result;
  }

  const qLower = query.toLowerCase();
  const matched = db.temples.filter((t) => {
    return (
      t.name.toLowerCase().includes(qLower) ||
      t.deity.toLowerCase().includes(qLower) ||
      t.city.toLowerCase().includes(qLower) ||
      t.state.toLowerCase().includes(qLower) ||
      t.description.toLowerCase().includes(qLower) ||
      t.pujas.some((p) => p.name.toLowerCase().includes(qLower))
    );
  });

  const result = {
    matchedTempleIds: matched.map((m) => m.id),
    explanation: `Found ${matched.length} temples matching "${query}".`,
    extractedCriteria: {
      deity: query,
      city: undefined,
      rituals: [],
    },
  };
  aiSearchCache.set(cacheKey, result);
  return result;
}

/**
 * 2. Priest-Vacancy Matching Based on Explicit Skills & Experience
 */
export async function aiMatchPriestToVacancy(
  vacancy: Vacancy,
  priest: PriestProfile
): Promise<{
  matchScore: number; // 0 - 100
  strengths: string[];
  gaps: string[];
  summary: string;
  recommendation: 'Highly Recommended' | 'Strong Candidate' | 'Moderate Match' | 'Gaps Detected';
}> {
  const cacheKey = `${vacancy.id}_${priest.userId || priest.id}`;
  if (priestMatchCache.has(cacheKey)) {
    return priestMatchCache.get(cacheKey)!;
  }

  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are a Vedic hiring advisor assisting a Hindu Temple Trust.
Evaluate the compatibility between the Priest Profile and the Temple Vacancy based strictly on explicit ritual qualifications, Vedic lineage, experience years, and language skills.
DO NOT make final hiring decisions; provide an advisory score and breakdown.

Vacancy Details:
- Title: ${vacancy.title}
- Temple: ${vacancy.templeName}, ${vacancy.location}
- Required Vedic Tradition: ${vacancy.vedaTraditionRequired}
- Required Ritual Specializations: ${vacancy.ritualSpecialization.join(', ')}
- Minimum Experience Years: ${vacancy.minExperienceYears}
- Description: ${vacancy.description}

Priest Profile:
- Name: ${priest.fullName}
- Veda Tradition: ${priest.vedaTradition}
- Experience: ${priest.experienceYears} years
- Purohitham Skills: ${priest.purohithamSkills.join(', ')}
- Formal Training: ${priest.trainingQualifications}
- Languages: ${priest.languages.join(', ')}
- Achievements: ${priest.achievements}

Return JSON in this exact structure:
{
  "matchScore": 88,
  "strengths": ["string", "string"],
  "gaps": ["string"],
  "summary": "Concise 2-sentence objective summary",
  "recommendation": "Highly Recommended" | "Strong Candidate" | "Moderate Match" | "Gaps Detected"
}`;

      const text = await callGeminiWithFallback(ai, prompt, {
        responseMimeType: 'application/json',
        temperature: 0.2,
      });

      if (text) {
        const parsed = JSON.parse(text.trim() || '{}');
        if (typeof parsed.matchScore === 'number') {
          priestMatchCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (err: any) {
      // Quiet fallback without raw console error dump
    }
  }

  // Robust heuristic matching algorithm fallback
  let score = 50;
  const strengths: string[] = [];
  const gaps: string[] = [];

  // Experience comparison
  if (priest.experienceYears >= vacancy.minExperienceYears) {
    score += 20;
    strengths.push(`Meets experience threshold (${priest.experienceYears} yrs vs ${vacancy.minExperienceYears} yrs required).`);
  } else {
    score -= 15;
    gaps.push(`Experience is below requested minimum (${priest.experienceYears} yrs vs ${vacancy.minExperienceYears} yrs).`);
  }

  // Skill overlap
  const matchedSkills = vacancy.ritualSpecialization.filter((rs) =>
    priest.purohithamSkills.some((ps) => ps.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(ps.toLowerCase()))
  );
  if (matchedSkills.length > 0) {
    score += Math.min(25, matchedSkills.length * 10);
    strengths.push(`Direct ritual expertise in: ${matchedSkills.join(', ')}.`);
  } else {
    gaps.push('No direct overlap found in stated primary ritual specializations.');
  }

  // Veda check
  if (priest.vedaTradition && priest.vedaTradition.toLowerCase().includes('veda')) {
    score += 5;
    strengths.push(`Formally trained in ${priest.vedaTradition}.`);
  }

  const finalScore = Math.max(10, Math.min(99, score));
  let rec: 'Highly Recommended' | 'Strong Candidate' | 'Moderate Match' | 'Gaps Detected' = 'Moderate Match';
  if (finalScore >= 85) rec = 'Highly Recommended';
  else if (finalScore >= 70) rec = 'Strong Candidate';
  else if (finalScore < 50) rec = 'Gaps Detected';

  const result = {
    matchScore: finalScore,
    strengths,
    gaps,
    summary: `${priest.fullName} scores ${finalScore}% compatibility based on Vedic tradition, ${priest.experienceYears} years experience, and ritual specializations.`,
    recommendation: rec,
  };
  priestMatchCache.set(cacheKey, result);
  return result;
}

/**
 * 3. Duplicate Temple Detection on New Submissions
 */
export async function aiDetectDuplicateTemple(newTemple: Partial<Temple>): Promise<{
  isDuplicateLikely: boolean;
  confidence: number; // 0 - 100
  existingTempleMatch?: {
    id: string;
    name: string;
    city: string;
    reason: string;
  };
  warningMessage?: string;
}> {
  if (!newTemple.name || !newTemple.city) {
    return { isDuplicateLikely: false, confidence: 0 };
  }

  const cacheKey = `${newTemple.name.toLowerCase()}_${newTemple.city.toLowerCase()}`;
  if (duplicateDetectCache.has(cacheKey)) {
    return duplicateDetectCache.get(cacheKey)!;
  }

  const existingSummary = db.temples.map((t) => ({
    id: t.id,
    name: t.name,
    deity: t.deity,
    city: t.city,
    lat: t.lat,
    lng: t.lng,
  }));

  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `You are a geospatial and heritage data integrity system for TempleConnect.
Evaluate if this newly submitted temple is a duplicate of an existing temple in the database.
Check for phonetic similarities in temple name, deity, and city proximity.

New Submission:
Name: ${newTemple.name}
Deity: ${newTemple.deity}
City: ${newTemple.city}
Address: ${newTemple.address}
Latitude: ${newTemple.lat || 'unknown'}
Longitude: ${newTemple.lng || 'unknown'}

Existing Temple Records:
${JSON.stringify(existingSummary, null, 2)}

Return JSON:
{
  "isDuplicateLikely": true or false,
  "confidence": number between 0 and 100,
  "existingTempleMatch": {
    "id": "matched temple id or null",
    "name": "matched temple name",
    "city": "matched city",
    "reason": "explanation of similarity"
  } or null,
  "warningMessage": "Short friendly warning if duplicate, else null"
}`;

      const text = await callGeminiWithFallback(ai, prompt, {
        responseMimeType: 'application/json',
        temperature: 0.1,
      });

      if (text) {
        const parsed = JSON.parse(text.trim() || '{}');
        duplicateDetectCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch (err) {
      // Fallback
    }
  }

  // Heuristic duplicate check
  const newNameLower = newTemple.name.toLowerCase();
  const newCityLower = newTemple.city.toLowerCase();

  for (const t of db.temples) {
    const existingNameLower = t.name.toLowerCase();
    const existingCityLower = t.city.toLowerCase();

    // Check same city and substring name
    if (
      existingCityLower === newCityLower &&
      (existingNameLower.includes(newNameLower) || newNameLower.includes(existingNameLower))
    ) {
      const result = {
        isDuplicateLikely: true,
        confidence: 85,
        existingTempleMatch: {
          id: t.id,
          name: t.name,
          city: t.city,
          reason: `A temple named "${t.name}" already exists in ${t.city}.`,
        },
        warningMessage: `A temple with a similar name already exists in ${t.city} ("${t.name}"). Please verify to prevent duplicates.`,
      };
      duplicateDetectCache.set(cacheKey, result);
      return result;
    }
  }

  const result = {
    isDuplicateLikely: false,
    confidence: 10,
  };
  duplicateDetectCache.set(cacheKey, result);
  return result;
}

/**
 * 4. Temple Information Assistant Grounded in Database Records
 */
export async function aiTempleAssistant(templeId: string, userQuestion: string): Promise<string> {
  const temple = db.temples.find((t) => t.id === templeId);
  if (!temple) {
    return 'I could not find the verified record for this temple in the TempleConnect registry.';
  }

  const cacheKey = `${templeId}_${userQuestion.trim().toLowerCase()}`;
  if (templeAssistantCache.has(cacheKey)) {
    return templeAssistantCache.get(cacheKey)!;
  }

  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `You are TempleConnect's verified temple guide assistant for ${temple.name}.
Answer the devotee's question accurately using ONLY the verified database facts provided below.
If information is not known from the data (like ticket prices not listed or private sanctum photos), politely state that devotees should check directly with the temple office at ${temple.contact.phone}.
Do NOT make up false dates or timings.

Temple Verified Record:
- Name: ${temple.name}
- Deity: ${temple.deity}
- Location: ${temple.address}, ${temple.city}, ${temple.state}
- Timings: Morning ${temple.timings.morning}, Evening ${temple.timings.evening}
- Notes: ${temple.timings.notes || 'None'}
- Special Days: ${temple.timings.specialDays || 'None'}
- Pujas: ${temple.pujas.map((p) => `${p.name} at ${p.timing} (Significance: ${p.significance}, Fee: ${p.fee || 'N/A'})`).join('; ')}
- Dress Code: ${temple.dressCode || 'Traditional attire recommended'}
- Contact: ${temple.contact.phone}, ${temple.contact.email}
- History & Significance: ${temple.history}
- Description: ${temple.description}
- Upcoming Events: ${temple.events.map((e) => `${e.title} on ${e.date} at ${e.time}: ${e.description}`).join('; ') || 'No upcoming events listed'}

Devotee Question: "${userQuestion}"
Provide a warm, polite, and helpful response:`;

      const text = await callGeminiWithFallback(ai, prompt, {
        temperature: 0.3,
      });

      if (text) {
        templeAssistantCache.set(cacheKey, text);
        return text;
      }
    } catch (err) {
      // Fallback cleanly
    }
  }

  // Grounded fallback response
  const fallback = `Regarding ${temple.name}:
- Deity: ${temple.deity}
- Daily Timings: ${temple.timings.morning} & ${temple.timings.evening} (${temple.timings.notes || ''})
- Dress Code: ${temple.dressCode || 'Traditional modest attire'}
- Temple Contact: ${temple.contact.phone} | ${temple.contact.email}
For special sevas, please visit the Pujas section.`;
  templeAssistantCache.set(cacheKey, fallback);
  return fallback;
}
