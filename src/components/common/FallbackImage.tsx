"use client";

import { useState } from "react";

// Domain CDN Meta (Instagram/Facebook) mengirim header
// Cross-Origin-Resource-Policy: same-origin, yang membuat browser memblokir
// <img> lintas-origin walau URL-nya valid. Untuk domain ini, src dialihkan
// lewat /api/image-proxy (server kita) supaya gambarnya jadi same-origin.
// Lihat src/app/api/image-proxy/route.ts untuk detailnya.
const PROXIED_HOST_SUFFIXES = ["cdninstagram.com", "fbcdn.net"];

function resolveImageSrc(src: string) {
  try {
    const { hostname } = new URL(src);
    const needsProxy = PROXIED_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
    );
    return needsProxy ? `/api/image-proxy?url=${encodeURIComponent(src)}` : src;
  } catch {
    return src;
  }
}

// Ilustrasi lanskap sederhana — dipakai saat gambar (thumbnail/post/artikel)
// kosong atau gagal dimuat (404 dsb). Dua warna via Tailwind fill-* supaya
// otomatis menyesuaikan dark mode tanpa logic tambahan.
function PhotoIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="34" cy="14" r="5" className="fill-amber-300 dark:fill-amber-500/70" />
      <path d="M4 36L16 20L25 30L32 22L44 36H4Z" className="fill-slate-300 dark:fill-slate-600" />
      <path d="M4 36L16 20L20 24.8L11.5 36H4Z" className="fill-slate-400/80 dark:fill-slate-500" />
    </svg>
  );
}

// Ilustrasi siluet orang — dipakai utk avatar/foto profil yang kosong/gagal dimuat.
function AvatarIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="18" r="9" className="fill-slate-300 dark:fill-slate-600" />
      <path d="M6 42c0-10 8-16 18-16s18 6 18 16" className="fill-slate-300 dark:fill-slate-600" />
    </svg>
  );
}

interface Props {
  src?: string | null;
  alt?: string;
  variant?: "photo" | "avatar";
  /** Kelas untuk <img> saat gambar berhasil dimuat (biasanya "h-full w-full object-cover"). */
  imgClassName?: string;
  /** Kelas untuk div pembungkus — taruh ukuran/rounded/shrink di sini (mis. "h-24 w-24 rounded-xl shrink-0"). */
  className?: string;
  /** Ukuran ilustrasi saat fallback tampil. Default menyesuaikan proporsional ke ukuran wrapper. */
  illustrationClassName?: string;
}

// Pengganti <img onError={...}> polos di seluruh app — dulu kalau gambar 404
// cuma disembunyikan (kotak kosong) atau memunculkan ikon broken-image bawaan
// browser (kalau onError-nya belum ada sama sekali). Sekarang selalu tampil
// ilustrasi placeholder yang konsisten, baik saat src kosong maupun saat gagal
// dimuat.
//
// Catatan penting: gambar same-origin/cached kadang SUDAH SELESAI GAGAL
// (404 dsb) sebelum React sempat hydrate & memasang listener — request-nya
// keburu tuntas duluan dari markup SSR, jadi event "error" native sudah lewat
// saat listener baru terpasang, dan onError tidak pernah terpanggil. Makanya
// kita juga cek complete/naturalWidth via ref callback tepat saat <img>
// commit ke DOM. `key={src}` memaksa <img> remount tiap src berganti, supaya
// ref callback (dan pengecekan itu) selalu jalan ulang utk src yang baru —
// bukan cuma di mount pertama.
export default function FallbackImage({
  src,
  alt = "",
  variant = "photo",
  imgClassName = "h-full w-full object-cover",
  className = "",
  illustrationClassName = "h-2/5 w-2/5 max-h-14 max-w-14",
}: Props) {
  const [failed, setFailed] = useState(false);
  const [lastSrc, setLastSrc] = useState(src);

  // Reset optimis begitu src berubah — dilakukan sinkron saat render (bukan
  // lewat useEffect terpisah) supaya tidak balapan dengan pengecekan di ref
  // callback di bawah untuk <img> yang baru saja commit dengan src ini.
  if (src !== lastSrc) {
    setLastSrc(src);
    setFailed(false);
  }

  function checkAlreadyFailed(el: HTMLImageElement | null) {
    if (el && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  }

  const showImage = !!src && !failed;
  const Illustration = variant === "avatar" ? AvatarIllustration : PhotoIllustration;
  const resolvedSrc = src ? resolveImageSrc(src) : src;

  return (
    <div className={`flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      {showImage ? (
        <img
          key={resolvedSrc}
          ref={checkAlreadyFailed}
          src={resolvedSrc ?? undefined}
          alt={alt}
          className={imgClassName}
          onError={() => setFailed(true)}
        />
      ) : (
        <Illustration className={illustrationClassName} />
      )}
    </div>
  );
}
