import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, X, Heart, Moon, Sun, Clock, User, Sparkles, Loader2, ChefHat, Dices, UtensilsCrossed, Volume2, VolumeX, Play } from 'lucide-react';

// --- GEMINI API AYARLARI ---
// NOT: Kendi API Key'ini buraya yapıştır. GitHub'a atarken boş bırakıp Vercel ayarlarından da ekleyebilirsin.
const apiKey = ""; 

// --- MALZEME LİSTESİ ---
const commonIngredients = [
  { id: 'sogan', name: 'Soğan', icon: '🧅' },
  { id: 'patates', name: 'Patates', icon: '🥔' },
  { id: 'domates', name: 'Domates', icon: '🍅' },
  { id: 'biber', name: 'Biber', icon: '🫑' },
  { id: 'patlican', name: 'Patlıcan', icon: '🍆' },
  { id: 'kabak', name: 'Kabak', icon: '🥒' },
  { id: 'ispanak', name: 'Ispanak', icon: '🌿' },
  { id: 'pirasa', name: 'Pırasa', icon: '🌱' },
  { id: 'sarimsak', name: 'Sarımsak', icon: '🧄' },
  { id: 'havuc', name: 'Havuç', icon: '🥕' },
  { id: 'limon', name: 'Limon', icon: '🍋' },
  { id: 'yesillik', name: 'Yeşillik', icon: '🥬' },
  { id: 'mercimek', name: 'Mercimek', icon: '🟠' },
  { id: 'yesil_mercimek', name: 'Yeşil Mer.', icon: '🟢' },
  { id: 'nohut', name: 'Nohut', icon: '🟡' },
  { id: 'fasulye', name: 'K. Fasulye', icon: '⚪' },
  { id: 'barbunya', name: 'Barbunya', icon: '🟤' },
  { id: 'pirinc', name: 'Pirinç', icon: '🍚' },
  { id: 'bulgur', name: 'Bulgur', icon: '🌾' },
  { id: 'makarna', name: 'Makarna', icon: '🍝' },
  { id: 'eriste', name: 'Erişte', icon: '🍜' },
  { id: 'kiyma', name: 'Kıyma', icon: '🥩' },
  { id: 'tavuk', name: 'Tavuk', icon: '🍗' },
  { id: 'yumurta', name: 'Yumurta', icon: '🥚' },
  { id: 'yogurt', name: 'Yoğurt', icon: '🥣' },
  { id: 'salca', name: 'Salça', icon: '🥫' },
  { id: 'un', name: 'Un', icon: '🥡' },
  { id: 'peynir', name: 'Peynir', icon: '🧀' },
  { id: 'sut', name: 'Süt', icon: '🥛' },
  { id: 'irmik', name: 'İrmik', icon: '🔸' },
  { id: 'yufka', name: 'Yufka', icon: '🫓' },
];

const categories = [
  { id: 'all', name: 'Hepsi', icon: '🍽️' },
  { id: 'corba', name: 'Çorba', icon: '🥣' },
  { id: 'anayemek', name: 'Ana Yemek', icon: '🥘' },
  { id: 'pilav', name: 'Pilav/Makarna', icon: '🍚' },
  { id: 'zeytinyagli', name: 'Salata/Meze', icon: '🥗' },
  { id: 'kahvalti', name: 'Kahvaltı/Hamur', icon: '🍳' },
  { id: 'tatli', name: 'Tatlı', icon: '🍰' },
];

// --- TARİF LİSTESİ (60 ADET) ---
const initialRecipes = [
  // --- ÇORBALAR (8) ---
  { id: 1, name: "Süzme Mercimek Çorbası", category: 'corba', mainIngredients: ['mercimek', 'sogan', 'havuc', 'patates', 'un'], prepTime: "30 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Lokanta usulü klasik.", tip: "Blenderdan geçirdikten sonra tereyağlı sos dök.", steps: ["Sebzeleri haşla.", "Blenderdan geçir.", "Sosunu dök."] },
  { id: 2, name: "Tarhana Çorbası", category: 'corba', mainIngredients: ['salca', 'sarimsak', 'un'], prepTime: "20 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Anadolu'nun şifası.", tip: "Tarhanayı soğuk suda bekletirsen topaklanmaz.", steps: ["Tarhanayı aç.", "Salçayı kavur.", "Pişir."] },
  { id: 3, name: "Şehriye Çorbası", category: 'corba', mainIngredients: ['domates', 'salca', 'makarna'], prepTime: "15 dk", serves: "4 Kişilik", difficulty: "Çok Kolay", description: "En pratik anne çorbası.", tip: "Limon sıkmayı unutma.", steps: ["Domatesi kavur.", "Su ekle.", "Şehriyeyi at."] },
  { id: 4, name: "Domates Çorbası", category: 'corba', mainIngredients: ['domates', 'un', 'sut', 'salca'], prepTime: "25 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Kaşarlı servis edilir.", tip: "Domatesleri közlersen tadı efsane olur.", steps: ["Unu kavur.", "Domatesi ekle.", "Sütle aç."] },
  { id: 5, name: "Yayla Çorbası", category: 'corba', mainIngredients: ['yogurt', 'pirinc', 'yumurta', 'un'], prepTime: "25 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Naneli yoğurt çorbası.", tip: "Tuzu en son at kesilmesin.", steps: ["Pirinci haşla.", "Terbiyeyi dök.", "Yağ yak."] },
  { id: 6, name: "Ezogelin Çorbası", category: 'corba', mainIngredients: ['mercimek', 'bulgur', 'pirinc', 'salca'], prepTime: "35 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Bol baharatlı ve doyurucu.", tip: "Nane ve pul biberi bol tut.", steps: ["Bakliyatları haşla.", "Sosu ekle.", "Kaynat."] },
  { id: 7, name: "Tavuk Suyu Çorba", category: 'corba', mainIngredients: ['tavuk', 'makarna', 'sarimsak', 'yumurta'], prepTime: "40 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Şifa deposu hasta çorbası.", tip: "Sarımsaklı sirkeli sos yap.", steps: ["Tavuğu haşla.", "Şehriye at.", "Terbiyele."] },
  { id: 8, name: "Yeşil Mercimek Çorbası", category: 'corba', mainIngredients: ['yesil_mercimek', 'eriste', 'salca'], prepTime: "30 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Hem yemek hem çorba.", tip: "Kara suyunu süzmeyi unutma.", steps: ["Mercimeği haşla.", "Erişteyi at.", "Sosu dök."] },
  // --- ANA YEMEKLER (16) ---
  { id: 9, name: "Kuru Fasulye", category: 'anayemek', mainIngredients: ['fasulye', 'salca', 'sogan'], prepTime: "60 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Milli yemeğimiz.", tip: "Şeker at gazını alsın.", steps: ["Fasulyeyi haşla.", "Sosu yap.", "Pişir."] },
  { id: 10, name: "Nohut Yemeği", category: 'anayemek', mainIngredients: ['nohut', 'salca', 'sogan'], prepTime: "50 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Bereketli tencere yemeği.", tip: "Düdüklüde yap lokum olsun.", steps: ["Nohutu haşla.", "Soğanlı sos yap.", "Pişir."] },
  { id: 11, name: "Patates Yemeği", category: 'anayemek', mainIngredients: ['patates', 'sogan', 'salca'], prepTime: "30 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "En basit sulu yemek.", tip: "Az pirinç atarsan suyu kıvamlı olur.", steps: ["Soğanı kavur.", "Patatesi ekle.", "Su koy pişir."] },
  { id: 12, name: "Patates Oturtma", category: 'anayemek', mainIngredients: ['patates', 'kiyma', 'sogan', 'salca'], prepTime: "45 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Kızarmış patatesli ana yemek.", tip: "Patatesi hafif kızart dağılmasın.", steps: ["Patatesi kızart.", "Kıymayı kavur.", "Birleştir pişir."] },
  { id: 13, name: "Taze Fasulye", category: 'anayemek', mainIngredients: ['fasulye', 'domates', 'sogan'], prepTime: "45 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Zeytinyağlıların kralı.", tip: "Kavurma, çiğden koy kendi suyuyla pişir.", steps: ["Hepsini tencereye diz.", "Yağ dök.", "Kısık ateşte pişir."] },
  { id: 14, name: "Karnıyarık", category: 'anayemek', mainIngredients: ['patlican', 'kiyma', 'domates', 'biber', 'sogan'], prepTime: "50 dk", serves: "4 Kişilik", difficulty: "Zor", description: "Patlıcanın en güzel hali.", tip: "Patlıcanın acısını tuzlu suda al.", steps: ["Patlıcanı kızart.", "Harcı doldur.", "Fırınla."] },
  { id: 15, name: "Musakka", category: 'anayemek', mainIngredients: ['patlican', 'kiyma', 'domates', 'biber'], prepTime: "45 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Patlıcan oturtma.", tip: "Patlıcanın yağını havluyla al.", steps: ["Kızart.", "Kıymayı kavur.", "Üst üste pişir."] },
  { id: 16, name: "Kabak Yemeği", category: 'anayemek', mainIngredients: ['kabak', 'pirinc', 'salca', 'yesillik'], prepTime: "25 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Hafif ve pirinçli.", tip: "Dereotu çok yakışır.", steps: ["Soğanı kavur.", "Kabağı ekle.", "Pirinçle pişir."] },
  { id: 17, name: "Pırasa Yemeği", category: 'anayemek', mainIngredients: ['pirasa', 'havuc', 'pirinc', 'limon'], prepTime: "30 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Limonlu kış yemeği.", tip: "Pişerken içine biraz portakal suyu sık.", steps: ["Havucu kavur.", "Pırasayı ekle.", "Pirinçle pişir."] },
  { id: 18, name: "Kıymalı Patates", category: 'anayemek', mainIngredients: ['patates', 'kiyma', 'sogan'], prepTime: "35 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Az kıymayla lezzet şöleni.", tip: "Kıymayı suyunu çekene kadar kavur.", steps: ["Kıymayı kavur.", "Patatesi at.", "Pişir."] },
  { id: 19, name: "Ispanak Yemeği", category: 'anayemek', mainIngredients: ['ispanak', 'sogan', 'salca', 'pirinc'], prepTime: "25 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Temel Reis yemeği.", tip: "Çok öldürmeden pişir.", steps: ["Soğanı kavur.", "Ispanağı ekle.", "Pirinç at."] },
  { id: 20, name: "Türlü", category: 'anayemek', mainIngredients: ['patlican', 'patates', 'fasulye', 'biber', 'domates'], prepTime: "45 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Evde ne varsa.", tip: "Sert sebzeleri alta koy.", steps: ["Doğra.", "Diz.", "Pişir."] },
  { id: 21, name: "Biber Dolması", category: 'anayemek', mainIngredients: ['biber', 'pirinc', 'kiyma', 'domates', 'sogan'], prepTime: "45 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Klasik dolma.", tip: "Kapağına domates koy.", steps: ["İçi hazırla.", "Doldur.", "Pişir."] },
  { id: 22, name: "İzmir Köfte", category: 'anayemek', mainIngredients: ['kiyma', 'patates', 'biber', 'domates'], prepTime: "50 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Fırında köfte patates.", tip: "Köfteleri hafif kızartıp fırınla.", steps: ["Köfte yap.", "Tepsiye diz.", "Sosu dök fırınla."] },
  { id: 23, name: "Tavuk Sote", category: 'anayemek', mainIngredients: ['tavuk', 'biber', 'domates', 'sogan'], prepTime: "25 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Pratik protein.", tip: "Tavayı iyice ısıt mühürle.", steps: ["Tavuğu sotele.", "Sebzeyi ekle.", "Baharatla."] },
  { id: 24, name: "Tavuk Haşlama", category: 'anayemek', mainIngredients: ['tavuk', 'patates', 'havuc', 'sogan'], prepTime: "45 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Sebzeli tavuk suyu.", tip: "Defne yaprağı at.", steps: ["Hepsini tencereye at.", "Suyu koy.", "Pişir."] },
  // --- PİLAV & MAKARNA (7) ---
  { id: 25, name: "Şehriyeli Pirinç Pilavı", category: 'pilav', mainIngredients: ['pirinc', 'tavuk'], prepTime: "20 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Tane tane dökülen.", tip: "Pirinci sıcak suda beklet.", steps: ["Şehriyeyi kavur.", "Pirinci kavur.", "Demle."] },
  { id: 26, name: "Domatesli Bulgur Pilavı", category: 'pilav', mainIngredients: ['bulgur', 'domates', 'biber', 'sogan'], prepTime: "25 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Meyhane pilavı.", tip: "Demlenirken havlu koy.", steps: ["Sebzeyi kavur.", "Bulguru at.", "Pişir."] },
  { id: 27, name: "Salçalı Makarna", category: 'pilav', mainIngredients: ['makarna', 'salca'], prepTime: "15 dk", serves: "2 Kişilik", difficulty: "Çok Kolay", description: "Öğrenci evi klasiği.", tip: "Haşlama suyundan sosa ekle.", steps: ["Haşla.", "Sosu yap.", "Karıştır."] },
  { id: 28, name: "Yoğurtlu Makarna", category: 'pilav', mainIngredients: ['makarna', 'yogurt', 'sarimsak'], prepTime: "15 dk", serves: "2 Kişilik", difficulty: "Çok Kolay", description: "Soğuk makarna.", tip: "Üzerine naneli yağ yak.", steps: ["Haşla soğut.", "Yoğurtla.", "Yağ dök."] },
  { id: 29, name: "Fırın Makarna", category: 'pilav', mainIngredients: ['makarna', 'yogurt', 'yumurta', 'peynir'], prepTime: "40 dk", serves: "6 Kişilik", difficulty: "Orta", description: "Börek tadında.", tip: "Üstü kızarana kadar pişir.", steps: ["Haşla.", "Sosu karıştır.", "Fırınla."] },
  { id: 30, name: "Erişte (Cevizli/Peynirli)", category: 'pilav', mainIngredients: ['eriste', 'peynir'], prepTime: "15 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Ev yapımı makarna.", tip: "Tereyağını bol tut.", steps: ["Haşla.", "Yağla.", "Peynirle."] },
  { id: 31, name: "Kuskus Pilavı", category: 'pilav', mainIngredients: ['makarna', 'salca'], prepTime: "20 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Yuvarlak makarna pilavı.", tip: "Pilav gibi demle.", steps: ["Kavur.", "Su ekle.", "Demle."] },
  // --- KAHVALTI & HAMUR (14) ---
  { id: 32, name: "Menemen", category: 'kahvalti', mainIngredients: ['yumurta', 'domates', 'biber'], prepTime: "15 dk", serves: "2 Kişilik", difficulty: "Kolay", description: "Efsane lezzet.", tip: "Yumurtayı çok kurutma.", steps: ["Biberi öldür.", "Domatesi ekle.", "Yumurtayı kır."] },
  { id: 33, name: "Sade Menemen", category: 'kahvalti', mainIngredients: ['yumurta', 'domates'], prepTime: "10 dk", serves: "1 Kişilik", difficulty: "Kolay", description: "Bibersiz hızlı versiyon.", tip: "Bol kekik dök.", steps: ["Domatesi pişir.", "Yumurtayı kır."] },
  { id: 34, name: "Yumurta Kapama", category: 'kahvalti', mainIngredients: ['yumurta'], prepTime: "10 dk", serves: "2 Kişilik", difficulty: "Çok Kolay", description: "Haşlanmış yumurta kızartması.", tip: "Bol pul biber dök.", steps: ["Haşla.", "Yağda çevir."] },
  { id: 35, name: "Soğanlı Yumurta", category: 'kahvalti', mainIngredients: ['sogan', 'yumurta'], prepTime: "15 dk", serves: "1 Kişilik", difficulty: "Kolay", description: "Karamelize soğanla.", tip: "Soğanı yakmadan öldür.", steps: ["Soğanı kavur.", "Yumurtayı kır."] },
  { id: 36, name: "Çılbır", category: 'kahvalti', mainIngredients: ['yumurta', 'yogurt', 'sarimsak'], prepTime: "15 dk", serves: "1 Kişilik", difficulty: "Orta", description: "Yoğurtlu poşe yumurta.", tip: "Suya sirke koy.", steps: ["Suda pişir.", "Yoğurda koy.", "Yağ yak."] },
  { id: 37, name: "Patatesli Yumurta", category: 'kahvalti', mainIngredients: ['patates', 'yumurta'], prepTime: "20 dk", serves: "2 Kişilik", difficulty: "Kolay", description: "Doyurucu kahvaltı.", tip: "Patatesleri küçük doğra.", steps: ["Kızart.", "Yumurtayı kır."] },
  { id: 38, name: "Pişi (Hamur Kızartması)", category: 'kahvalti', mainIngredients: ['un', 'yogurt'], prepTime: "20 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Mayasız şipşak.", tip: "Ele yapışan hamur olsun.", steps: ["Yoğur.", "Şekil ver.", "Kızart."] },
  { id: 39, name: "Krep (Akıtma)", category: 'kahvalti', mainIngredients: ['un', 'sut', 'yumurta'], prepTime: "15 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "İncecik hamur.", tip: "Tavayı az yağla.", steps: ["Çırp.", "Dök.", "Çevir."] },
  { id: 40, name: "Kaşık Dökmesi", category: 'kahvalti', mainIngredients: ['yogurt', 'yumurta', 'un'], prepTime: "15 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Peynirli pankek gibi.", tip: "Koyu kıvamlı olsun.", steps: ["Karıştır.", "Kaşıkla dök.", "Pişir."] },
  { id: 41, name: "Mayasız Poğaça", category: 'kahvalti', mainIngredients: ['un', 'yogurt', 'peynir'], prepTime: "30 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "3-2-1 Poğaça.", tip: "Dereotu ekle.", steps: ["Yoğur.", "Şekil ver.", "Fırınla."] },
  { id: 42, name: "Bazlama", category: 'kahvalti', mainIngredients: ['un', 'yogurt'], prepTime: "30 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Tava ekmeği.", tip: "Sık çevir kabarsın.", steps: ["Yoğur aç.", "Tavada pişir."] },
  { id: 43, name: "Gözleme", category: 'kahvalti', mainIngredients: ['un', 'peynir'], prepTime: "30 dk", serves: "3 Kişilik", difficulty: "Orta", description: "El açması.", tip: "İnce aç.", steps: ["Aç.", "Doldur.", "Pişir."] },
  { id: 44, name: "Ev Pizzası", category: 'kahvalti', mainIngredients: ['un', 'domates', 'biber', 'peynir'], prepTime: "40 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Tepsi pizzası.", tip: "Hamuru çatalla del.", steps: ["Yay.", "Sosu sür.", "Malzemeyi diz pişir."] },
  { id: 45, name: "Sigara Böreği", category: 'kahvalti', mainIngredients: ['yufka', 'peynir'], prepTime: "20 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Çıtır çıtır.", tip: "Ucunu suyla yapıştır açılmasın.", steps: ["Sar.", "Kızart."] },
  // --- SALATA & MEZE (8) ---
  { id: 46, name: "Kısır", category: 'zeytinyagli', mainIngredients: ['bulgur', 'salca', 'yesillik', 'limon'], prepTime: "20 dk", serves: "5 Kişilik", difficulty: "Kolay", description: "Günlerin kraliçesi.", tip: "Ekşisi bol olsun.", steps: ["Bulguru şişir.", "Sosu yedir.", "Yeşillik ekle."] },
  { id: 47, name: "Mercimek Köftesi", category: 'zeytinyagli', mainIngredients: ['mercimek', 'bulgur', 'salca', 'sogan'], prepTime: "40 dk", serves: "6 Kişilik", difficulty: "Orta", description: "Favori ikramlık.", tip: "Yeşilliği soğuyunca koy.", steps: ["Haşla.", "Yoğur.", "Şekil ver."] },
  { id: 48, name: "Patates Salatası", category: 'zeytinyagli', mainIngredients: ['patates', 'yesillik', 'sogan', 'limon'], prepTime: "25 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "En klasik salata.", tip: "Ilıkken sosla.", steps: ["Haşla.", "Doğra.", "Sosla."] },
  { id: 49, name: "Yoğurtlu Makarna Salatası", category: 'zeytinyagli', mainIngredients: ['makarna', 'yogurt', 'yesillik', 'havuc'], prepTime: "20 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Garnitürlü salata.", tip: "Biraz mayonez ekle.", steps: ["Haşla.", "Karıştır."] },
  { id: 50, name: "Havuç Tarator", category: 'zeytinyagli', mainIngredients: ['havuc', 'yogurt', 'sarimsak'], prepTime: "15 dk", serves: "2 Kişilik", difficulty: "Kolay", description: "Pratik meze.", tip: "Havuçları iyice öldür.", steps: ["Rendele kavur.", "Yoğurtla."] },
  { id: 51, name: "Mevsim Salata", category: 'zeytinyagli', mainIngredients: ['yesillik', 'havuc', 'limon', 'domates'], prepTime: "10 dk", serves: "2 Kişilik", difficulty: "Çok Kolay", description: "Vitamin deposu.", tip: "Sosunu yerkene dök.", steps: ["Doğra.", "Karıştır."] },
  { id: 52, name: "Piyaz", category: 'zeytinyagli', mainIngredients: ['fasulye', 'sogan', 'limon', 'yumurta'], prepTime: "15 dk", serves: "2 Kişilik", difficulty: "Kolay", description: "Köfte yanına.", tip: "Sirke koy.", steps: ["Haşla.", "Soğanla.", "Süsle."] },
  { id: 53, name: "Barbunya Pilaki", category: 'zeytinyagli', mainIngredients: ['barbunya', 'havuc', 'patates', 'sogan'], prepTime: "40 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Soğuk yenen zeytinyağlı.", tip: "Şeker at.", steps: ["Haşla.", "Sebzeyle pişir.", "Soğut."] },
  // --- TATLILAR (7) ---
  { id: 54, name: "İrmik Helvası", category: 'tatli', mainIngredients: ['irmik', 'sut', 'un'], prepTime: "30 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Klasik helva.", tip: "Sabırla kavur.", steps: ["Şerbeti yap.", "Kavur.", "Demle."] },
  { id: 55, name: "Un Helvası", category: 'tatli', mainIngredients: ['un', 'sut'], prepTime: "20 dk", serves: "4 Kişilik", difficulty: "Orta", description: "Az malzemeli tatlı.", tip: "Rengi koyulaşana kadar kavur.", steps: ["Şerbeti yap.", "Kavur.", "Birleştir."] },
  { id: 56, name: "Sütlaç", category: 'tatli', mainIngredients: ['sut', 'pirinc'], prepTime: "40 dk", serves: "4 Kişilik", difficulty: "Kolay", description: "Anne sütlacı.", tip: "Nişastasını iyi ayarla.", steps: ["Pirinci haşla.", "Sütle kaynat."] },
  { id: 57, name: "Mozaik Pasta", category: 'tatli', mainIngredients: ['sut', 'un'], prepTime: "15 dk", serves: "6 Kişilik", difficulty: "Çok Kolay", description: "Bisküvili pasta.", tip: "Dondurucuda beklet.", steps: ["Sosu yap.", "Bisküviyi kır.", "Dondur."] },
  { id: 58, name: "Revani", category: 'tatli', mainIngredients: ['irmik', 'yumurta', 'un', 'yogurt'], prepTime: "45 dk", serves: "8 Kişilik", difficulty: "Orta", description: "Şerbetli kek.", tip: "Kek sıcak şerbet soğuk olsun.", steps: ["Çırp pişir.", "Şerbetle."] },
  { id: 59, name: "Kakaolu Kek", category: 'tatli', mainIngredients: ['un', 'yumurta', 'sut'], prepTime: "40 dk", serves: "8 Kişilik", difficulty: "Kolay", description: "Çay saati klasiği.", tip: "Fırını açma.", steps: ["Çırp.", "Pişir."] },
  { id: 60, name: "Pankek", category: 'tatli', mainIngredients: ['un', 'sut', 'yumurta'], prepTime: "20 dk", serves: "3 Kişilik", difficulty: "Kolay", description: "Mini krep.", tip: "Göz göz olunca çevir.", steps: ["Çırp.", "Pişir."] }
];

// --- SES MOTORU (WEB AUDIO API) ---
class SoundEngine {
  constructor() {
    this.context = null;
    this.drumInterval = null;
  }

  init() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  playStartup() {
    this.init();
    if (!this.context) return;
    const now = this.context.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.5);
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.5);
    });
  }

  playDing() {
    this.init();
    if (!this.context) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.8);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  playDrumRoll() {
    this.init();
    if (!this.context) return;
    const playSnare = () => {
      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    };
    this.drumInterval = setInterval(playSnare, 90);
  }

  stopDrumRoll() {
    if (this.drumInterval) {
      clearInterval(this.drumInterval);
      this.drumInterval = null;
    }
  }
}

// --- INTRO EKRANI ---
function IntroScreen({ onStart }) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-600 to-red-700 flex flex-col items-center justify-center text-white px-4">
      <div className="animate-bounce mb-8">
        <ChefHat size={84} strokeWidth={1.5} className="drop-shadow-lg" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-2 drop-shadow-md text-center">Al Bunu</h1>
      <h1 className="text-5xl font-bold tracking-tight text-yellow-300 drop-shadow-md mb-8 text-center">Pişir</h1>
      
      <button 
        onClick={onStart}
        className="group relative bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
      >
        <Play size={24} className="fill-current" />
        BAŞLA
        <div className="absolute inset-0 rounded-full ring-4 ring-white/30 animate-ping"></div>
      </button>
      <p className="text-xs mt-8 opacity-70 font-medium tracking-wide">Sesli Mutfak Asistanı</p>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [recipes, setRecipes] = useState(initialRecipes);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const soundEngine = useRef(new SoundEngine());

  const handleStartApp = () => {
    soundEngine.current.playStartup();
    setShowIntro(false);
  };

  const startDrum = () => { if (!isMuted) soundEngine.current.playDrumRoll(); };
  const stopDrumAndDing = () => {
    soundEngine.current.stopDrumRoll();
    if (!isMuted) soundEngine.current.playDing();
  };
  const justDing = () => { if (!isMuted) soundEngine.current.playDing(); }

  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-[#FFFBF5]',
    text: darkMode ? 'text-slate-100' : 'text-gray-800',
    cardBg: darkMode ? 'bg-slate-900' : 'bg-white',
    cardBorder: darkMode ? 'border-slate-800' : 'border-orange-100',
    subText: darkMode ? 'text-slate-400' : 'text-gray-500',
    button: darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-orange-50 text-gray-700',
    header: darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-[#FFFBF5]/90 border-orange-200',
    filterBtnActive: 'bg-orange-600 text-white border-orange-600',
    filterBtnInactive: darkMode ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-gray-600 border-gray-200',
  };

  const handleRandomRecipe = () => {
    setLoading(true);
    setAiStatus('random_mode');
    startDrum();
    setTimeout(() => {
      const randomRecipe = initialRecipes[Math.floor(Math.random() * initialRecipes.length)];
      setRecipes([randomRecipe]);
      setExpandedRecipe(randomRecipe.id);
      setSelectedIngredients([]);
      setSelectedCategory('all');
      setIsAiGenerated(false);
      setLoading(false);
      stopDrumAndDing();
    }, 2500);
  };

  const handleSmartRecipeFind = async () => {
    if (selectedIngredients.length === 0) {
      setAiStatus('empty_ingredients');
      setTimeout(() => setAiStatus(null), 3000);
      return;
    }
    setLoading(true);
    setAiStatus(null);
    setRecipes([]); 
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!apiKey) {
      handleOfflineFallback();
      justDing();
      return;
    }

    try {
      const selectedNames = commonIngredients.filter(i => selectedIngredients.includes(i.id)).map(i => i.name).join(", ");
      const systemPrompt = `Sen Türk mutfağı ustasısın...`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Bu malzemelerle 3 tarif ver: ${selectedNames}. JSON formatında.` }] }] })
      });
      const data = await response.json();
      if(data.error) throw new Error();
      const textResponse = data.candidates[0].content.parts[0].text;
      const jsonString = textResponse.replace(/```json|```/g, '').trim();
      const parsedRecipes = JSON.parse(jsonString);
      const recipesWithIds = parsedRecipes.map((r, index) => ({ ...r, id: Date.now() + index }));
      setRecipes(recipesWithIds);
      setIsAiGenerated(true);
      setAiStatus('success');
      justDing();
    } catch (error) {
      handleOfflineFallback();
      justDing();
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineFallback = () => {
    const matched = initialRecipes.map(recipe => {
      const matchCount = recipe.mainIngredients ? recipe.mainIngredients.filter(i => selectedIngredients.includes(i)).length : 0;
      return { ...recipe, matchCount };
    }).filter(r => r.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount);
    if (matched.length > 0) setRecipes(matched);
    else setRecipes(initialRecipes);
    setIsAiGenerated(false);
    setAiStatus('offline_mode');
  };

  const toggleIngredient = (id) => { setSelectedIngredients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
  const toggleFavorite = (e, id) => { e.stopPropagation(); setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); };
  const resetApp = () => { setSelectedIngredients([]); setSelectedCategory('all'); setRecipes(initialRecipes); setIsAiGenerated(false); setAiStatus(null); if (soundEngine.current.drumInterval) soundEngine.current.stopDrumRoll(); };

  const filteredRecipes = useMemo(() => {
    let list = recipes;
    if (!isAiGenerated && aiStatus !== 'random_mode' && selectedIngredients.length > 0 && aiStatus !== 'offline_mode') {
       list = list.map(recipe => {
        const matchCount = recipe.mainIngredients ? recipe.mainIngredients.filter(i => selectedIngredients.includes(i)).length : 0;
        return { ...recipe, matchCount };
      }).filter(r => r.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount);
    }
    if (selectedCategory !== 'all') list = list.filter(r => r.category === selectedCategory);
    if (showFavorites) list = list.filter(r => favorites.includes(r.id));
    return list;
  }, [recipes, selectedIngredients, selectedCategory, favorites, showFavorites, isAiGenerated, aiStatus]);

  if (showIntro) return <IntroScreen onStart={handleStartApp} />;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text} font-sans pb-20 animate-fade-in`}>
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-300 ${theme.header} px-4 py-3 flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-2 rounded-xl shadow-lg shadow-orange-500/30">
            <ChefHat size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">Al Bunu</h1>
            <h1 className="text-lg font-bold leading-none tracking-tight text-orange-500">Pişir</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-400 border border-gray-200'}`}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-orange-400 shadow-sm border border-orange-100 hover:bg-orange-50'}`}>
            {darkMode ? <Moon size={18} className="fill-current" /> : <Sun size={18} className="fill-current" />}
          </button>
          <button onClick={() => setShowFavorites(!showFavorites)} className={`p-2 rounded-full transition-all duration-300 ${showFavorites ? 'bg-red-500 text-white shadow-red-500/40 shadow-lg' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-400 border border-gray-200')}`}>
            <Heart className={showFavorites ? 'fill-current' : ''} size={18} />
          </button>
        </div>
      </header>
      <main className="max-w-md mx-auto p-4">
        <div className={`rounded-3xl p-5 shadow-sm border transition-colors duration-300 mb-6 ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.text}`}>
              <Search size={16} className="text-orange-500" /> Mutfakta ne var?
            </h3>
            {selectedIngredients.length > 0 && (
              <button onClick={() => setSelectedIngredients([])} className="text-[10px] text-red-500 font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10 transition">
                <X size={12} /> SIFIRLA
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar pb-2">
            {commonIngredients.map((item) => {
              const isSelected = selectedIngredients.includes(item.id);
              return (
                <button key={item.id} onClick={() => toggleIngredient(item.id)} className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all duration-200 aspect-square ${isSelected ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105' : `${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}`}>
                  <span className="text-xl mb-0.5">{item.icon}</span>
                  <span className="text-[9px] font-bold leading-none text-center">{item.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200/30 grid grid-cols-4 gap-3">
            <button onClick={handleRandomRecipe} disabled={loading} className={`col-span-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all shadow-lg active:scale-95 group ${darkMode ? 'bg-purple-900/50 text-purple-300 border border-purple-800 hover:bg-purple-900/70' : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/30 hover:scale-105'}`}>
              {loading && aiStatus === 'random_mode' ? <Loader2 className="animate-spin" size={24} /> : <Dices size={28} strokeWidth={1.5} className="group-hover:rotate-180 transition-transform duration-500" />}
            </button>
            <button onClick={handleSmartRecipeFind} disabled={loading} className={`col-span-3 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-orange-500/40 active:scale-95'}`}>
              {loading && aiStatus !== 'random_mode' ? <> <Loader2 className="animate-spin" size={20} /> Düşünüyor... </> : <> <Sparkles size={20} className="text-yellow-200" /> Bana Özel Tarif Bul </>}
            </button>
          </div>
        </div>
        {aiStatus === 'empty_ingredients' && <div className="mb-4 p-3 bg-orange-100 text-orange-700 text-xs rounded-xl border border-orange-200 text-center animate-fade-in">Önce yukarıdan birkaç malzeme seçmelisin. 👆</div>}
        {aiStatus === 'offline_mode' && <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-xl border border-blue-100 flex items-center gap-2 animate-fade-in"><UtensilsCrossed size={16} /><div><span className="font-bold block">Çevrimdışı Mod</span>İnternet yok ama sorun değil! Arşivden en uygunlarını getirdim.</div></div>}
        {aiStatus === 'random_mode' && !loading && <div className="mb-4 p-3 bg-purple-50 text-purple-700 text-xs rounded-xl border border-purple-100 text-center animate-fade-in font-bold">🥁 İşte şansına gelen lezzet! 🔔</div>}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${selectedCategory === cat.id ? theme.filterBtnActive : theme.filterBtnInactive}`}>
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
        <div className="mb-4 flex justify-between items-center px-1">
          <h2 className={`font-bold text-lg flex items-center gap-2 ${theme.text}`}>{showFavorites ? 'Favorilerin' : (isAiGenerated ? 'Yapay Zeka Önerileri' : 'Tarifler')}</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-gray-200 text-gray-400'}`}>{filteredRecipes.length}</span>
        </div>
        <div className="space-y-4">
          {loading ? ([1, 2, 3].map(i => <div key={i} className={`h-28 rounded-3xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}></div>)) : filteredRecipes.length > 0 ? (filteredRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} isExpanded={expandedRecipe === recipe.id} toggleExpand={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)} hasIngredients={selectedIngredients} isFavorite={favorites.includes(recipe.id)} toggleFavorite={(e) => toggleFavorite(e, recipe.id)} theme={theme} darkMode={darkMode} />)) : (<div className={`text-center py-16 px-6 rounded-3xl border border-dashed ${theme.cardBg} ${theme.cardBorder}`}><div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3"><Filter className="text-gray-400" size={24} /></div><p className={`text-sm font-medium ${theme.subText}`}>Bu kriterde tarif yok.</p><button onClick={resetApp} className="mt-3 text-xs font-bold text-orange-500 underline">Hepsini Göster</button></div>)}
        </div>
      </main>
    </div>
  );
}

function RecipeCard({ recipe, isExpanded, toggleExpand, hasIngredients, isFavorite, toggleFavorite, theme, darkMode }) {
  const matchCount = hasIngredients.length > 0 ? (recipe.mainIngredients ? recipe.mainIngredients.filter(i => hasIngredients.includes(i)).length : 0) : 0;
  return (
    <div className={`rounded-3xl shadow-sm border overflow-hidden transition-all duration-300 ${theme.cardBg} ${isExpanded ? 'ring-2 ring-orange-500 border-transparent' : theme.cardBorder}`}>
      <div onClick={toggleExpand} className="p-4 cursor-pointer flex gap-4 relative">
        {matchCount > 0 && <div className="absolute top-4 right-12 text-[9px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-200">{matchCount} Malzeme Var</div>}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-orange-50'}`}>{categories.find(c => c.id === recipe.category)?.icon || '🥘'}</div>
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex justify-between items-start"><h3 className={`font-bold text-base leading-tight mb-1 pr-8 ${theme.text}`}>{recipe.name}</h3><button onClick={toggleFavorite} className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-orange-50'}`}><Heart size={20} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} /></button></div>
          <p className={`text-xs line-clamp-1 mb-2.5 ${theme.subText}`}>{recipe.description}</p>
          <div className="flex items-center gap-3"><div className={`flex items-center text-[10px] font-bold gap-1 ${theme.subText}`}><Clock size={12} className="text-orange-500" /> {recipe.prepTime}</div><div className={`flex items-center text-[10px] font-bold gap-1 ${theme.subText}`}><User size={12} className="text-orange-500" /> {recipe.serves}</div><div className={`flex items-center text-[10px] font-bold gap-1 ml-auto px-2 py-0.5 rounded-md ${darkMode ? 'bg-slate-800' : 'bg-gray-100'} ${theme.subText}`}>{recipe.difficulty}</div></div>
        </div>
      </div>
      {isExpanded && (
        <div className={`border-t p-5 animate-fade-in ${darkMode ? 'border-slate-800 bg-slate-800/30' : 'border-orange-100 bg-orange-50/40'}`}>
          <div className="mb-5"><h4 className="text-[10px] uppercase font-black text-orange-500 mb-2.5 flex items-center gap-1"><div className="w-1 h-3 bg-orange-500 rounded-full"></div> İhtiyaç Listesi</h4><div className="flex flex-wrap gap-1.5">{recipe.mainIngredients && recipe.mainIngredients.map((ing, i) => { const hasIt = hasIngredients.includes(ing); const ingName = commonIngredients.find(c => c.id === ing)?.name || ing; return (<span key={i} className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${hasIngredients.length > 0 ? (hasIt ? 'bg-green-500 text-white border-green-500' : (darkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white border-gray-200 text-gray-400')) : (darkMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-white border-orange-100 text-gray-600')}`}>{ingName}</span>); })}</div></div>
          {recipe.tip && <div className={`mb-5 p-3.5 rounded-2xl text-xs flex gap-3 items-start ${darkMode ? 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-800 border border-yellow-100'}`}><span className="text-lg">💡</span><div><span className="font-bold block mb-0.5">Şefin Sırrı:</span><span className="opacity-90 leading-relaxed">{recipe.tip}</span></div></div>}
          <div><h4 className="text-[10px] uppercase font-black text-orange-500 mb-2.5 flex items-center gap-1"><div className="w-1 h-3 bg-orange-500 rounded-full"></div> Hazırlanışı</h4><ol className="space-y-3 relative border-l-2 border-orange-500/20 ml-1.5 my-1">{recipe.steps && recipe.steps.map((step, i) => (<li key={i} className="pl-4 relative"><span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-orange-500 ring-4 ring-transparent"></span><span className={`text-sm leading-relaxed block ${theme.text}`}>{step}</span></li>))}</ol></div>
        </div>
      )}
    </div>
  );
}

