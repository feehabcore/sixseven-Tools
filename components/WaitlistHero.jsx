"use client";

import { useState, useRef } from "react";

const WH_CSS = "@keyframes wh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }" +
  " .wh-spin-slow { animation: wh-spin 60s linear infinite; }" +
  " @keyframes wh-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }" +
  " .wh-spin-slow-rev { animation: wh-spin-rev 60s linear infinite; }" +
  " @keyframes wh-bounce-in { 0% { transform:scale(.8); opacity:0 } 50% { transform:scale(1.05); opacity:1 } 100% { transform:scale(1); opacity:1 } }" +
  " .wh-bounce-in { animation: wh-bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }" +
  " @keyframes wh-sp { 0% { transform:scale(.5); opacity:0 } 50% { transform:scale(1.1) } 70% { transform:scale(.95) } 100% { transform:scale(1); opacity:1 } }" +
  " @keyframes wh-sg { 0%, 100% { box-shadow:0 0 20px rgba(37,99,235,.4) } 50% { box-shadow:0 0 60px rgba(37,99,235,.8) } }" +
  " @keyframes wh-cd { 0% { stroke-dashoffset:24 } 100% { stroke-dashoffset:0 } }" +
  " @keyframes wh-ring { 0% { transform:translate(-50%,-50%) scale(.8); opacity:1 } 100% { transform:translate(-50%,-50%) scale(2); opacity:0 } }" +
  " .wh-success-pulse { animation: wh-sp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }" +
  " .wh-success-glow { animation: wh-sg 2s ease-in-out infinite; }" +
  " .wh-checkmark { stroke-dasharray:24; stroke-dashoffset:24; animation: wh-cd 0.4s ease-out 0.3s forwards; }" +
  " .wh-ring { animation: wh-ring 0.8s ease-out forwards; }" +
  " @keyframes wh-pd { 0%, 100% { opacity:1; transform:scale(1) } 50% { opacity:.5; transform:scale(.7) } }" +
  " .wh-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(37,99,235,0.15); border:1px solid rgba(59,130,246,0.3); color:#60a5fa; font-size:.75rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; padding:5px 14px; border-radius:9999px; margin-bottom:1.25rem; }" +
  " .wh-badge-dot { width:6px; height:6px; border-radius:50%; background:#3b82f6; animation:wh-pd 2s ease-in-out infinite; }";

export function WaitlistHero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const canvasRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => { setStatus("success"); setEmail(""); fireConfetti(); }, 1500);
  };

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const particles = [];
    const cols = ["#2563eb","#38bdf8","#60a5fa","#93c5fd","#ffffff","#cbd5e1"];
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const mk = () => ({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 2) * 10,
      life: 100, color: cols[Math.floor(Math.random() * cols.length)], size: Math.random() * 4 + 2,
    });
    for (let i = 0; i < 60; i++) particles.push(mk());
    const go = () => {
      if (!particles.length) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.5; p.life -= 2;
        ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        if (p.life <= 0) { particles.splice(i, 1); i--; }
      }
      requestAnimationFrame(go);
    };
    go();
  };

  const ok = status === "success";

  return (
    <div className="w-full flex items-center justify-center mb-8">
      <style dangerouslySetInnerHTML={{ __html: WH_CSS }} />
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#0a0f1d", minHeight: "540px", fontFamily: "system-ui,sans-serif" }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ transform: "perspective(1200px) rotateX(15deg)", transformOrigin: "center bottom" }}>
          <div className="absolute inset-0 wh-spin-slow">
            <div className="absolute top-1/2 left-1/2"
              style={{ width: "2000px", height: "2000px", transform: "translate(-50%,-50%) rotate(279deg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.21st.dev/assets/mirror/c6/c66b4f0c389b961a3676312892ca1387d7f8bd1973f44a33c7d47840d297633f.png" alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:.25,mixBlendMode:"screen" }} />
            </div>
          </div>
          <div className="absolute inset-0 wh-spin-slow-rev">
            <div className="absolute top-1/2 left-1/2"
              style={{ width: "1000px", height: "1000px", transform: "translate(-50%,-50%) rotate(304deg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.21st.dev/assets/mirror/75/75f75d84f07a61893dc2a16aad0c781c32b9e758c8f0adda2a8b252c431fdd82.png" alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:.35,mixBlendMode:"screen" }} />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,.22) 0%, transparent 70%)", zIndex: 5 }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0a0f1d 10%, rgba(10,15,29,.75) 40%, transparent 100%)", zIndex: 10 }} />

        <div className="relative flex flex-col items-center justify-end pb-16 pt-20" style={{ zIndex: 20 }}>
          <div className="wh-badge"><span className="wh-badge-dot" />Coming Soon</div>
          <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight px-4"
            style={{ color: "#ffffff", lineHeight: 1.15, marginBottom: "0.75rem" }}>
            More tools on the way.
          </h2>
          <p className="text-base md:text-lg font-medium text-center px-4"
            style={{ color: "#94a3b8", marginBottom: "2rem", maxWidth: "400px" }}>
            Drop your email — we will notify you the moment new tools land.
          </p>
          <div className="w-full max-w-md px-4 h-[60px] relative">
            <canvas ref={canvasRef}
              style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"600px", pointerEvents:"none", zIndex:50 }} />
            <div className={"absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 " + (ok ? "opacity-100 wh-success-pulse wh-success-glow" : "opacity-0 pointer-events-none")}
              style={{ backgroundColor: "#2563eb" }}>
              {ok && (<><div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 wh-ring" style={{ borderColor:"#60a5fa",animationDelay:"0s" }}/><div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 wh-ring" style={{ borderColor:"#93c5fd",animationDelay:"0.15s" }}/></>)}
              <div className={"flex items-center gap-2 font-semibold text-lg " + (ok ? "wh-bounce-in" : "")} style={{ color: "#fff" }}>
                <div style={{ background:"rgba(255,255,255,.2)",padding:"4px",borderRadius:"50%" }}>
                  <svg style={{ width:"20px",height:"20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path className={ok ? "wh-checkmark" : ""} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>You are on the list!</span>
              </div>
            </div>
            <form onSubmit={handleSubmit}
              className={"relative w-full h-full transition-all duration-500 " + (ok ? "opacity-0 pointer-events-none" : "opacity-100")}>
              <input type="email" required placeholder="your@email.com" value={email}
                disabled={status === "loading"} onChange={(e) => setEmail(e.target.value)}
                style={{ width:"100%",height:"60px",paddingLeft:"1.5rem",paddingRight:"160px",borderRadius:"9999px",outline:"none",backgroundColor:"#111827",color:"#ffffff",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.12)",caretColor:"#3b82f6",border:"none" }} />
              <div style={{ position:"absolute",top:"6px",right:"6px",bottom:"6px" }}>
                <button type="submit" disabled={status === "loading"}
                  style={{ height:"100%",padding:"0 1.5rem",borderRadius:"9999px",fontWeight:"600",color:"#fff",background:"linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)",border:"none",cursor:status==="loading"?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",minWidth:"140px",boxShadow:"0 4px 14px rgba(37,99,235,0.4)" }}>
                  {status === "loading"
                    ? <svg style={{ animation:"spin 1s linear infinite",width:"20px",height:"20px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style={{ opacity:.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity:.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    : "Notify me →"}
                </button>
              </div>
            </form>
          </div>
          <p style={{ fontSize:".75rem",marginTop:"1rem",color:"#64748b" }}>No spam. Unsubscribe any time.</p>
        </div>
      </div>
    </div>
  );
}
