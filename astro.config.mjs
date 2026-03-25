// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://0xalizk.github.io',
  base: '/privreads.ethereum.org',
  integrations: [mdx(), sitemap()],
});
