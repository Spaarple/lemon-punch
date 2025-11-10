/**
 * Service SEO pour récupérer les métadonnées depuis Rank Math (WordPress).
 * Permet de récupérer les données SEO (title, description, etc.) pour les injecter
 * dans les pages du frontend Astro.
 */

const WORDPRESS_URL = import.meta.env.SEO_URL_BACKEND;
const SITE_URL = import.meta.env.SEO_URL_FRONTEND;
const RANKMATH_API_ENDPOINT = "/wp-json/rankmath/v1/getHead";

/**
 * Interface représentant les données SEO structurées
 */
export interface SeoMetadata {
    /** Le titre de la page (extrait depuis og:title) */
    title: string;
    /** La description de la page (meta description) */
    description: string;
    /** L'URL canonical de la page */
    canonicalUrl: string;
    /** Le HTML complet du <head> retourné par Rank Math */
    rawHtml: string;
}

/**
 * Interface pour la réponse de l'API Rank Math
 */
interface RankMathApiResponse {
    success: boolean;
    head?: string;
}

/**
 * Construit l'URL complète de la page WordPress à partir du slug ou du chemin.
 * Supporte les articles, pages et Custom Post Types (CPT UI).
 *
 * @param slugOrPath - Le slug ou le chemin complet (ex: "mon-article" ou "concerts/festival-2024")
 * @returns L'URL complète (ex: "https://shop.lemonpunch.fr/mon-article/")
 *
 * @example
 * ```ts
 * // Article standard
 * buildWordPressUrl("mon-article")
 * // => "https://shop.lemonpunch.fr/mon-article/"
 *
 * // Custom Post Type (ex: concerts)
 * buildWordPressUrl("concerts/festival-2024")
 * // => "https://shop.lemonpunch.fr/concerts/festival-2024/"
 *
 * // Page avec hiérarchie
 * buildWordPressUrl("a-propos/equipe")
 * // => "https://shop.lemonpunch.fr/a-propos/equipe/"
 * ```
 */
export function buildWordPressUrl(slugOrPath: string): string {
    const cleanPath = slugOrPath.startsWith('/') ? slugOrPath : `/${slugOrPath}`;
    const finalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
    return `${WORDPRESS_URL}${finalPath}`;
}

/**
 * Extrait le titre depuis les balises meta Open Graph ou Twitter.
 * Rank Math ne retourne pas de balise <title> standard.
 *
 * @param html - Le HTML contenant les balises meta
 * @returns Le titre extrait ou une chaîne vide
 */
function extractTitle(html: string): string {
    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (ogTitleMatch) return ogTitleMatch[1];

    const twitterTitleMatch = html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i);
    if (twitterTitleMatch) return twitterTitleMatch[1];

    return "";
}

/**
 * Extrait la description depuis la balise meta description.
 *
 * @param html - Le HTML contenant les balises meta
 * @returns La description extraite ou une chaîne vide
 */
function extractDescription(html: string): string {
    const descriptionMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    return descriptionMatch ? descriptionMatch[1] : "";
}

/**
 * Extrait l'URL canonical depuis la balise link rel="canonical".
 *
 * @param html - Le HTML contenant les balises meta
 * @returns L'URL canonical extraite ou une chaîne vide
 */
function extractCanonicalUrl(html: string): string {
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    return canonicalMatch ? canonicalMatch[1] : "";
}

/**
 * Remplace toutes les URLs WordPress par les URLs du site frontend.
 *
 * @param html - Le HTML contenant les URLs à remplacer
 * @returns Le HTML avec les URLs corrigées
 */
function replaceUrls(html: string): string {
    return html.replaceAll(WORDPRESS_URL, SITE_URL);
}

/**
 * Récupère les métadonnées SEO depuis l'API Rank Math pour une URL WordPress donnée.
 *
 * @param wordpressUrl - L'URL complète de la page WordPress (ex: "https://shop.lemonpunch.fr/mon-article/")
 * @returns Les métadonnées SEO extraites, ou null en cas d'erreur
 *
 * @example
 * ```ts
 * const seo = await fetchSeoMetadata("https://shop.lemonpunch.fr/mon-article/");
 * if (seo) {
 *   console.log(seo.title); // "Mon Article - Lemon Punch"
 *   console.log(seo.description); // "Description de mon article"
 * }
 * ```
 */
export async function fetchSeoMetadata(wordpressUrl: string): Promise<SeoMetadata | null> {
    // Validation de l'URL
    if (!wordpressUrl.startsWith(WORDPRESS_URL)) {
        console.warn(`[RankMath] URL invalide - doit commencer par ${WORDPRESS_URL}:`, wordpressUrl);
        return null;
    }

    try {
        // Appel à l'API Rank Math
        const apiUrl = `${WORDPRESS_URL}${RANKMATH_API_ENDPOINT}?url=${encodeURIComponent(wordpressUrl)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`[RankMath] Erreur HTTP ${response.status} pour:`, wordpressUrl);
            return null;
        }

        const data: RankMathApiResponse = await response.json();

        if (!data.success || !data.head) {
            console.warn(`[RankMath] Aucune donnée SEO retournée pour:`, wordpressUrl);
            return null;
        }

        // Nettoyage des URLs
        const cleanHtml = replaceUrls(data.head);

        // Extraction des métadonnées
        return {
            title: extractTitle(cleanHtml),
            description: extractDescription(cleanHtml),
            canonicalUrl: extractCanonicalUrl(cleanHtml),
            rawHtml: cleanHtml
        };

    } catch (error) {
        console.error(`[RankMath] Erreur lors de la récupération des données SEO:`, error);
        return null;
    }
}

/**
 * Construit l'URL WordPress pour un Custom Post Type.
 *
 * @param postType - Le slug du Custom Post Type (ex: "concerts", "produits")
 * @param slug - Le slug de l'élément (ex: "festival-2024")
 * @returns L'URL complète
 *
 * @example
 * ```ts
 * buildCptUrl("concerts", "festival-2024")
 * // => "https://shop.lemonpunch.fr/concerts/festival-2024/"
 *
 * buildCptUrl("produits", "t-shirt-noir")
 * // => "https://shop.lemonpunch.fr/produits/t-shirt-noir/"
 * ```
 */
export function buildCptUrl(postType: string, slug: string): string {
    return buildWordPressUrl(`${postType}/${slug}`);
}

/**
 * Helper pour récupérer les métadonnées SEO à partir d'un slug.
 * Combine buildWordPressUrl() et fetchSeoMetadata().
 *
 * @param slug - Le slug de la page/article (ex: "mon-article")
 * @returns Les métadonnées SEO extraites, ou null en cas d'erreur
 *
 * @example
 * ```ts
 * const seo = await getSeoFromSlug("mon-article");
 * if (seo) {
 *   console.log(seo.title);
 *   console.log(seo.description);
 * }
 * ```
 */
export async function getSeoFromSlug(slug: string): Promise<SeoMetadata | null> {
    const wordpressUrl = buildWordPressUrl(slug);
    return fetchSeoMetadata(wordpressUrl);
}

/**
 * Helper pour récupérer les métadonnées SEO d'un Custom Post Type.
 *
 * @param postType - Le slug du Custom Post Type
 * @param slug - Le slug de l'élément
 * @returns Les métadonnées SEO extraites, ou null en cas d'erreur
 *
 * @example
 * ```ts
 * const seo = await getSeoFromCpt("concerts", "festival-2024");
 * if (seo) {
 *   console.log(seo.title);
 *   console.log(seo.description);
 * }
 * ```
 */
export async function getSeoFromCpt(postType: string, slug: string): Promise<SeoMetadata | null> {
    const wordpressUrl = buildCptUrl(postType, slug);
    return fetchSeoMetadata(wordpressUrl);
}