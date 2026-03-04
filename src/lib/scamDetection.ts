// ============================================================
//  SCAM DETECTION — banned keyword matching
// ============================================================

export const BANNED_KEYWORDS = [
    "free money",
    "lottery",
    "get rich",
    "click to claim",
    "win cash",
    "instant reward",
    "100% profit",
    "guaranteed income",
    "pyramid scheme",
    "mlm",
    "crypto investment",
    "double your money",
    "ponzi",
    "earn from home guaranteed",
    "miracle cure",
    "illegal",
    "banned substance",
    "counterfeit",
    "fake brand",
    "replica luxury",
];

/**
 * Checks a product name+description against banned keyword list.
 * Returns `true` if the listing is flagged as suspicious.
 */
export function detectScam(name: string, description: string): boolean {
    const combined = `${name} ${description}`.toLowerCase();
    return BANNED_KEYWORDS.some((kw) => combined.includes(kw.toLowerCase()));
}

/**
 * Returns the matched banned keywords found in text.
 */
export function getMatchedKeywords(name: string, description: string): string[] {
    const combined = `${name} ${description}`.toLowerCase();
    return BANNED_KEYWORDS.filter((kw) => combined.includes(kw.toLowerCase()));
}
