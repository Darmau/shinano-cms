import type { PageServerLoad } from './$types';
import { API } from '$env/static/private';

export const load: PageServerLoad = async () => {
  const [languages, oss, map] = await Promise.all([
      fetch(`${API}/language/all`).then(res => res.json()),
      fetch(`${API}/config/storage`).then(res => res.json()),
      fetch(`${API}/config/map`).then(res => res.json())
      ]);
  return {
    languages,
    oss,
    map
  }
}
