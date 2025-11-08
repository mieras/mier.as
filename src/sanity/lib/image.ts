import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity-client'
import type { SanityImage } from '../types'

const builder = imageUrlBuilder(client)

/**
 * Generate optimized image URL from Sanity image source
 * Automatically applies format optimization and prevents upscaling
 */
export function urlForImage(source: SanityImage | null | undefined) {
  if (!source?.asset) return null
  return builder.image(source)
    .auto('format')  // Automatische format selectie (WebP/AVIF wanneer ondersteund)
    .fit('max')      // Voorkomt opschalen van kleine afbeeldingen
}