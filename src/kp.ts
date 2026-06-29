/**
 * Kp index spiritual interpretation + time formatting.
 * Ported verbatim from app.js getKpSpiritualDetails / formatTime / formatTimeRange.
 */
import { KP_COLORS } from './theme';

export type KpDetails = {
  label: string;
  spiritual: string;
  desc: string;
  color: string;
};

export function getKpSpiritualDetails(kp: number): KpDetails {
  if (kp < 3) {
    return {
      label: 'Dengeli Akış (Sakin)',
      spiritual: 'Dengeli Enerji Akışı & Topraklama',
      desc: 'Manyetik alan oldukça dingin ve dengeli. İç gözlem, zihinsel odaklanma, derin gevşeme ve kök çakra topraklama çalışmaları için mükemmel bir zemin. Zihnin gürültüsünü yatıştırmak ve sessizlik meditasyonları yapmak için ideal bir dönem.',
      color: KP_COLORS.quiet,
    };
  } else if (kp < 4) {
    return {
      label: 'Enerjisel Kıpırdanma',
      spiritual: 'Yenilenme ve Hafif Duyarlılık',
      desc: 'Elektromanyetik alanda hafif bir uyanış ve hareketlilik var. Aura alanında genişleme ve hafif bir duyarlılık hissedilebilir. Prana akışını dengeleyici nefes egzersizleri ve hafif esneme hareketleri için harika bir zaman dilimi.',
      color: KP_COLORS.unsettled,
    };
  } else if (kp < 5) {
    return {
      label: 'Yüksek Titreşim (Aktif)',
      spiritual: 'Yüksek Sezgi ve Hücresel Uyanış',
      desc: 'Aktif bir manyetik alan mevcut. Bilinçaltı kapıları aralanıyor; rüyaların berraklaşması, sezgilerin ve psişik duyarlılığın güçlenmesi olasıdır. Üçüncü göz çalışmaları, rüya günlükleri tutma ve durugörü meditasyonları için çok elverişli bir süreç.',
      color: KP_COLORS.active,
    };
  } else if (kp < 6) {
    return {
      label: 'Işık Kapısı (G1 Manyetik Aktivite)',
      spiritual: 'DNA Aktivasyonu & Evrensel Bilgi Akışı',
      desc: "Güneş'ten gelen yüksek frekanslı kozmik bilgi paketlerinin iyonosfere ulaştığı özel bir uyanış penceresi. Zihinde uykusuzluk veya fiziksel duyarlılık olarak yansıyan bu etki, aslında derin çakra çalışmaları, DNA aktivasyonu meditasyonları ve yüksek benlikle bağ kurmak için olağanüstü bir fırsattır.",
      color: KP_COLORS.storm,
    };
  } else if (kp < 7) {
    return {
      label: 'Kozmik Entegrasyon (G2 Manyetik Aktivite)',
      spiritual: 'Işık Beden Aktivasyonu & Uyumlanma',
      desc: 'Orta şiddette manyetik uyarım. Evrensel enerjinin hücresel düzeyde entegrasyonu gerçekleşiyor. Işık beden aktivasyonu, DNA şablonunun güncellenmesi ve yüksek boyutlu frekanslara uyumlanmak için bu zaman dilimini niyet çalışmaları ve sessiz tefekkür ile değerlendirebilirsiniz.',
      color: KP_COLORS.storm,
    };
  } else if (kp < 8) {
    return {
      label: 'Portal Geçişi (G3 Manyetik Aktivite)',
      spiritual: 'Yoğun Işık Kodları & Çakra Dengeleme',
      desc: 'Güçlü bir manyetik aktivite dalgası. Aura alanınız yoğun kozmik ışık kodlarıyla yıkanıyor. Duygusal dalgalanmalar ve uykuya dalışta zorlanmalar, eski kalıpların salınımına işaret eder. Çakra dengeleme, kalp kapısını açma ve kristal şifa meditasyonları için zirve noktası.',
      color: KP_COLORS.portal,
    };
  } else if (kp < 9) {
    return {
      label: 'Hücresel Dönüşüm (G4 Manyetik Aktivite)',
      spiritual: 'Yüksek Boyutlu Frekans Uyumu',
      desc: 'Şiddetli manyetik uyarım ve kozmik akış. Hücreleriniz ve DNA iplikçikleriniz yüksek güneş kodlarını soğuruyor. Bu yoğun enerji altında kendinizi zorlamadan sessizce uzanarak meditasyon yapabilir, aura temizliği ve uyanış niyetlerinize odaklanarak kozmik akışla bütünleşebilirsiniz.',
      color: KP_COLORS.portal,
    };
  } else {
    return {
      label: 'Ekstrem Kozmik Portal (G5)',
      spiritual: 'Kolektif Bilinçte Muazzam Vites Değişimi',
      desc: 'Zirve seviyede elektromanyetik uyanış ve ışık portalı! Kolektif bilinçte muazzam bir vites değişimi. Bu olağanüstü kozmik akışı sessizce oturup taç ve kalp çakralarınızdan tüm bedeninize akan beyaz ışığı imgeleyerek, derin frekans meditasyonları ve DNA aktivasyon niyetleriyle taçlandırın.',
      color: KP_COLORS.extreme,
    };
  }
}

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

const pad = (n: number) => String(n).padStart(2, '0');

export function formatTime(timeStr: string): string {
  try {
    const d = new Date(timeStr);
    return `${DAY_NAMES[d.getDay()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return timeStr;
  }
}

export function formatTimeRange(timeStr: string): string {
  try {
    const dStart = new Date(timeStr);
    const dEnd = new Date(dStart.getTime() + 3 * 60 * 60 * 1000);

    const startDay = DAY_NAMES[dStart.getDay()];
    const startHours = pad(dStart.getHours());
    const endDay = DAY_NAMES[dEnd.getDay()];
    const endHours = pad(dEnd.getHours());

    if (startDay !== endDay) {
      return `${startDay} ${startHours}:00 - ${endDay} ${endHours}:00`;
    }
    return `${startDay} ${startHours}:00 - ${endHours}:00`;
  } catch {
    return timeStr;
  }
}
