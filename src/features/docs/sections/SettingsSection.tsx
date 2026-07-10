import DocCard from "../components/DocCard";
import DocNote from "../components/DocNote";

export default function SettingsSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Akun">
        <p>Mengubah username/email/role yang ditampilkan, dan tombol Logout Semua Sesi.</p>
        <DocNote variant="warning">
          Form &ldquo;Ubah Password&rdquo; di tab ini belum terhubung ke backend &mdash; mengisi form
          tersebut tidak benar-benar mengganti password akunmu.
        </DocNote>
      </DocCard>

      <DocCard title="Model AI">
        <p>
          Menampilkan provider AI yang aktif (Claude API &middot; claude-haiku-4-5) dan kolom untuk
          menempelkan Anthropic API key. Key yang dimasukkan di sini hanya tersimpan di browser
          (localStorage) dan tidak dikirim ke server &mdash; untuk penggunaan production, gunakan
          environment variable <span className="font-mono text-xs bg-slate-100 px-1 rounded">ANTHROPIC_API_KEY</span> di server.
        </p>
      </DocCard>

      <DocCard title="Analisis">
        <p>
          Pilih platform default yang tampil pertama kali saat membuka dashboard, dan atur parameter
          scraping (Max Pages, Max Komentar per Video, Max Halaman Komentar). Aplikasi menghitung estimasi
          jumlah komentar dan waktu scraping secara otomatis berdasarkan angka yang kamu masukkan.
        </p>
      </DocCard>

      <DocCard title="Notifikasi">
        <p>
          Tiga sakelar: notifikasi saat analisis selesai, saat ringkasan AI selesai dibuat, dan saat
          terjadi error.
        </p>
      </DocCard>

      <DocCard title="Tentang">
        <p>Informasi versi aplikasi, tech stack yang dipakai, dan daftar platform yang didukung.</p>
      </DocCard>

      <DocNote variant="warning">
        Kecuali API key AI, parameter analisis, dan preferensi notifikasi (yang tersimpan di
        localStorage browser), pengaturan lain di halaman ini bersifat tampilan saja dan belum
        tersimpan ke server.
      </DocNote>
    </div>
  );
}
