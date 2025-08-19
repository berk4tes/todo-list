# todo-list


Özellikler

- Görev ekleme: Input + “Ekle” butonu veya Enter ile.

- Görev tamamlama: Göreve veya metne tıklayınca tamamlandı durumuna geçer/çıkar.

- Düzenleme: Görev metnine çift tıkla → inline düzenleme. Enter kaydeder, Esc iptal, odağı kaybedince kaydeder.

- Filtreler: Tümü / Aktif / Tamamlanan. Seçim yeniden yüklemede korunur (localStorage: tasks.filter).

- Aktif sayaç: Anlık güncellenir; küçük bir bump animasyonu ile geri bildirim verir.

- Oluşturulma tarihi rozeti: Her görev için tarih/saat rozeti gösterilir; rozet üzerinde tam tarih ipucu (title) mevcut.

- (Opsiyonel) Göreli zaman: updateRelativeTimes() varsa (projeye sonradan eklenebilir), göreli zaman yazımı güncellenir.

- Sürükle-bırak sıralama: SortableJS ile; yeni sıralama kalıcıdır.

- Sil / Çöp Kutusu: “Sil” → öğe Çöp bölümüne taşınır (silinme zamanı + eski indeks saklanır).

- Geri Al: Çöpten listeye yaklaşık eski konumuna geri alır.

- Kalıcı Sil ve Çöpü Boşalt.

- Toplu işlem: Tamamlananları Sil → tüm tamamlananlar çöpe taşınır.

- Kalıcı depolama: Tüm veriler localStorage’da saklanır (tasks, tasks.trash, tasks.filter).

Mikro animasyonlar:

- pop-in (eklenince), fade-out (silinince), strike (tamamlandığında çizgi),

- shake (boş input uyarısı), float (boş liste mesajı),

- rocket 🚀 (boş mesajdaki ikon): alev/duman ile canlı uçuş animasyonu.

Arka plan efektleri:

- Sayfa genelinde parçacıklar, container üzerinde mouse’u takip eden ışık ve overlay parçacıkları.

- prefers-reduced-motion: reduce için (container overlay animasyonu) azaltılmış hareket desteği.

- Favicon: todo.png (veya todolist.png) ile sekme ikonu.
