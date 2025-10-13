import{r as i,j as e,s as j,h as m,b,c as g}from"./index-CrD9FBXp.js";import{P as f}from"./PantheonModal-Dy_3r3rP.js";import{E as y}from"./EmojiNetwork-llrQZUuv.js";import"./proxy-DiZ-xd6y.js";function h({size:c=28,className:r=""}){const s=c,o=Math.max(2,Math.round(c/14)),t=i.useMemo(()=>({root:{width:s,height:s},ring:{borderWidth:o},dot:{fontSize:Math.round(s*.42),left:Math.round(s*.32),top:Math.round(s*.3)},degree:{fontSize:Math.round(s*.36),left:Math.round(s*.58),top:Math.round(s*.08)},sparkle1:{right:-Math.round(s*.14),top:Math.round(s*.35)},sparkle2:{right:-Math.round(s*.28),top:-Math.round(s*.06)},sparkle3:{right:-Math.round(s*.04),bottom:-Math.round(s*.02)}}),[s,o]);return e.jsxs("span",{className:`relative inline-block align-middle cosmoji-emblem ${r}`,style:t.root,"aria-hidden":"true",children:[e.jsx("style",{children:`
        .cosmoji-emblem .cosmoji-ring { 
          position: absolute; inset: 0; border-radius: 9999px; 
          border-style: solid; border-color: rgba(2, 6, 23, 0.2); /* slate-950/20 on white */
          box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.06) inset;
          background: radial-gradient(closest-side, rgba(2,6,23,0.02), transparent);
        }
        .dark .cosmoji-emblem .cosmoji-ring {
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset;
          background: radial-gradient(closest-side, rgba(255,255,255,0.04), transparent);
        }
        .cosmoji-emblem .glyph { position: absolute; line-height: 1; color: #0f172a; opacity: 0.9; }
        .dark .cosmoji-emblem .glyph { color: #e2e8f0; }

        .cosmoji-emblem .sparkle { 
          position: absolute; color: #0891b2; /* cyan-700 */
          filter: drop-shadow(0 0 2px rgba(34,211,238,0.6));
          animation: cosmoji-sparkle 2.4s ease-in-out infinite;
          transform-origin: left center;
          font-size: ${Math.max(10,Math.round(s*.34))}px;
          opacity: 0;
        }
        .cosmoji-emblem .sparkle:nth-of-type(1) { animation-delay: 0s; }
        .cosmoji-emblem .sparkle:nth-of-type(2) { animation-delay: 0.6s; color: #06b6d4; }
        .cosmoji-emblem .sparkle:nth-of-type(3) { animation-delay: 1.2s; color: #22d3ee; }

        @keyframes cosmoji-sparkle {
          0%   { transform: translateX(0px) scale(0.6) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.9; }
          45%  { transform: translateX(${Math.round(s*.38)}px) scale(1) rotate(12deg); opacity: 0.85; }
          70%  { opacity: 0.3; }
          100% { transform: translateX(${Math.round(s*.7)}px) scale(0.9) rotate(22deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cosmoji-emblem .sparkle { animation: none; opacity: 0.25; }
        }
      `}),e.jsx("span",{className:"cosmoji-ring",style:t.ring}),e.jsx("span",{className:"glyph",style:t.dot,children:"•"}),e.jsx("span",{className:"glyph",style:t.degree,children:"°"}),e.jsx("span",{className:"sparkle",style:t.sparkle1,children:"✦"}),e.jsx("span",{className:"sparkle",style:t.sparkle2,children:"✦"}),e.jsx("span",{className:"sparkle",style:t.sparkle3,children:"✦"})]})}function C(){const[c,r]=i.useState(!1),[s,o]=i.useState({occurrences:[],pairs:[],triples:[]}),[t,d]=i.useState([]);i.useEffect(()=>{j(),o(m())},[]);const x=a=>{d(l=>l.includes(a)?l.filter(u=>u!==a):l.length>=3?l:[...l,a])},p=()=>{if(t.length!==3)return;const a=b()||{name:"Anonyme",id:null};g({emojis:t.slice(0,3),text:"",author:a.name,authorId:a.id}),d([]),o(m()),alert("Triplet ajouté au Cosmojî.")};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"relative rounded-2xl bg-white shadow-lg p-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("h2",{className:"text-xl font-medium flex items-center gap-2",children:[e.jsxs("span",{className:"relative inline-flex items-center",children:[e.jsx("span",{className:"text-2xl pr-2",children:"○"}),e.jsx(h,{size:24})]}),"Cosmojî – Réseau d'associations"]}),e.jsx("button",{onClick:()=>r(!0),className:"rounded-xl bg-slate-900 text-white px-3 py-1",children:"Panthéon"})]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600",children:"Chaque nœud représente un émoji (taille = occurrences). Les liens indiquent les co‑occurrences (épaisseur = force)."}),e.jsx("div",{className:"mt-4",children:e.jsx(y,{stats:s,selectable:!0,selected:t,onToggle:x,maxNodes:30,maxLinks:200})}),e.jsxs("div",{className:"mt-3 flex items-center justify-between",children:[e.jsxs("div",{className:"text-sm text-slate-600 select-none",children:["Sélection: ",e.jsx("span",{className:"font-mono",children:t.join(" ")||"—"})]}),e.jsx("button",{onClick:p,disabled:t.length!==3,className:`rounded-xl px-3 py-1 text-sm font-medium transition ${t.length===3?"bg-emerald-600 text-white hover:bg-emerald-700":"bg-slate-200 text-slate-500 cursor-not-allowed"}`,children:"Créer un haïku avec ces 3"})]})]}),e.jsxs("div",{className:"relative rounded-2xl bg-white shadow-lg p-6",children:[e.jsx("button",{className:"absolute top-4 left-4 rounded-xl bg-white/80 backdrop-blur px-3 py-1 shadow border",onClick:()=>history.back(),children:"← Retour"}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("h2",{className:"text-xl font-medium flex items-center gap-2",children:[e.jsxs("span",{className:"relative inline-flex items-center",children:[e.jsx("span",{className:"text-2xl pr-2",children:"○"}),e.jsx(h,{size:24})]}),"Cosmojî – Tendances"]}),e.jsx("button",{onClick:()=>r(!0),className:"rounded-xl bg-slate-900 text-white px-3 py-1",children:"Panthéon"})]}),e.jsxs("div",{className:"mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm",children:[e.jsxs("section",{children:[e.jsx("h3",{className:"text-slate-600 mb-2",children:"Top émojis"}),e.jsx("ul",{className:"space-y-1",children:s.occurrences.slice(0,8).map(({items:a,count:l},n)=>e.jsxs("li",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"select-none",children:a[0]}),e.jsx("span",{className:"text-slate-500",children:l})]},n))})]}),e.jsxs("section",{children:[e.jsx("h3",{className:"text-slate-600 mb-2",children:"Top paires"}),e.jsx("ul",{className:"space-y-1",children:s.pairs.slice(0,8).map(({items:a,count:l},n)=>e.jsxs("li",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"select-none",children:a.join(" ")}),e.jsx("span",{className:"text-slate-500",children:l})]},n))})]}),e.jsxs("section",{children:[e.jsx("h3",{className:"text-slate-600 mb-2",children:"Top triplets"}),e.jsx("ul",{className:"space-y-1",children:s.triples.slice(0,8).map(({items:a,count:l},n)=>e.jsxs("li",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"select-none",children:a.join(" ")}),e.jsx("span",{className:"text-slate-500",children:l})]},n))})]})]})]}),e.jsx(f,{open:c,onClose:()=>r(!1)})]})}export{C as default};
