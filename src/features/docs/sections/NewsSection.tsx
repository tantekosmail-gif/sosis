import DocCard from "../components/DocCard";

export default function NewsSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Halaman Berita" description="Dua tab: Trending dan Cari">
        <p>
          Di atas kedua tab selalu tampil widget <strong>Ringkasan Analisis Berita</strong>: total artikel
          yang terkumpul, jumlah yang sudah dianalisis, sentimen berita (Positif/Netral/Negatif beserta
          catatan penting bahwa sentimen ini mencerminkan valensi peristiwa yang diliput, bukan sikap
          media), entitas yang paling banyak disebut (orang, organisasi, lokasi, tanggal, event), dan daftar
          sumber media yang berkontribusi.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Trending</strong> &mdash; daftar artikel yang dikumpulkan otomatis hari ini, lengkap
            dengan sumber, tanggal, ringkasan singkat, dan badge sentimen jika tersedia.
          </li>
          <li>
            <strong>Cari</strong> &mdash; kotak pencarian bebas untuk mencari berita berdasarkan kata kunci
            (nama orang, topik, dsb). Klik kartu hasil untuk membuka artikel aslinya di tab baru.
          </li>
        </ul>
      </DocCard>
    </div>
  );
}
