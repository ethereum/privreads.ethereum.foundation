// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ethereum.github.io',
  base: '/privreads.ethereum.foundation',
  integrations: [mdx(), sitemap()],
});
