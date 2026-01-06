// Supabase integration removed. Export a safe noop `supabase` placeholder
// so that any leftover imports do not break the build until files are migrated.

export const supabase: any = {
  from: () => ({ select: async () => ({ data: [], error: null }) }),
  channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
  removeChannel: () => {},
};