import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({locals: {supabase}}) => {
  const { data } = await supabase
      .from("language")
      .select("lang, locale, is_default")
      .order("is_default", {ascending: false});
  return {
    languages: data ?? [{lang: 'zh-CN', locale: '简体中文'}, {lang: 'jp', locale: '日本'}],
  }
}
