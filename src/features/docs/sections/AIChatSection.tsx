import DocCard from "../components/DocCard";
import DocNote from "../components/DocNote";

export default function AIChatSection() {
  return (
    <div className="space-y-6">
      <DocCard title="Cari Topik AI" description="Asisten chat untuk menemukan topik trending">
        <p>
          Halaman ini bukan untuk bertanya soal data analitik, melainkan untuk menemukan dan mengajukan
          rekomendasi topik trending (misalnya untuk kebutuhan konten/monitoring). Tampilannya terbagi dua:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Kiri: kotak chat</strong> &mdash; ketik permintaan bebas, contoh:
            <span className="font-mono text-xs bg-slate-100 px-1 rounded"> &ldquo;cari 10 topik trending soal starbucks hari ini&rdquo;</span>.
            Jawaban AI muncul secara streaming (bertahap), termasuk status proses dan tool yang dijalankan.
          </li>
          <li>
            <strong>Kanan: daftar rekomendasi</strong> &mdash; hasil topik yang sudah diajukan ke sistem,
            lengkap dengan platform, akun terkait, skor keyakinan, dan status (pending/approved/posted/rejected).
            Jumlah yang ditampilkan bisa diatur (10/20/50) dan bisa di-refresh.
          </li>
        </ul>
      </DocCard>

      <DocNote>
        Secara teknis backend mendukung tiga provider AI (Claude, OpenAI, Ollama), tapi tampilan chat saat
        ini selalu memakai <strong>Claude</strong> &mdash; belum ada tombol untuk berpindah provider dari UI.
      </DocNote>
    </div>
  );
}
