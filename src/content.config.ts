import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const feed = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/feed' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Private Reads'),
    type: z.enum(['Research', 'Engineering', 'Talk', 'Announcement', 'Update', 'Monthly Update']).default('Update'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Optional talk-specific fields
    event: z.string().optional(),
    video: z.string().optional(),
    slides: z.string().optional(),
  }),
});

export const collections = { feed };
