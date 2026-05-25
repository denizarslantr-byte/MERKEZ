# Production Güvenlik Notları

Bu sürümde merkez-1.2 ana temel korunmuştur ve V10/V10-merged tarafındaki uygun geliştirmeler cherry-pick edilmiştir.

## Yapılanlar

1. Firebase anonim giriş varsayılan olarak kapatıldı.
2. Firebase e-posta/şifre oturumu için `signInWithEmailAndPassword` desteği eklendi.
3. Admin PIN artık yeni kayıtlarda `sha256$...` formatında hash olarak saklanır.
4. Eski düz metin PIN ile geriye uyumluluk korunur; PIN değiştirildiğinde hash'e dönüşür.
5. PIN hatırlama/localStorage düz metin saklama kapatıldı.
6. `config/config.js` içindeki sabit API key kaldırıldı; `window.PIANO_API_KEY` üzerinden verilmesi önerildi.
7. Merkez, bölgeci, region, hotel, boss ve patron ekranlarında polling yerine `listenReservations()` realtime akışı bağlandı.
8. `cleanupOldBackups(7)` korunmuştur.
9. Geniş `sanitizeRez()` alan temizliği korunmuştur.

## Firebase Auth Kullanımı

Üretimde anonim auth açılmamalıdır. Test için `config/firebase.js` içine şu değer konulabilir:

```js
const FIREBASE_ALLOW_ANONYMOUS_AUTH = true;
```

Üretimde bu değer false kalmalı ve kullanıcılar Firebase Authentication e-posta/şifre sistemiyle giriş yapmalıdır.

## Kalan Kritik İş

Statik HTML projelerinde gerçek environment variable doğrudan çalışmaz. Bu yüzden API anahtarı ya hosting build aşamasında enjekte edilmeli ya da backend proxy üzerinden saklanmalıdır.
