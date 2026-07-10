import DocCard from "../components/DocCard";

export default function OverviewSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Halaman Overview" description="Halaman pertama yang tampil setelah login">
        <p>Overview berisi dua ringkasan utama:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Sentimen Publik Gabungan</strong> &mdash; satu sentiment bar yang menggabungkan
            data sentimen dari semua platform yang sudah dipantau (Instagram, Facebook, Twitter/X, TikTok,
            YouTube), lengkap dengan persentase dan jumlah untuk Positif/Netral/Negatif.
          </li>
          <li>
            <strong>Ringkasan Lintas Platform</strong> &mdash; kartu kecil per platform yang menampilkan
            jumlah post yang dipantau, jumlah komentar, mini sentiment bar, dan jumlah akun yang dipantau
            (jika ada). Klik salah satu kartu untuk langsung membuka halaman platform tersebut.
          </li>
        </ul>
      </DocCard>

      <DocCard title="Cara membaca sentiment bar">
        <p>
          Setiap sentiment bar dibagi tiga warna: <span className="font-semibold text-emerald-600">hijau (Positif)</span>,{" "}
          <span className="font-semibold text-amber-600">kuning (Netral)</span>, dan{" "}
          <span className="font-semibold text-red-600">merah (Negatif)</span>. Panjang setiap warna
          proporsional terhadap persentasenya dari total item yang dianalisis.
        </p>
      </DocCard>
    </div>
  );
}
