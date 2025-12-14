import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default async function getHutbeler() {
  try {
    const res = await axios.get('https://diyanet.gov.tr/arsiv/hutbeler/rss');
    const xml = res.data;
    const parsed = await parseStringPromise(xml);
    // RSS format: parsed.rss.channel[0].item
    return (parsed.rss.channel[0].item || []).map((item, idx) => ({
      id: idx,
      title: item.title[0],
      content: item.description[0],
      link: item.link[0],
      date: item.pubDate[0],
    }));
  } catch (e) {
    throw new Error('Hutbeler alınırken hata oluştu');
  }
}
