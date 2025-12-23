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
import teamBlock from './blocks/teamBlock';
import servicesBlock from './blocks/servicesBlock';
import clientsBlock from './blocks/clientsBlock';

// Documents
import page from './documents/page';
import work from './documents/work';
import client from './documents/_client';
import service from './documents/_service';
import teamMember from './documents/_teamMember';
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
  teamBlock,
  servicesBlock,
  clientsBlock,

  // Documents
  page,
  work,
  client, // Used as reference in work document
  service, // Used as reference in work and servicesBlock
  teamMember, // Used as reference in teamBlock
  // career, // Not used as reference
  photography,
  siteSettings, // Always last
];
