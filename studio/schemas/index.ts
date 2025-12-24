// Objects
import slide from './objects/slide';

// Blocks
import textBlock from './blocks/textBlock';
import imageBlock from './blocks/imageBlock';
import videoBlock from './blocks/videoBlock';
import embedBlock from './blocks/embedBlock';
import testimonialBlock from './blocks/testimonialBlock';
import columnsBlock from './blocks/columnsBlock';
import colorBlock from './blocks/colorBlock';
import galleryBlock from './blocks/galleryBlock';
import carouselBlock from './blocks/carouselBlock';
import textGridBlock from './blocks/textGridBlock';
import clientsBlock from './blocks/clientsBlock';

// Documents
import page from './documents/page';
import work from './documents/work';
import client from './documents/_client';
// import career from './documents/_career'; // Not used as reference
import siteSettings from './documents/siteSettings';
import photography from './documents/photography';

export const schemaTypes = [
  // Objects
  slide,

  // Blocks
  textBlock,
  imageBlock,
  videoBlock,
  embedBlock,
  testimonialBlock,
  columnsBlock,
  colorBlock,
  galleryBlock,
  carouselBlock,
  textGridBlock,
  clientsBlock,

  // Documents
  page,
  work,
  client, // Used as reference in work document
  // career, // Not used as reference
  photography,
  siteSettings, // Always last
];
