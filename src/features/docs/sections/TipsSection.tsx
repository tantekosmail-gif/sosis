import DocCard from "../components/DocCard";

export default function TipsSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Hal-hal yang perlu diketahui">
        <ul className="list-disc space-y-2 pl-5">
          <li>Tidak ada pendaftaran akun mandiri &mdash; akun disediakan oleh admin/backend.</li>
          <li>
            Form ganti password di Settings &rarr; Akun belum berfungsi (belum terhubung ke backend).
          </li>
          <li>
            Sebagian besar isian di Settings hanya tersimpan di browser (localStorage), bukan di server
            &mdash; kalau ganti browser/perangkat atau membersihkan data browser, pengaturan tersebut akan
            hilang.
          </li>
          <li>
            Tombol Terms/Privacy/Security di halaman login, dan link Repository di Settings &rarr; Tentang,
            masih berupa placeholder (belum mengarah ke halaman apa pun).
          </li>
          <li>
            Fitur Cari Topik AI saat ini selalu memakai provider Claude, walau backend juga mendukung
            OpenAI dan Ollama.
          </li>
          <li>
            Jika pengambilan data langsung dari suatu platform gagal (misalnya API sedang bermasalah),
            aplikasi akan menampilkan data hasil scraping sebelumnya sebagai gantinya, disertai peringatan.
          </li>
        </ul>
      </DocCard>

      <DocCard title="Butuh bantuan lebih lanjut?">
        <p>
          Versi lengkap dokumentasi ini (termasuk untuk developer: tech stack &amp; cara menjalankan
          proyek) tersedia sebagai file{" "}
          <span className="font-mono text-xs bg-slate-100 px-1 rounded">docs/USER_GUIDE.md</span> pada
          repository proyek ini.
        </p>
      </DocCard>
    </div>
  );
}
