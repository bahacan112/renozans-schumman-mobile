/**
 * NOAA Planetary K-index fetch with high-fidelity offline mock fallback.
 * Ported from app.js fetchSchumannData / generateMockData.
 */
import { getKpSpiritualDetails } from './kp';

export type HistoryPoint = {
  time: string;
  kp: number;
  predicted: boolean;
};

export type SchumannData = {
  current_kp: number;
  updated_at: string;
  history: HistoryPoint[];
};

const NOAA_URL =
  'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json';

// Generate premium simulated data in case of offline / CORS / network failure.
export function generateMockData(): SchumannData {
  const now = new Date();
  const history: HistoryPoint[] = [];

  // 24 three-hourly blocks spanning 72h: 16 observed + 8 predicted.
  for (let idx = 0; idx < 24; idx++) {
    const timeTag = new Date(now.getTime() + (idx - 15) * 3 * 60 * 60 * 1000);

    let baseKp = 1.5 + Math.sin(idx * 0.5) * 1.2 + Math.cos(idx * 0.8) * 0.8;
    if (idx === 12 || idx === 13) baseKp += 2.5; // brief past burst

    const kpVal = Math.max(0.3, Math.min(8.7, baseKp));

    history.push({
      time: timeTag.toISOString(),
      kp: Math.round(kpVal * 100) / 100,
      predicted: idx > 15,
    });
  }

  const currentKp = history[15].kp;
  return {
    current_kp: currentKp,
    updated_at: history[15].time,
    history,
  };
}

type NoaaRow = { time_tag: string; kp: string | number; observed?: string };

const withZ = (t: string) => (t.endsWith('Z') ? t : t + 'Z');

export async function fetchSchumannData(): Promise<SchumannData> {
  try {
    const response = await fetch(NOAA_URL);
    if (!response.ok) throw new Error('NOAA Server error');
    const list: any[] = await response.json();

    // The endpoint may return a header row array first; keep object rows only.
    const cleanList: NoaaRow[] = list.filter(
      (item) => !Array.isArray(item) && item.kp !== undefined
    );

    const now = Date.now();
    let lastObservedIndex = -1;
    for (let i = cleanList.length - 1; i >= 0; i--) {
      const itemTime = new Date(withZ(cleanList[i].time_tag)).getTime();
      if (
        (cleanList[i].observed === 'observed' ||
          cleanList[i].observed === 'estimated') &&
        itemTime <= now
      ) {
        lastObservedIndex = i;
        break;
      }
    }

    let past: NoaaRow[] = [];
    let future: NoaaRow[] = [];
    let currentKp = 0;
    let lastReadingTime = '';

    if (lastObservedIndex !== -1) {
      const startIdx = Math.max(0, lastObservedIndex - 15);
      past = cleanList.slice(startIdx, lastObservedIndex + 1);
      future = cleanList.slice(lastObservedIndex + 1, lastObservedIndex + 9);
      currentKp = parseFloat(String(cleanList[lastObservedIndex].kp));
      lastReadingTime = withZ(cleanList[lastObservedIndex].time_tag);
    } else {
      past = cleanList.slice(-24);
      currentKp = parseFloat(String(cleanList[cleanList.length - 1].kp));
      lastReadingTime = withZ(cleanList[cleanList.length - 1].time_tag);
    }

    const history: HistoryPoint[] = [
      ...past.map((item) => ({
        time: withZ(item.time_tag),
        kp: parseFloat(String(item.kp)),
        predicted: false,
      })),
      ...future.map((item) => ({
        time: withZ(item.time_tag),
        kp: parseFloat(String(item.kp)),
        predicted: true,
      })),
    ];

    return { current_kp: currentKp, updated_at: lastReadingTime, history };
  } catch (error) {
    console.warn(
      'NOAA API request failed. Using high-fidelity offline mock pipeline.',
      error
    );
    return generateMockData();
  }
}

// Re-export for convenience
export { getKpSpiritualDetails };
