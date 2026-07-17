import DocCard from "../components/DocCard";

export default function IntroSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Apa itu MediaWatch?">
        <p>
          MediaWatch mengumpulkan dan menganalisis percakapan publik dari platform-platform di
          bawah, lalu menampilkannya sebagai dashboard: statistik, sentimen, topik trending, dan
          ringkasan yang dibuat otomatis.
        </p>
        <p>Platform yang dipantau saat ini:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>YouTube</li>
          <li>Instagram</li>
          <li>Facebook</li>
          <li>Twitter/X</li>
          <li>TikTok</li>
          <li>Berita (agregasi dari berbagai media daring)</li>
        </ul>
      </DocCard>

      <DocCard title="Untuk siapa aplikasi ini?">
        <p>
          MediaWatch cocok untuk tim komunikasi, humas, atau riset pasar yang perlu memantau bagaimana
          sebuah topik, brand, atau tokoh dibicarakan di media sosial dan berita, termasuk sentimen
          publik (positif/netral/negatif) dan topik yang sedang naik.
        </p>
      </DocCard>

      <DocCard title="Struktur dokumentasi ini">
        <p>Gunakan menu di sebelah kiri untuk berpindah antar topik:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Mulai Menggunakan</strong> &mdash; cara login dan navigasi dasar.</li>
          <li><strong>Dashboard Overview</strong> &mdash; halaman ringkasan pertama yang dilihat setelah login.</li>
          <li><strong>Monitoring Media Sosial</strong> &mdash; cara pakai halaman YouTube/Instagram/Facebook/Twitter/TikTok.</li>
          <li><strong>Berita</strong> &mdash; trending berita dan pencarian berita.</li>
          <li><strong>Bandingkan Platform</strong> &mdash; membandingkan satu topik di banyak platform sekaligus.</li>
          <li><strong>Pencarian Topik</strong> &mdash; asisten chat untuk menemukan topik trending.</li>
          <li><strong>Pengaturan</strong> &mdash; konfigurasi akun dan analisis.</li>
          <li><strong>Tips &amp; Catatan Penting</strong> &mdash; hal-hal yang perlu diketahui sebelum menggunakan aplikasi lebih jauh.</li>
        </ul>
      </DocCard>
    </div>
  );
}
