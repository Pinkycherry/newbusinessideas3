/**
 * The glass and 3D system for bbusiness.online (6 Nov 2026), first used on the home page.
 * Plain CSS so any page can reuse it with one <style> tag: buttons (.g-btn, .g-btn-light),
 * frosted tiles (.g-tile), 3D icons (.g-icon + colour), the hub disc (.g-hub), flowing
 * connector lines (.g-flow), numbered glass cards (.g-step) and the scroll reveal.
 * Every motion stops under prefers-reduced-motion.
 */
export const GLASS_CSS = `
.g-btn{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:3rem;padding:0 1.5rem;border-radius:14px;font-weight:600;font-size:.875rem;line-height:1;color:#fff;
background:linear-gradient(180deg,#8079f4 0%,#5a54da 48%,#4643ba 100%);
box-shadow:inset 0 1px 0 rgba(255,255,255,.6),inset 0 -4px 8px rgba(24,20,100,.35),0 5px 0 #302d91,0 16px 30px -12px rgba(70,67,186,.75);
transition:transform .18s ease,box-shadow .18s ease,filter .18s ease;-webkit-tap-highlight-color:transparent}
.g-btn::before{content:"";position:absolute;left:2px;right:2px;top:2px;height:48%;border-radius:12px 12px 22px 22px/12px 12px 10px 10px;background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.06));z-index:-1;pointer-events:none}
.g-btn::after{content:"";position:absolute;top:-60%;left:-70%;width:38%;height:220%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);transform:rotate(20deg);animation:g-shine 3.8s ease-in-out infinite;pointer-events:none}
.g-btn:hover{transform:translateY(-2px);filter:saturate(1.15) brightness(1.04);box-shadow:inset 0 1px 0 rgba(255,255,255,.65),inset 0 -4px 8px rgba(24,20,100,.35),0 7px 0 #302d91,0 22px 36px -12px rgba(70,67,186,.85)}
.g-btn:active{transform:translateY(4px);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),inset 0 -2px 6px rgba(24,20,100,.4),0 1px 0 #302d91,0 6px 12px -6px rgba(70,67,186,.7)}
.g-btn:focus-visible{outline:3px solid #b9b2ff;outline-offset:3px}
.g-btn-light{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:3rem;padding:0 1.5rem;border-radius:14px;font-weight:600;font-size:.875rem;line-height:1;color:#4643ba;
background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(238,236,255,.9));border:1px solid rgba(70,67,186,.18);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
box-shadow:inset 0 1px 0 #fff,inset 0 -4px 8px rgba(70,67,186,.12),0 5px 0 #d3cefc,0 14px 26px -14px rgba(70,67,186,.55);transition:transform .18s ease,box-shadow .18s ease;-webkit-tap-highlight-color:transparent}
.g-btn-light::after{content:"";position:absolute;top:-60%;left:-70%;width:38%;height:220%;background:linear-gradient(100deg,transparent,rgba(124,111,240,.25),transparent);transform:rotate(20deg);animation:g-shine 4.4s ease-in-out infinite;pointer-events:none}
.g-btn-light:hover{transform:translateY(-2px);box-shadow:inset 0 1px 0 #fff,inset 0 -4px 8px rgba(70,67,186,.12),0 7px 0 #d3cefc,0 20px 30px -14px rgba(70,67,186,.6)}
.g-btn-light:active{transform:translateY(4px);box-shadow:inset 0 1px 0 #fff,0 1px 0 #d3cefc,0 6px 12px -8px rgba(70,67,186,.5)}
@keyframes g-shine{0%,55%{left:-70%}100%{left:135%}}

.g-tile{position:relative;border-radius:22px;background:linear-gradient(160deg,rgba(255,255,255,.92),rgba(246,244,255,.62));-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.95);
box-shadow:inset 0 1px 0 #fff,0 0 0 1px rgba(70,67,186,.07),0 22px 44px -26px rgba(70,67,186,.6);transition:transform .25s ease,box-shadow .25s ease}
.g-tile:hover,.g-tile:focus-visible{transform:translateY(-4px);box-shadow:inset 0 1px 0 #fff,0 0 0 1px rgba(124,111,240,.35),0 28px 48px -22px rgba(124,111,240,.7);outline:none}

.g-icon{display:grid;place-items:center;width:56px;height:56px;border-radius:17px;color:#fff;background:linear-gradient(145deg,#958cff,#4643ba);
box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -5px 10px rgba(20,16,90,.35),0 12px 20px -10px rgba(70,67,186,.85);transition:transform .25s ease}
.g-icon svg{filter:drop-shadow(0 2px 2px rgba(0,0,0,.25))}
.g-tile:hover .g-icon{transform:translateY(-3px) rotate(-4deg) scale(1.05)}
.g-icon.pink{background:linear-gradient(145deg,#ff8cc6,#d6337f);box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -5px 10px rgba(110,10,60,.3),0 12px 20px -10px rgba(214,51,127,.8)}
.g-icon.blue{background:linear-gradient(145deg,#7cb6ff,#2f6fe0);box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -5px 10px rgba(10,40,110,.3),0 12px 20px -10px rgba(47,111,224,.8)}
.g-icon.teal{background:linear-gradient(145deg,#6ee7d6,#0f9f8f);box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -5px 10px rgba(0,70,60,.3),0 12px 20px -10px rgba(15,159,143,.8)}
.g-icon.amber{background:linear-gradient(145deg,#ffd27a,#f08a1c);box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -5px 10px rgba(120,60,0,.3),0 12px 20px -10px rgba(240,138,28,.8)}
.g-icon.violet{background:linear-gradient(145deg,#c39bff,#7b3fe4);box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -5px 10px rgba(60,10,120,.3),0 12px 20px -10px rgba(123,63,228,.8)}

.g-hub{position:relative;border-radius:9999px;background:radial-gradient(circle at 50% 30%,#ffffff 0%,#f6f4ff 60%,#ebe7ff 100%);
box-shadow:0 0 0 10px rgba(255,255,255,.7),0 0 0 11px rgba(124,111,240,.22),0 0 70px 14px rgba(124,111,240,.35),inset 0 -12px 30px rgba(124,111,240,.22)}
.g-hub::before{content:"";position:absolute;inset:-14px;border-radius:inherit;padding:3px;background:conic-gradient(from 0deg,#7b6ff0,#ff7ab6,#5aa3ff,#7b6ff0);
-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:g-spin 8s linear infinite;filter:blur(.3px)}
@keyframes g-spin{to{transform:rotate(360deg)}}

.g-flow{stroke-dasharray:3 7;animation:g-flow 1.6s linear infinite}
@keyframes g-flow{to{stroke-dashoffset:-20}}

.g-step{position:relative;padding-top:38px;padding-left:38px}
.g-step-tab{position:absolute;left:0;top:0;width:112px;height:100px;border-radius:24px;background:linear-gradient(145deg,#7c73ff,#3a2fb0);color:#fff;font-weight:700;font-size:1.45rem;line-height:1;padding:8px 12px;
box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 14px 24px -12px rgba(58,47,176,.8)}
.g-step-card{position:relative;border-radius:22px;background:linear-gradient(160deg,rgba(255,255,255,.88),rgba(244,242,255,.7));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.95);
box-shadow:inset 0 1px 0 #fff,0 0 0 1px rgba(70,67,186,.07),0 26px 46px -28px rgba(70,67,186,.65)}

.g-chip{display:inline-flex;align-items:center;min-height:2.5rem;padding:0 .9rem;border-radius:12px;font-size:.85rem;color:#3b3897;background:linear-gradient(180deg,#fff,#f3f1ff);border:1px solid rgba(70,67,186,.14);
box-shadow:inset 0 1px 0 #fff,0 3px 0 #e2defd,0 8px 14px -10px rgba(70,67,186,.5);transition:transform .15s ease,box-shadow .15s ease}
.g-chip:hover{transform:translateY(-1px);color:#4643ba;box-shadow:inset 0 1px 0 #fff,0 4px 0 #d3cefc,0 12px 18px -10px rgba(70,67,186,.6)}
.g-chip:active{transform:translateY(2px);box-shadow:inset 0 1px 0 #fff,0 1px 0 #d3cefc}

.rv-on [data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.7,.2,1)}
.rv-on [data-reveal].rv-in{opacity:1;transform:none}
.rv-on [data-reveal] [data-stagger]{opacity:0;transform:translateY(14px) scale(.98);transition:opacity .5s ease,transform .5s ease}
.rv-on [data-reveal].rv-in [data-stagger]{opacity:1;transform:none}
@keyframes bbi-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media (min-width:1024px){.bbi-float-lg{animation:bbi-float 6s ease-in-out infinite}}
@keyframes bbi-dash{to{stroke-dashoffset:0}}
.rv-on [data-reveal].rv-in .bbi-path{animation:bbi-dash 1.6s ease forwards}

@media (prefers-reduced-motion:reduce){
.g-btn::after,.g-btn-light::after,.g-hub::before,.g-flow,.bbi-float-lg{animation:none!important}
.g-btn,.g-btn-light,.g-tile,.g-icon,.g-chip{transition:none!important}
.rv-on [data-reveal],.rv-on [data-reveal] [data-stagger]{opacity:1!important;transform:none!important;transition:none!important}
.bbi-path{stroke-dashoffset:0!important}}
`;
