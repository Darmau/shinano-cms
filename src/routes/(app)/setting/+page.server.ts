import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';


export const load: PageServerLoad = async () => {
  const { data } = await supabase
      .from("language")
      .select();
  return {
    languages: data ?? [{lang: 'zh-CN', locale: '简体中文'}, {lang: 'jp', locale: '日本'}],
  }
}
