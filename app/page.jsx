"use client";

/**
 * Glyph Portal Â© 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk â†’ UsefulPortal.tsx â†’ ClarityPortal.tsx.
 * A scroll-driven camera through live type. Keep this notice with copies.
 */
import { useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { WaitlistHero } from "../components/WaitlistHero";
import { GradientBackground } from "../components/GradientBackground";

/* â”€â”€â”€ Palette tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const P = {
  /* Modern Minimal Accent Palette */
  blue:       "#2563eb",   // electric modern minimal blue
  blueHover:  "#1d4ed8",
  blueLo:     "rgba(37, 99, 235, 0.08)",
  blueMd:     "rgba(37, 99, 235, 0.18)",
  blueGlow:   "rgba(37, 99, 235, 0.22)",

  cyan:       "#0284c7",   // deep sky / cyan
  cyanLo:     "rgba(2, 132, 199, 0.08)",
  cyanMd:     "rgba(2, 132, 199, 0.18)",
  cyanGlow:   "rgba(2, 132, 199, 0.22)",

  indigo:     "#4f46e5",   // modern violet/indigo
  indigoLo:   "rgba(79, 70, 229, 0.08)",
  indigoMd:   "rgba(79, 70, 229, 0.18)",
  indigoGlow: "rgba(79, 70, 229, 0.22)",

  emerald:    "#10b981",   // clean emerald
  emerLo:     "rgba(16, 185, 129, 0.08)",
  emerMd:     "rgba(16, 185, 129, 0.18)",

  /* Clean Modern Minimal backgrounds */
  bg:         "#f8fafc",   // crisp minimal off-white
  surface:    "#f1f5f9",   // soft light slate surface
  paper:      "#ffffff",   // pure white paper
  cardBg:     "#ffffff",   // crisp luminous white card

  /* Typography */
  ink:        "#0f172a",   // crisp slate-900 ink
  white:      "#ffffff",
  muted:      "#64748b",   // slate-500 secondary text
  faint:      "#cbd5e1",   // slate-300 subtle border & hint text

  /* Field (inside the clipped letters) — deep midnight slate & electric blue */
  field:      "#0f172a",
};

/* â”€â”€â”€ Smooth scroll helper with easing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function smoothScrollTo(targetY, duration = 1200) {
  if (typeof window === "undefined") return;
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();
  let cancelled = false;

  const onUserInteraction = () => {
    cancelled = true;
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener("wheel", onUserInteraction);
    window.removeEventListener("touchstart", onUserInteraction);
    window.removeEventListener("keydown", onUserInteraction);
  };

  window.addEventListener("wheel", onUserInteraction, { passive: true });
  window.addEventListener("touchstart", onUserInteraction, { passive: true });
  window.addEventListener("keydown", onUserInteraction, { passive: true });

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (currentTime) => {
    if (cancelled) return;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      cleanup();
    }
  };

  requestAnimationFrame(step);
}

/* â”€â”€â”€ GlyphPortal engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (a, b, n) => { const t = clamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };
const DEFAULT_FONT = '"Arial Black","Arial",sans-serif';

function interior(ctx, char, font) {
  const cv = ctx.canvas;
  ctx.font = font;
  const m = ctx.measureText(char);
  const pad = 8;
  const left = Math.ceil(m.actualBoundingBoxLeft);
  const asc  = Math.ceil(m.actualBoundingBoxAscent);
  cv.width  = Math.max(1, Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight)  + pad * 2);
  cv.height = Math.max(1, Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + pad * 2);
  ctx.font = font; ctx.fontKerning = "none";
  ctx.fillText(char, pad + left, pad + asc);
  const { width: W, height: H } = cv;
  const px = ctx.getImageData(0, 0, W, H).data;
  const rows = new Uint16Array(W + 1);
  let size = 0, bx = 0, by = 0;
  for (let y = 0; y < H; y++) {
    let diag = 0;
    for (let x = 0; x < W; x++) {
      const above = rows[x + 1];
      rows[x + 1] = px[(y * W + x) * 4 + 3] > 245 ? Math.min(above, rows[x], diag) + 1 : 0;
      diag = above;
      if (rows[x + 1] > size) { size = rows[x + 1]; bx = x; by = y; }
    }
  }
  if (size < 3) return null;
  return { x: (bx + 1 - size / 2 - pad - left) / 3, y: (by + 1 - size / 2 - pad - asc) / 3, radius: (size / 2 - 1) / 3 };
}

function scrollParent(el) {
  for (let p = el.parentElement; p; p = p.parentElement)
    if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowY) && p !== document.body && p !== document.documentElement) return p;
  return null;
}

function GlyphPortal({ word = "SIX7EVEN", focusChar, interactive = true, background, front, children,
  scrollLength = 2.6, fontFamily = DEFAULT_FONT, fontWeight = 900,
  annotations = false, enterLabel = "Explore tools", className, style, onProgress }) {

  const uid     = `gp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const clipId  = `${uid}-clip`;
  const secRef  = useRef(null);
  const progRef = useRef(onProgress);
  useLayoutEffect(() => { progRef.current = onProgress; }, [onProgress]);

  const text   = word.trim().normalize("NFC") || "SIX7EVEN";
  let off = 0;
  const chars  = Array.from(text, ch => { const i = off; off += ch.length; return { char: ch, index: i }; });
  const length = Number.isFinite(scrollLength) ? clamp(scrollLength, 1, 8) : 2.6;
  const wt     = Number.isFinite(fontWeight)   ? clamp(fontWeight, 1, 1000) : 900;
  const hasFront = front != null;
  const q = `:where(#${uid})`;

  useLayoutEffect(() => {
    const section = secRef.current; if (!section) return;
    const pin    = section.querySelector("[data-gp-pin]");
    const field  = section.querySelector("[data-gp-field]");
    const art    = section.querySelector("[data-gp-art]");
    const clip   = section.querySelector(`#${clipId}`);
    const glyph  = section.querySelector("[data-gp-glyph]");
    const marks  = section.querySelector("[data-gp-marks]");
    const choices= section.querySelector("[data-gp-choices]");
    if (!pin||!field||!art||!clip||!glyph||!marks||!choices) return;
    const btns  = Array.from(choices.querySelectorAll("button"));
    const picker= section.querySelector("[data-gp-select]");
    const root  = scrollParent(section);
    const motion= window.matchMedia("(prefers-reduced-motion:reduce)");
    const cv    = document.createElement("canvas");
    const ctx   = cv.getContext("2d",{willReadFrequently:true});
    let disposed=false,raf=0,dirty=true,active=true,ready=false;
    let browserFrameSeen=false;
    let W=1,H=1,travel=1,startScale=1,endScale=1;
    let center={x:0,y:0}, target=null, lastP=-1;
    let candidates=[],letters=[],choosing=false;
    let bounds={x:0,y:0,width:1,height:1}, fontDirty=true;

    glyph.style.fontFamily = fontFamily;
    const compFam = getComputedStyle(glyph).fontFamily;
    const families = compFam.match(/(?:[^,"']+|"[^"]*"|'[^']*')+/g) ?? [];
    const avail = families.filter(f => { try { return document.fonts.check(`${wt} 100px ${f.trim()}`, text); } catch { return false; } });
    glyph.style.fontFamily = avail.length > 0 ? [...avail, DEFAULT_FONT].join(",") : DEFAULT_FONT;

    const readInk = () => {
      if (!ctx) return false;
      const fs = getComputedStyle(glyph);
      const scanFont = `${fs.fontWeight} 300px ${fs.fontFamily}`;
      ctx.font = `${fs.fontWeight} 100px ${fs.fontFamily}`; ctx.fontKerning="none";
      const met = ctx.measureText(text);
      const adv = Array.from({length:text.length},(_,i)=>ctx.measureText(text.slice(0,i)).width);
      bounds={x:-met.actualBoundingBoxLeft,y:-met.actualBoundingBoxAscent,
              width:met.actualBoundingBoxLeft+met.actualBoundingBoxRight,
              height:met.actualBoundingBoxAscent+met.actualBoundingBoxDescent};
      if(!bounds.width||!bounds.height) return false;
      center={x:bounds.x+bounds.width/2, y:bounds.y+bounds.height/2};
      const req=focusChar?text.indexOf(focusChar.normalize("NFC")):-1;
      let o=0; candidates=[]; letters=[];
      for(const ch of Array.from(text)) {
        ctx.font=`${fs.fontWeight} 100px ${fs.fontFamily}`;
        const m=ctx.measureText(ch);
        letters.push({index:o,x:adv[o]-m.actualBoundingBoxLeft,y:-m.actualBoundingBoxAscent,
                      width:m.actualBoundingBoxLeft+m.actualBoundingBoxRight,
                      height:m.actualBoundingBoxAscent+m.actualBoundingBoxDescent});
        const found=interior(ctx,ch,scanFont);
        if(found) candidates.push({...found,x:found.x+adv[o],index:o});
        o+=ch.length;
      }
      target=candidates.find(c=>c.index===req)??[...candidates].sort((a,b)=>b.radius-a.radius||Math.abs(a.x-center.x)-Math.abs(b.x-center.x))[0]??null;
      return true;
    };

    const select = (next) => {
      target=next;
      endScale=target?Math.max(startScale,Math.hypot(W,H)/(target.radius*1.35)):startScale;
      section.dataset.gpFocus=target?Array.from(text.slice(target.index))[0]:"";
      section.dataset.gpFocusIndex=String(target?.index??-1);
      for(const b of btns){
        b.disabled=!candidates.some(c=>c.index===Number(b.dataset.gpLetter));
        b.setAttribute("aria-checked",String(Number(b.dataset.gpLetter)===target?.index));
        b.tabIndex=Number(b.dataset.gpLetter)===target?.index?0:-1;
      }
      if(picker&&picker.value!=="") picker.value=String(target?.index??-1);
      if(picker) for(const o of Array.from(picker.options)) o.disabled=o.value===""||!candidates.some(c=>c.index===Number(o.value));
      const u=1/startScale, y=bounds.y+bounds.height+25*u, x=bounds.x, r=x+bounds.width;
      const cross=target?`M${target.x-9*u} ${target.y}h${18*u}M${target.x} ${target.y-9*u}v${18*u}`:"";
      const ap=marks.querySelector("path");
      if(ap){ap.setAttribute("d",`M${x} ${y}H${r}M${x} ${y-5*u}v${10*u}M${r} ${y-5*u}v${10*u}${cross}`);ap.setAttribute("stroke-width",String(u));}
    };

    const pos = ()=>{ const o=root?root.getBoundingClientRect().top+root.clientTop:0; return clamp((o-section.getBoundingClientRect().top)/travel); };

    const paint = (progress) => {
      const isStatic=motion.matches||!browserFrameSeen||!target;
      const p=isStatic?0:progress;
      const t=clamp(p/0.78);
      const eased=t<0.5?4*t**3:1-(-2*t+2)**3/2;
      const scale=Math.exp(Math.log(startScale)+Math.log(endScale/startScale)*eased);
      const blend=endScale===startScale?0:(1/scale-1/startScale)/(1/endScale-1/startScale);
      const cx=center.x+((target?.x??center.x)-center.x)*blend;
      const cy=center.y+((target?.y??center.y)-center.y)*blend;
      const roll=-4*smooth(0.06,0.5,t)*(1-smooth(0.62,0.92,t));
      const transform=`translate(${W/2} ${H*.46+H*.04*eased}) scale(${scale}) rotate(${roll}) translate(${-cx} ${-cy})`;
      const rad=roll*Math.PI/180, dx=W/2/scale, dy=(H*.46+H*.04*eased)/scale;
      clip.setAttribute("transform",`scale(${scale}) rotate(${roll})`);
      glyph.setAttribute("transform",`translate(${Math.cos(rad)*dx+Math.sin(rad)*dy-cx} ${-Math.sin(rad)*dx+Math.cos(rad)*dy-cy})`);
      marks.setAttribute("transform",transform);
      marks.style.opacity=String(1-smooth(0.015,0.17,p));
      choosing=interactive&&!isStatic&&p<.04;
      choices.inert=!choosing; section.dataset.gpChoosing=String(choosing);
      field.style.clipPath=t>=1?"none":`url(#${clipId})`;
      section.style.setProperty("--gp-caption",String(1-smooth(0.01,0.16,p)));
      section.style.setProperty("--gp-reveal",String(isStatic?1:smooth(0.78,0.9,p)));
      section.style.setProperty("--gp-field-scale",String(1+.16*smooth(0,.82,p)));
      section.style.setProperty("--gp-caption-hit",p<0.08?"auto":"none");
      section.dataset.gpEntered=String(p>=0.9);
      section.dataset.gpProgress=p.toFixed(5);
      if(p!==lastP){lastP=p; progRef.current?.(p);}
    };

    const layout = () => {
      if(!section.clientWidth) return;
      W=pin.clientWidth;
      const vpEl=section.querySelector("[data-gp-viewport]");
      const svh=vpEl?vpEl.offsetHeight:window.innerHeight;
      const vpH=Math.max(1,Math.min(root?.clientHeight??svh,svh));
      H=motion.matches?Math.min(vpH*.75,480):vpH;
      section.style.setProperty("--gp-height",`${H}px`);
      travel=H*length;
      art.setAttribute("viewBox",`0 0 ${W} ${H}`);
      if(fontDirty){ready=readInk();fontDirty=false;}
      if(!ready) return;
      const wh=hasFront&&H<480?Math.min(H*.38,Math.max(24,H-264)):H*.38;
      startScale=Math.min(W*.84/bounds.width,wh/bounds.height);
      select(target);
      for(const b of btns){
        const l=letters.find(lt=>lt.index===Number(b.dataset.gpLetter));
        if(l) Object.assign(b.style,{
          left:`${W/2+(l.x-center.x)*startScale}px`,
          top:`${H*.46+(l.y-center.y)*startScale-Math.max(0,44-l.height*startScale)/2}px`,
          width:`${Math.max(1,l.width*startScale)}px`,
          height:`${Math.max(44,l.height*startScale)}px`,
        });
      }
      section.style.setProperty("--gp-word-top",`${H*.46-bounds.height*startScale/2}px`);
      section.style.setProperty("--gp-word-bottom",`${H*.46+bounds.height*startScale/2}px`);
      section.dataset.gpReady="true";
      section.dataset.gpMotion=!motion.matches&&browserFrameSeen&&target?"on":"off";
    };

    const frame=(time)=>{raf=0;if(disposed)return;if(time!==undefined&&!browserFrameSeen){browserFrameSeen=true;dirty=true;}if(dirty){dirty=false;layout();}if(ready)paint(pos());};
    const sched=()=>{if(!raf&&active)raf=requestAnimationFrame(frame);};
    const resize=()=>{cancelAnimationFrame(raf);dirty=true;frame();};
    const scroll=()=>sched();
    const choose=(e)=>{if(!choosing||pos()>=.04)return;const b=e.target.closest("[data-gp-letter]");const nx=candidates.find(c=>c.index===Number(b?.dataset.gpLetter));if(!nx||nx===target)return;select(nx);paint(pos());};
    const navigate=(e)=>{if(!choosing||!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))return;e.preventDefault();const cur=candidates.indexOf(target);const idx=e.key==="Home"?0:e.key==="End"?candidates.length-1:(cur+(e.key==="ArrowLeft"||e.key==="ArrowUp"?-1:1)+candidates.length)%candidates.length;btns.find(b=>Number(b.dataset.gpLetter)===candidates[idx].index)?.focus({preventScroll:true});};
    const pick=()=>{if(!choosing||pos()>=.04)return;const nx=candidates.find(c=>c.index===Number(picker?.value));if(nx){select(nx);paint(pos());}};
    choices.addEventListener("pointerover",choose); choices.addEventListener("click",choose);
    choices.addEventListener("focusin",choose); choices.addEventListener("keydown",navigate);
    if(picker)picker.addEventListener("change",pick);
    const obs=new ResizeObserver(resize); obs.observe(section); if(root)obs.observe(root);
    const vis=new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active){dirty=true;sched();}else if(raf){cancelAnimationFrame(raf);raf=0;}},{root,rootMargin:"100% 0px"});
    vis.observe(section);
    (root??window).addEventListener("scroll",scroll,{passive:true});
    window.addEventListener("resize",resize); window.visualViewport?.addEventListener("resize",resize);
    motion.addEventListener("change",resize); frame(); sched();
    return()=>{
      disposed=true; cancelAnimationFrame(raf); obs.disconnect(); vis.disconnect();
      (root??window).removeEventListener("scroll",scroll); window.removeEventListener("resize",resize);
      window.visualViewport?.removeEventListener("resize",resize); motion.removeEventListener("change",resize);
      choices.removeEventListener("pointerover",choose); choices.removeEventListener("click",choose);
      choices.removeEventListener("focusin",choose); choices.removeEventListener("keydown",navigate);
      if(picker)picker.removeEventListener("change",pick);
    };
  }, [text, focusChar, interactive, fontFamily, wt, length, clipId, hasFront]);

  return (
    <section ref={secRef} id={uid} className={className} aria-label={text}
      style={{"--gp-length":length,"--gp-characters":Array.from(text).length,...style}}>
      <style>{`
        ${q}{--gp-paper:${P.paper};--gp-ink:${P.ink};--gp-field:${P.field};--gp-foreground:${P.ink};position:relative;isolation:isolate;background:var(--gp-paper);color:var(--gp-ink);font-family:'Inter',system-ui,sans-serif;}
        ${q}>[data-gp-viewport]{position:absolute;inset:0 auto auto 0;height:100vh;height:100svh;width:0;pointer-events:none;visibility:hidden;}
        ${q} [data-gp-pin]{position:relative;height:var(--gp-height,100svh);overflow:clip;isolation:isolate;container-type:size;}
        ${q} [data-gp-field]{position:absolute;inset:0;opacity:0;pointer-events:none;}
        ${q}[data-gp-ready] [data-gp-field]{opacity:1;}
        ${q} [data-gp-art]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
        ${q} [data-gp-marks]{fill:none;stroke:${P.ink};opacity:.25;}
        ${q} [data-gp-choices]{position:absolute;inset:0;visibility:hidden;pointer-events:none;}
        ${q}[data-gp-choosing=true] [data-gp-choices]{visibility:visible;}
        ${q} [data-gp-letter]{box-sizing:border-box;position:absolute;border:0;padding:0;margin:0;background:transparent;cursor:pointer;pointer-events:auto;touch-action:pan-y;}
        ${q} [data-gp-letter]:disabled{pointer-events:none;}
        ${q} [data-gp-letter]:focus-visible{outline:2px solid ${P.blue};outline-offset:5px;}
        ${q} [data-gp-touch-picker]{display:none;position:absolute;top:calc(var(--gp-word-bottom,50%) + 42px);left:50%;transform:translateX(-50%);font:12px/1.4 system-ui,sans-serif;align-items:center;gap:12px;visibility:hidden;}
        ${q}[data-gp-choosing=true] [data-gp-touch-picker]{visibility:visible;}
        ${q} [data-gp-select]{min-height:44px;min-width:90px;border:1px solid #cbd5e1;border-radius:8px;background:${P.surface};color:${P.ink};padding:0 10px;font:inherit;}
        ${q} [data-gp-select]:focus-visible{outline:2px solid ${P.blue};outline-offset:4px;}
        @media(any-pointer:coarse){${q} [data-gp-touch-picker]{display:flex;}}
        ${q} [data-gp-fallback]{position:absolute;inset:0;display:none;place-items:center;font-size:min(calc(100cqw / var(--gp-characters)),38cqh);line-height:1;color:${P.field};}
        ${q}[data-gp-ready] [data-gp-fallback]{visibility:hidden;}
        ${q} [data-gp-caption]{position:absolute;inset:auto 8% 9%;display:flex;align-items:center;justify-content:space-between;gap:1rem;font:12px/1.4 system-ui,sans-serif;opacity:var(--gp-caption,1);pointer-events:var(--gp-caption-hit,auto);color:${P.muted};}
        ${q} [data-gp-front]{position:absolute;inset:0;opacity:var(--gp-caption,1);pointer-events:none;}
        ${q} [data-gp-front] a,${q} [data-gp-front] button{pointer-events:var(--gp-caption-hit,auto);}
        ${q} [data-gp-front]:focus-within{opacity:1;}
        ${q} [data-gp-hint]{max-width:30ch;color:${P.muted};font-size:0.85rem;}
        ${q} [data-gp-enter]{display:inline-flex;align-items:center;gap:10px;min-height:44px;color:#fff;font:700 13px/1 system-ui,sans-serif;text-decoration:none;letter-spacing:.04em;padding:11px 24px;border-radius:9999px;background:linear-gradient(135deg,${P.blue},${P.blueHover});box-shadow:0 4px 18px rgba(37,99,235,0.32);cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;}
        ${q} [data-gp-enter]:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,0.45);}
        ${q} [data-gp-enter]:focus-visible{outline:2px solid ${P.blue};outline-offset:5px;}
        ${q} [data-gp-caption]:focus-within{opacity:1;pointer-events:auto;}
        ${q} [data-gp-content]{box-sizing:border-box;position:relative;padding:clamp(48px,8%,120px) clamp(24px,6%,80px);display:grid;align-content:start;color:${P.ink};background:#123A6B;background-image:radial-gradient(150% 48.4% at 41.58% 6%, rgba(234,247,251,0.92) 0%, rgba(234,247,251,0) 53%),radial-gradient(150% 48.4% at 42.42% 33%, rgba(127,198,230,0.92) 0%, rgba(127,198,230,0) 53%),radial-gradient(150% 48.4% at 51.19% 67%, rgba(46,124,192,0.92) 0%, rgba(46,124,192,0) 53%),radial-gradient(150% 48.4% at 53.67% 94%, rgba(18,58,107,0.92) 0%, rgba(18,58,107,0) 53%);overflow-wrap:anywhere;}
        ${q}[data-gp-motion=on] [data-gp-pin]{position:sticky;top:0;}
        ${q}[data-gp-motion=off] [data-gp-hint]{display:none;}
        ${q}[data-gp-motion=on] [data-gp-content]{margin-top:calc((var(--gp-length) - 1) * var(--gp-height));background:transparent;opacity:var(--gp-reveal,0);pointer-events:none;}
        ${q}[data-gp-motion=on][data-gp-entered=true] [data-gp-content]{pointer-events:auto;}
        ${q}[data-gp-motion=on]:has([data-gp-content]:focus-within) [data-gp-field]{clip-path:none!important;}
        ${q}[data-gp-motion=on] [data-gp-content]:focus-within{opacity:1;pointer-events:auto;}
        ${q}:has([data-gp-content]:focus-within) [data-gp-caption],${q}:has([data-gp-content]:focus-within) [data-gp-marks]{opacity:0;}
        @media(prefers-reduced-motion:reduce){${q} [data-gp-pin]{position:relative!important;} ${q} [data-gp-content]{margin-top:0!important;opacity:1!important;background:#123A6B!important;padding-block:64px;} ${q} [data-gp-caption]{opacity:1!important;}}
        @media(prefers-reduced-motion:reduce){${q} [data-gp-hint]{display:none;}}
      `}</style>
      <noscript><style>{`${q} [data-gp-fallback]{display:grid}${q} [data-gp-hint]{display:none}`}</style></noscript>
      <div data-gp-viewport aria-hidden="true" />
      <div data-gp-pin>
        {/* Background field — deep rich modern midnight & electric blue inside clipped letters */}
        <div data-gp-field aria-hidden="true" tabIndex={-1}>
          {background ?? (
            <GradientBackground style={{ transform: "scale(var(--gp-field-scale,1))" }} />
          )}
        </div>

        {/* SVG clip + annotation marks */}
        <svg data-gp-art aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <text data-gp-glyph x="0" y="0" style={{fontFamily,fontWeight:wt,fontSize:100,fontKerning:"none",fontVariantLigatures:"none",letterSpacing:0}}>
                {text}
              </text>
            </clipPath>
          </defs>
          <g data-gp-marks style={{visibility:annotations?"visible":"hidden"}}><path /></g>
        </svg>

        {/* Interactive letter choices */}
        <div data-gp-choices role="radiogroup" aria-label="Choose the letter to enter through">
          {chars.map(({char,index},i)=>(
            <button type="button" role="radio" aria-checked="false" tabIndex={-1}
              data-gp-letter={index} key={index}
              aria-label={`${char}, letter ${i+1} of ${chars.length}`} />
          ))}
        </div>

        {/* Touch picker */}
        <label data-gp-touch-picker>
          <span style={{position:"absolute",width:1,height:1,overflow:"hidden",clipPath:"inset(50%)"}}>Entry letter</span>
          <select data-gp-select defaultValue="">
            <option value="" disabled>Choose a letter</option>
            {chars.map(({char,index},i)=>(
              <option key={index} value={index}>{i+1} Â· {char}</option>
            ))}
          </select>
        </label>

        {front && <div data-gp-front>{front}</div>}

        {/* Fallback (no-JS) */}
        <span data-gp-fallback aria-hidden="true" style={{fontFamily,fontWeight:wt}}>{text}</span>

        {/* Caption / CTA bar */}
        <div data-gp-caption>
          <span data-gp-hint aria-hidden="true">
            {interactive ? "Scroll to enter through the type." : ""}
          </span>
          <a
            data-gp-enter
            href="#tools-section"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("tools-section") || document.getElementById(`${uid}-content`);
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 70;
                smoothScrollTo(top, 1300);
              }
            }}
          >
            {enterLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {/* â”€â”€ Content section â”€â”€ */}
      <div data-gp-content id={`${uid}-content`} tabIndex={-1}>
        {children ?? <HomePage67 />}
      </div>
    </section>
  );
}

/* â”€â”€â”€ Tool card data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const TOOLS = [
  {
    href:    "/tools/watermark-remover",
    accent:  P.blue,
    accentLo: P.blueLo,
    accentMd: P.blueMd,
    accentGlow: P.blueGlow,
    badge:   "AI-Powered",
    title:   "Watermark Remover",
    desc:    "Erase Gemini watermarks from generated images using content-aware inpainting — no sign-in needed.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    cta: "Remove Watermark",
  },
  {
    href:    "/tools/social-downloader",
    accent:  P.cyan,
    accentLo: P.cyanLo,
    accentMd: P.cyanMd,
    accentGlow: P.cyanGlow,
    badge:   "Multi-Platform",
    title:   "Video Downloader",
    desc:    "Download HD videos & audio from TikTok, YouTube, Instagram, Facebook, and Pinterest instantly.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12l4 4 4-4"/>
      </svg>
    ),
    cta: "Download Now",
  },
  {
    href:    "/tools/instagram-stalker",
    accent:  "#ec4899",
    accentLo: "rgba(236,72,153,0.08)",
    accentMd: "rgba(236,72,153,0.18)",
    accentGlow: "rgba(236,72,153,0.25)",
    badge:   "Ghost Mode",
    title:   "Anonymous Instagram Viewer",
    desc:    "Inspect public profiles, enlarge HD profile pictures, and view stories completely anonymously without logging in.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    cta: "Open Viewer",
  },
  {
    href:    "/tools/non-followers",
    accent:  "#e11d48",
    accentLo: "rgba(225,29,72,0.07)",
    accentMd: "rgba(225,29,72,0.18)",
    accentGlow: "rgba(225,29,72,0.22)",
    badge:   "100% Private",
    title:   "Non-Followers Checker",
    desc:    "Find out who doesn't follow you back on Instagram. Upload your data export — nothing ever leaves your browser.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
    cta: "Check Now",
  },
];

const FEATURES = [
  {
    accent: P.blue, accentLo: P.blueLo,
    title: "Lightning Fast",
    desc:  "Optimised processing pipeline — results in seconds, not minutes.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"/>
      </svg>
    ),
  },
  {
    accent: P.emerald, accentLo: P.emerLo,
    title: "100% Private",
    desc:  "Nothing is stored or shared. Files stay in your session.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    accent: P.cyan, accentLo: P.cyanLo,
    title: "Always On",
    desc:  "No install, no account. Works in any modern browser 24/7.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
];

/* ─── Inner home content (the revealed section) ───────────── */
function HomePage67() {
  return (
    <div style={{maxWidth:"1200px", margin:"0 auto", width:"100%"}}>

      {/* ── Section header ──────────────────────────────── */}
      <div style={{textAlign:"center", marginBottom:"3.5rem"}}>
        <span style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          padding:"6px 16px", borderRadius:"9999px",
          background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)",
          color:"#93c5fd", fontSize:"0.78rem", fontWeight:700,
          letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1.25rem",
        }}>
          <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#60a5fa",boxShadow:"0 0 8px rgba(96,165,250,0.8)"}} />
          Six Seven Tools — All-in-one media toolkit
        </span>

        <h1 style={{
          fontSize:"clamp(2.3rem, 5vw, 4.2rem)",
          fontWeight:900, lineHeight:1.08,
          letterSpacing:"-0.035em", margin:"0 0 1.25rem",
          color: "#f0f9ff",
        }}>
          Process your media{" "}
          <span style={{ color: "#bae6fd" }}>
            in seconds
          </span>
        </h1>

        <p style={{
          fontSize:"clamp(1.05rem, 2vw, 1.25rem)", color:"rgba(186,230,253,0.85)",
          maxWidth:"52ch", margin:"0 auto 2.25rem", lineHeight:1.7,
        }}>
          Remove watermarks, download social videos, or explore Instagram profiles — all for free, no account required.
        </p>

        {/* Hero CTA row */}
        <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap"}}>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("tools-section");
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 70;
                smoothScrollTo(top, 900);
              }
            }}
            style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"13px 30px", borderRadius:"14px",
              background:`linear-gradient(135deg, ${P.blue}, ${P.blueHover})`,
              color:"#ffffff", fontWeight:700, fontSize:"0.95rem",
              border:"none", cursor:"pointer",
              boxShadow:"0 6px 20px -2px rgba(37, 99, 235, 0.35)",
              transition:"transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px -2px rgba(37, 99, 235, 0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px -2px rgba(37, 99, 235, 0.35)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <Link href="/signup" style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            padding:"13px 26px", borderRadius:"14px",
            background:"#ffffff", border:"1px solid #cbd5e1",
            color:P.ink, fontWeight:600, fontSize:"0.95rem", textDecoration:"none",
            boxShadow:"0 2px 8px rgba(15,23,42,0.04)",
            transition:"all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = P.blue; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Free account
          </Link>
        </div>
      </div>

      {/* ── Tool cards ──────────────────────────────────── */}
      <div
        id="tools-section"
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(310px, 1fr))",
          gap:"1.75rem",
          marginBottom:"4.5rem",
          scrollMarginTop:"90px",
        }}
      >
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} style={{
            display:"flex", flexDirection:"column",
            padding:"2rem",
            borderRadius:"20px",
            background:"#ffffff",
            border:`1px solid #e2e8f0`,
            color:P.ink, textDecoration:"none",
            position:"relative", overflow:"hidden",
            transition:"transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease",
            boxShadow:"0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = `0 20px 35px -10px ${tool.accentGlow || 'rgba(37,99,235,0.18)'}`;
            e.currentTarget.style.borderColor = tool.accent;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
          >
            {/* Top accent line */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:"3px",
              background:`linear-gradient(90deg, ${tool.accent}, transparent)`,
            }} />

            {/* Icon + badge row */}
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.35rem"}}>
              <div style={{
                width:"50px", height:"50px", borderRadius:"14px",
                background:tool.accentLo,
                border:`1px solid ${tool.accentMd}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:tool.accent,
              }}>
                {tool.icon}
              </div>
              <span style={{
                padding:"5px 12px", borderRadius:"9999px",
                background:tool.accentLo, border:`1px solid ${tool.accentMd}`,
                color:tool.accent, fontSize:"0.74rem", fontWeight:700,
                letterSpacing:"0.06em", textTransform:"uppercase",
              }}>
                {tool.badge}
              </span>
            </div>

            {/* Title + description */}
            <h2 style={{fontSize:"1.25rem", fontWeight:800, marginBottom:"0.65rem", color:P.ink, letterSpacing:"-0.02em"}}>
              {tool.title}
            </h2>
            <p style={{fontSize:"0.9rem", color:P.muted, lineHeight:1.65, flexGrow:1, marginBottom:"1.75rem"}}>
              {tool.desc}
            </p>

            {/* CTA button */}
            <div style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px",
              padding:"12px 0", borderRadius:"12px",
              background:tool.accent,
              color:"#ffffff", fontWeight:700, fontSize:"0.88rem",
              letterSpacing:"0.02em",
              boxShadow:`0 4px 14px ${tool.accentGlow || 'rgba(37,99,235,0.25)'}`,
            }}>
              {tool.cta}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div style={{
        height:"1px",
        background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
        marginBottom:"4rem",
      }} />

      {/* ── Feature strip ───────────────────────────────── */}
      <div style={{textAlign:"center", marginBottom:"2.5rem"}}>
        <h3 style={{fontSize:"clamp(1.5rem,3vw,2.25rem)", fontWeight:800, color:"#f0f9ff", marginBottom:"0.5rem"}}>
          Why{" "}
          <span style={{ color: "#7dd3fc" }}>
            choose Six Seven Tools?
          </span>
        </h3>
        <p style={{color:"rgba(186,230,253,0.8)", fontSize:"1.02rem"}}>Built for lightning speed, complete privacy, and zero hassle.</p>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",
        gap:"1.35rem",
        marginBottom:"4.5rem",
      }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{
            padding:"1.65rem",
            borderRadius:"16px",
            background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.15)",
            backdropFilter:"blur(12px)",
            boxShadow:"0 2px 12px rgba(0,0,0,0.15)",
            display:"flex", gap:"1rem", alignItems:"flex-start",
          }}>
            <div style={{
              width:"42px", height:"42px", minWidth:"42px", borderRadius:"12px",
              background:"rgba(255,255,255,0.1)", border:`1px solid ${f.accent}55`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:f.accent,
            }}>
              {f.icon}
            </div>
            <div>
              <h4 style={{fontWeight:700, fontSize:"1.02rem", color:"#f0f9ff", marginBottom:"0.35rem"}}>{f.title}</h4>
              <p style={{fontSize:"0.875rem", color:"rgba(186,230,253,0.75)", lineHeight:1.65}}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Waitlist Hero ───────────────────────────────── */}
      <WaitlistHero />

    </div>
  );
}

/* â”€â”€â”€ Page export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function HomePage() {
  return (
    <GlyphPortal
      word="SIX7EVEN"
      scrollLength={2.6}
      enterLabel="Explore tools"
      fontFamily='"Arial Black","Impact",sans-serif'
      fontWeight={900}
      style={{
        "--gp-paper": P.paper,
        "--gp-field": P.field,
      }}
    />
  );
}
