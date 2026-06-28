export default function Footer() {
  return (
    <div className="mt-8 text-center text-xs text-slate-500 space-y-2">
      <p>© 2026 SentimentAI. All rights reserved.</p>

      <div className="flex justify-center gap-4">
        <button className="hover:text-white">
          Terms
        </button>

        <button className="hover:text-white">
          Privacy
        </button>

        <button className="hover:text-white">
          Security
        </button>
      </div>
    </div>
  );
}