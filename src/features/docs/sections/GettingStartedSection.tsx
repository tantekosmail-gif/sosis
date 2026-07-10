import DocCard from "../components/DocCard";
import DocNote from "../components/DocNote";

export default function GettingStartedSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Login">
        <p>
          Buka halaman login, masukkan <strong>Email</strong> dan <strong>Password</strong>, lalu klik
          <strong> Sign In</strong>. Setelah berhasil, kamu akan diarahkan ke halaman <strong>Overview</strong>.
        </p>
        <DocNote variant="warning">
          Tidak ada form pendaftaran (sign up) di aplikasi ini. Akun dibuat oleh admin/backend, bukan
          secara mandiri lewat halaman login.
        </DocNote>
      </DocCard>

      <DocCard title="Navigasi utama">
        <p>Menu utama ada di sidebar kiri, tersedia di setiap halaman:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Overview</strong> &mdash; ringkasan lintas semua platform.</li>
          <li><strong>YouTube, Instagram, Facebook, Twitter/X, TikTok</strong> &mdash; halaman monitoring per platform.</li>
          <li><strong>Berita</strong> &mdash; trending &amp; pencarian berita.</li>
          <li><strong>Bandingkan Platform</strong> &mdash; bandingkan satu topik di banyak platform.</li>
          <li><strong>Cari Topik AI</strong> &mdash; asisten chat untuk menemukan topik trending.</li>
          <li><strong>Settings</strong> &mdash; pengaturan akun, AI, dan analisis.</li>
        </ul>
      </DocCard>

      <DocCard title="Logout">
        <p>
          Klik tombol <strong>Logout</strong> di pojok kanan atas header, atau gunakan
          <strong> Logout Semua Sesi</strong> di Settings &rarr; Akun untuk menghapus semua data sesi di
          browser ini.
        </p>
      </DocCard>
    </div>
  );
}
