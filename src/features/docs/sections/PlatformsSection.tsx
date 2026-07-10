import DocCard from "../components/DocCard";
import DocNote from "../components/DocNote";

export default function PlatformsSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Pola umum: dua tab di setiap platform">
        <p>
          Halaman Instagram, Facebook, Twitter/X, dan TikTok memakai pola yang sama, masing-masing dengan
          dua tab:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Trending</strong> &mdash; daftar topik yang sedang trending di platform tersebut,
            dihitung otomatis setiap hari (ada label jadwal pembaruan). Setiap topik bisa dibuka untuk
            melihat post-post terkait; klik salah satu post untuk membuka komentarnya.
          </li>
          <li>
            <strong>Analisis Sentimen</strong> &mdash; masukkan <strong>username</strong> akun di platform
            tersebut, pilih jumlah post/video yang ingin dianalisis, lalu klik <strong>Analisis</strong>.
            Aplikasi akan menampilkan profil akun, daftar post, dan sentimen komentar/balasan pada
            post-post tersebut.
          </li>
        </ul>
        <p>
          Di atas kolom pencarian tersedia widget ringkasan (akun yang baru dianalisis / akun populer) dan
          panel &ldquo;Discover&rdquo; berisi rekomendasi akun &mdash; klik salah satu untuk otomatis mengisi
          dan menjalankan pencarian.
        </p>
        <DocNote>
          Jika pengambilan data terbaru gagal, aplikasi menampilkan peringatan dan menampilkan data hasil
          scraping sebelumnya (jika tersedia) sebagai gantinya.
        </DocNote>
      </DocCard>

      <DocCard title="YouTube: sedikit berbeda">
        <p>YouTube juga punya tab Trending dan Sentiment, tapi dengan cara kerja yang lebih dalam:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Video Viral (Trending)</strong> &mdash; video dengan jumlah tayangan tertinggi di
            seluruh data yang tersimpan. Bisa dicari berdasarkan judul/channel/kata kunci, dan jumlah video
            yang ditampilkan bisa diatur (10/20/50/100).
          </li>
          <li>
            <strong>Analisis Sentimen</strong> &mdash; di sini pencariannya berbasis <strong>kata kunci</strong>,
            bukan username. Setelah menganalisis, kamu mendapat dashboard lengkap: statistik exposure,
            breakdown sentimen, grafik sentimen dari waktu ke waktu, daftar top post, tabel komentar,
            word cloud, dan ringkasan yang dibuat AI.
          </li>
        </ul>
        <p>
          Fitur tambahan di tab ini: <strong>Riwayat</strong> pencarian sebelumnya (bisa dibuka ulang),
          tombol <strong>Export</strong> untuk mengunduh hasil dashboard, dan panel
          <strong> Perbandingan Keyword</strong> di bagian bawah untuk membandingkan kata kunci saat ini
          dengan kata kunci lain pada platform yang sama.
        </p>
      </DocCard>
    </div>
  );
}
