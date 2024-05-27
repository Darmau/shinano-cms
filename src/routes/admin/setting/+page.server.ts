import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
  depends('supabase:db:language');
  const { data } = await supabase
      .from("language")
      .select("lang, locale, is_default")
      .order("is_default", {ascending: false});
  return {
    languages: data ?? [],
  }
}
