import DocCard from "../components/DocCard";
import DocNote from "../components/DocNote";

export default function CompareSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Bandingkan Platform" description="Satu kata kunci, empat platform sekaligus">
        <p>
          Masukkan satu kata kunci atau hashtag, dan aplikasi akan mengambil data untuk kata kunci yang
          sama di <strong>Facebook, Instagram, Twitter/X, dan TikTok</strong> secara bersamaan. Hasilnya
          ditampilkan sebagai:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Kartu statistik per platform (Total Post, Komentar, Sentimen +/-).</li>
          <li>Grafik batang volume per platform.</li>
          <li>Grafik batang distribusi sentimen per platform.</li>
          <li>Radar chart yang merangkum semua metrik per platform dalam satu tampilan.</li>
        </ul>
        <DocNote>
          Jika satu platform gagal memuat data, aplikasi tetap menampilkan hasil dari platform lain yang
          berhasil, disertai peringatan untuk platform yang gagal.
        </DocNote>
      </DocCard>

      <DocCard title="Perbandingan Keyword (di dalam halaman platform)">
        <p>
          Selain halaman Bandingkan Platform, ada juga panel perbandingan yang lebih kecil di bagian bawah
          tab Analisis Sentimen setiap platform (misalnya YouTube). Panel ini membandingkan kata kunci yang
          sedang kamu analisis dengan kata kunci kedua yang kamu masukkan &mdash; tapi keduanya di
          <strong> platform yang sama</strong>, bukan lintas platform.
        </p>
      </DocCard>
    </div>
  );
}
