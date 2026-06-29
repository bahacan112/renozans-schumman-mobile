/**
 * Section 7 — Resonance guide accordion + analysis card.
 */
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { COLORS, FONTS } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GUIDE = [
  {
    h: 'Planetary K-Index (Kp Endeksi) Nedir?',
    p: "Dünya genelindeki manyetometre ölçüm istasyonlarından gelen verilerin birleştirilmesiyle oluşturulan ve gezegenimizin manyetik alanındaki düzensizlikleri 0 ile 9 arasında ölçen resmi bir küresel endekstir. Kp değerinin 5 ve üzeri olması, küresel çapta bir Jeomanyetik Fırtına durumunu gösterir.",
  },
  {
    h: 'Küresel Fırtına vs. Yerel Atmosferik Gürültü:',
    p: 'Bölgesel tekil anten grafikleri (Sibirya vb.), o bölgedeki yerel yıldırımlar veya elektrik gürültüleri sebebiyle yüksek beyaz patlamalar gösterebilir. Ancak bu yerel olaylar küresel insan biyolojisini etkilemez. Sistemimizdeki küresel Kp endeksi ise yerel gürültüleri filtreleyerek sadece Dünya\'yı ve insan biyo-alanını doğrudan etkileyen gerçek jeomanyetik güneş fırtınası hareketlerini gösterir.',
  },
  {
    h: 'Güneş Fırtınası ve Biyolojik Etkiler:',
    p: "Dünya'nın manyetik alanı ile insan kalp ritmi, sinir sistemi dengesi ve melatonin salgısı doğrudan senkronizedir. Kp endeksinin yükseldiği günlerde baş ağrısı, yorgunluk, rüyalarda berraklık veya uyku bozuklukları gibi kozmik adaptasyon semptomları yaşanması oldukça yaygındır.",
  },
  {
    h: 'Kozmik Hava Tahmini: Gelecek 24 Saat Nasıl Hesaplanır?',
    p: 'Dünya ile Güneş arasındaki (L1 noktasındaki) DSCOVR ve ACE uzay uyduları, Güneş patlamasıyla fırlayan parçacıkları yola çıktığı an ölçer. Bu parçacıkların Dünya\'ya ulaşması 15 saat ile 3 gün sürer. Sistemimiz, uyduların yolda yakaladığı bu verileri işleyerek henüz gezegenimize ulaşmamış kozmik bilgi paketçiklerini saatlik modellemeler halinde önceden sunar.',
  },
];

export function AnalysisCard({ text }: { text: string }) {
  return (
    <View style={[styles.card, { borderColor: 'rgba(212,175,55,0.15)' }]}>
      <Text style={styles.analysisTitle}>Jeomanyetik Enerji Analizi</Text>
      <Text style={styles.analysisBody}>{text}</Text>
    </View>
  );
}

export default function GuideAccordion() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View style={[styles.card, { padding: 0 }]}>
      <TouchableOpacity style={styles.accHeader} onPress={toggle} activeOpacity={0.8}>
        <View style={styles.accTitleRow}>
          <Text style={styles.infoIcon}>ⓘ</Text>
          <Text style={styles.accTitle}>Jeomanyetik Rezonans Kılavuzu</Text>
        </View>
        <Text style={[styles.arrow, open && { color: COLORS.primaryGold }]}>
          {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.accContent}>
          {GUIDE.map((g, i) => (
            <View key={i}>
              <Text style={styles.guideH}>{g.h}</Text>
              <Text style={styles.guideP}>{g.p}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 20,
    padding: 16,
  },
  analysisTitle: { fontFamily: FONTS.sansBold, fontSize: 13, color: COLORS.primaryGold, marginBottom: 8 },
  analysisBody: { fontFamily: FONTS.sans, fontSize: 11, color: '#fff', lineHeight: 17 },
  accHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: { fontSize: 16, color: COLORS.primaryGold },
  accTitle: { fontFamily: FONTS.sansBold, fontSize: 13, color: '#fff' },
  arrow: { fontSize: 12, color: COLORS.textMuted },
  accContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    gap: 12,
    paddingTop: 12,
  },
  guideH: { fontFamily: FONTS.sansBold, fontSize: 11, color: COLORS.primaryGold },
  guideP: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, lineHeight: 14, marginTop: 3 },
});
