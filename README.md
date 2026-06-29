# renozans-schumman-mobile

Schumann Rezonansı mobil uygulaması — **Expo (React Native) + TypeScript**.
NOAA jeomanyetik Kp verisini gösterir; üyelik/auth + premium + bildirimler için
[backend](https://github.com/bahacan112/renozans-schumman) ile konuşur.

## Gereksinimler
- Node 20+ (proje Node 24 ile geliştirildi)
- Android Studio + Android SDK (cihaz/emülatör için)
- Bir Android cihaz (USB hata ayıklama açık) veya emülatör

## Kurulum & Çalıştırma
```bash
npm install
npx expo run:android      # native dev build üretir + cihaza kurar
```
> `expo start` (Expo Go) **yetmez** — native modüller var (Google Sign-In). Mutlaka
> `expo run:android` ile dev build alın. İlk build birkaç dakika sürer.

USB cihazda backend'e erişim için (backend lokalde çalışıyorsa):
```bash
adb reverse tcp:8081 tcp:8081   # Metro
adb reverse tcp:4000 tcp:4000   # backend API
```

## Backend bağlantısı
API adresi [src/api/client.ts](src/api/client.ts) içinde `API_BASE` — canlı backend'e
bağlı: **`https://renozans-backend.baha.tr`**. İnternet üzerinden çalışır, API için
adb reverse gerekmez. Lokal backend'le geliştirme yapacaksanız `http://localhost:4000`
yapıp USB cihazda `adb reverse tcp:4000 tcp:4000` çalıştırın.

## ⚠️ Google ile giriş (her geliştirici için)
Google Sign-In, build'i imzalayan **debug keystore'un SHA-1'ine** bağlıdır.
`android/` klasörü repoya dahil **değildir** (her klonlamada yeniden üretilir), bu
yüzden **her geliştiricinin kendi debug SHA-1'i farklıdır**. Google girişinin sizde
de çalışması için kendi SHA-1'inizi proje sahibine iletin; o, Google Cloud Console'daki
Android OAuth client'a eklesin. SHA-1'inizi almak için:
```bash
keytool -list -v -keystore android/app/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android | grep SHA1
```
> Google girişini hiç kullanmayacaksanız e-posta/şifre ile giriş herkeste sorunsuz çalışır.

## Proje yapısı
```
App.tsx                  # kök: fontlar → provider'lar → auth kapısı
src/screens/             # AuthScreen, MainScreen
src/auth/                # AuthContext (JWT, AsyncStorage)
src/api/client.ts        # backend API istemcisi
src/components/          # Starfield, Spectrogram, TrendChart, StatusCard, ...
src/data.ts, kp.ts       # NOAA çekme + Kp yorumları
```
