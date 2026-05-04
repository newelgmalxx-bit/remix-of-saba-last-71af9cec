export function HeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] rounded-[28px] bg-[#0b1a2e] p-3 shadow-[0_30px_80px_-20px_rgba(30,91,148,0.55)] ring-1 ring-white/5">
      {/* Window chrome */}
      <div className="flex items-center justify-between rounded-2xl bg-[#0d2236] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Body */}
      <div className="mt-3 rounded-2xl bg-[#0d2236] p-4">
        <div className="flex items-center justify-between" dir="ltr">
          <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-semibold text-white/70">main.js</span>
          <span className="text-[10px] text-white/40">config.json</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold text-white">
            Live Project ⚡
          </span>
        </div>

        <div className="mt-3 rounded-xl bg-[#070f1c] p-4 font-mono text-[11px] leading-6" dir="ltr">
          <div className="text-white/40">{"// build with passion"}</div>
          <div className="text-white/85">
            <span className="text-purple-400">const</span>{" "}
            <span className="text-sky-300">design</span> ={" "}
            <span className="text-emerald-300">"crafted"</span>;
          </div>
          <div className="pl-4 text-white/85">build(design);</div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#070f1c] p-3 text-center">
            <div className="text-[10px] text-white/50">Theme</div>
            <div className="mt-1 text-sm font-bold text-white">Dark</div>
          </div>
          <div className="rounded-xl bg-[#070f1c] p-3 text-center">
            <div className="text-[10px] text-white/50">Runtime</div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Active
            </div>
          </div>
        </div>

        <div className="mt-3 h-24 rounded-xl bg-[#070f1c]" />
      </div>

      {/* Rating badge */}
      <div className="absolute -bottom-4 left-2 z-20 rounded-2xl bg-white px-5 py-3 text-center shadow-xl ring-1 ring-border">
        <div className="text-[10px] font-semibold text-muted-foreground">تقييم العملاء</div>
        <div className="mt-1 flex justify-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-400">
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77 4.8 17.5l.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
            </svg>
          ))}
        </div>
        <div className="mt-1 text-lg font-extrabold leading-none text-foreground">4.9/5</div>
        <div className="mt-1 text-[10px] text-muted-foreground" dir="ltr">من +1200 تقييم</div>
      </div>
    </div>
  );
}
