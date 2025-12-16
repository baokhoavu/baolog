import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

let clientInstance = null;
const HAS_CONFIG = !!process.env.SANITY_PROJECT_ID;

export function getClient() {
  if (!HAS_CONFIG) return null;
  if (clientInstance) return clientInstance;
  clientInstance = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2023-10-10',
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_READ_TOKEN || undefined,
  });
  return clientInstance;
}

export function urlFor(source) {
  const client = getClient();
  if (!client || !source) return { url: () => null };
  const builder = imageUrlBuilder(client);
  return builder.image(source);
}

export default getClient;
