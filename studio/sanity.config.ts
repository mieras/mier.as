import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { linkField } from 'sanity-plugin-link-field';
import seofields from 'sanity-plugin-seofields';
import { schemaTypes } from './schemas';

// Load environment variables
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'production';

if (!projectId) {
  throw new Error(
    'Missing Sanity project ID. Please set SANITY_STUDIO_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID environment variable.',
  );
}

export default defineConfig({
  name: 'mier-as',
  title: 'Mier.as',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool(),
    linkField({
      linkableSchemaTypes: ['page', 'work'],
    }),
    seofields({
      seoPreview: true,
      fieldVisibility: {
        page: {
          hiddenFields: ['openGraphSiteName', 'twitterSite'],
        },
        work: {
          hiddenFields: ['openGraphSiteName', 'twitterSite'],
        },
        career: {
          hiddenFields: ['openGraphSiteName', 'twitterSite'],
        },
        siteSettings: {
          hiddenFields: [
            'title',
            'description',
            'canonicalUrl',
            'metaImage',
            'keywords',
            'openGraphUrl',
            'openGraphTitle',
            'openGraphDescription',
            'openGraphType',
            'openGraphImageType',
            'openGraphImage',
            'openGraphImageUrl',
            'twitterCard',
            'twitterCreator',
            'twitterTitle',
            'twitterDescription',
            'twitterImageType',
            'twitterImage',
            'twitterImageUrl',
            'robots',
            'metaAttributes',
          ],
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
