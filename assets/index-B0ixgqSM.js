(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function r(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=r(t);fetch(t.href,s)}})();const w={"/":["home","etc","var","usr","tmp"],"/home":["eliottine"],"/home/eliottine":["Desktop","Documents","Projects","README.txt"],"/home/eliottine/Desktop":["win11react-terminal.desktop"],"/home/eliottine/Documents":["notes.md","todo.txt"],"/home/eliottine/Projects":["win11react"],"/home/eliottine/Projects/win11react":["package.json","src","README.md"],"/home/eliottine/Projects/win11react/src":["App.jsx","main.jsx"],"/etc":["hosts","os-release"],"/var":["log"],"/var/log":["boot.log"],"/usr":["bin"],"/usr/bin":["node","npm","git","bash"],"/tmp":[]},x={"/home/eliottine/README.txt":"Bienvenue dans Linux Terminal pour Win11React.\nTape `help` pour voir les commandes disponibles.","/home/eliottine/Documents/notes.md":`# Notes
- Créer une interface style Windows 11
- Simuler des commandes Linux
- Publier le projet sur GitHub`,"/home/eliottine/Documents/todo.txt":`install
build
push github
`,"/etc/os-release":`NAME="Win11React Linux Layer"
VERSION="1.0"
ID=win11react-linux
`,"/etc/hosts":`127.0.0.1 localhost
::1 localhost
`,"/var/log/boot.log":`[ OK ] Terminal Linux démarré dans Win11React
`,"/home/eliottine/Projects/win11react/package.json":`{
  "name": "win11react-terminal",
  "scripts": {
    "dev": "vite"
  }
}
`,"/home/eliottine/Projects/win11react/README.md":`# Win11React Terminal
Un terminal Linux simulé.
`,"/home/eliottine/Projects/win11react/src/App.jsx":`export default function App() {
  return <Terminal />;
}
`,"/home/eliottine/Projects/win11react/src/main.jsx":`import React from 'react';
`},j=["help","clear","pwd","ls","cd","cat","echo","date","whoami","uname","neofetch","history","touch","mkdir","rm","tree","git","npm"];function l(i,e=""){if(!e||e===".")return i;const r=e.startsWith("/")?[]:i.split("/").filter(Boolean);return e.split("/").forEach(o=>{!o||o==="."||(o===".."?r.pop():r.push(o))}),"/"+r.join("/")}function m(i,e){return Object.prototype.hasOwnProperty.call(e,i)}function v(i){return Object.prototype.hasOwnProperty.call(x,i)}function d(i){return i.split("/").filter(Boolean).at(-1)||"/"}function g(i,e,r=0){const o=e[i]||[],t="  ".repeat(r),s=r===0?[i]:[];return o.forEach(u=>{const b=l(i,u);s.push(`${t}${r>0?"":"  "}${u}`),m(b,e)&&r<4&&s.push(...g(b,e,r+1))}),s}const n={path:"/home/eliottine",files:structuredClone(w),lines:[{type:"system",text:"Win11React Linux Terminal 1.0\nTape `help` pour commencer."}],commandHistory:[],historyIndex:null},L=document.getElementById("root");L.innerHTML=`
  <main class="desktop">
    <section class="terminal-window" aria-label="Terminal Linux Win11React">
      <header class="titlebar">
        <div class="window-title">
          <span class="icon" aria-hidden="true">▣</span>
          <span>Linux Terminal</span>
        </div>
        <div class="window-actions" aria-label="Actions fenêtre">
          <button aria-label="Réduire">−</button>
          <button aria-label="Agrandir">□</button>
          <button aria-label="Fermer" class="close">×</button>
        </div>
      </header>

      <div class="toolbar">
        <div class="tab active">
          <span class="icon" aria-hidden="true">▣</span>
          bash
        </div>
        <button title="Chercher" aria-label="Chercher">⌕</button>
        <button title="Dossiers" aria-label="Dossiers">▤</button>
      </div>

      <div class="terminal" id="terminal" tabindex="-1">
        <div id="history"></div>
        <div class="input-line">
          <span class="prompt" id="prompt"></span>
          <input
            id="command-input"
            aria-label="Commande terminal"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      </div>
    </section>

    <aside class="status-panel" aria-label="État système">
      <div class="status-item">
        <span class="icon" aria-hidden="true">▥</span>
        <span>WSL layer</span>
        <strong>Actif</strong>
      </div>
      <div class="status-item">
        <span class="icon" aria-hidden="true">⌘</span>
        <span>GitHub</span>
        <strong>Ready</strong>
      </div>
      <div class="status-item">
        <span class="icon" aria-hidden="true">⏻</span>
        <span>Session</span>
        <strong id="clock"></strong>
      </div>
    </aside>
  </main>
`;const f=document.getElementById("terminal"),P=document.getElementById("history"),c=document.getElementById("command-input"),I=document.getElementById("prompt"),E=document.getElementById("clock");function y(){return`eliottine@win11react:${n.path}$`}function h(i){return i.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function p(){I.textContent=y(),P.innerHTML=n.lines.map(i=>i.type==="command"?`<div class="terminal-line command"><span class="prompt">${h(i.prompt)}</span><span class="command-text">${h(i.text)}</span></div>`:`<div class="terminal-line ${i.type}"><pre>${h(i.text)}</pre></div>`).join(""),f.scrollTo({top:f.scrollHeight,behavior:"smooth"})}function a(i,e,r="output"){n.lines.push({type:"command",prompt:y(),text:i}),e&&n.lines.push({type:r,text:e}),p()}function A(i){const e=n.files[i];return e?e.map(r=>{const o=l(i,r);return m(o,n.files)?`${r}/`:r}).join("  "):`ls: impossible d'accéder à '${i}': Aucun dossier`}function D(i){const e=i.trim();if(!e)return;const[r,...o]=e.split(/\s+/);if(n.commandHistory.push(e),n.historyIndex=null,r==="clear"){n.lines=[],p();return}if(r==="help"){a(e,["Commandes disponibles:","help, clear, pwd, ls, cd, cat, echo, date, whoami, uname, neofetch","history, touch, mkdir, rm, tree, git status, npm run dev","","Astuce: utilise ↑ / ↓ pour l'historique et Tab pour compléter."].join(`
`));return}if(r==="pwd"){a(e,n.path);return}if(r==="ls"){a(e,A(l(n.path,o[0]||".")));return}if(r==="cd"){const t=l(n.path,o[0]||"/home/eliottine");if(!m(t,n.files)){a(e,`cd: ${o[0]||t}: Aucun dossier`,"error");return}n.lines.push({type:"command",prompt:y(),text:e}),n.path=t,p();return}if(r==="cat"){if(!o[0]){a(e,"cat: indique un fichier","error");return}const t=l(n.path,o[0]);a(e,v(t)?x[t]:`cat: ${o[0]}: Aucun fichier`,v(t)?"output":"error");return}if(r==="echo"){a(e,o.join(" "));return}if(r==="date"){a(e,new Date().toString());return}if(r==="whoami"){a(e,"eliottine");return}if(r==="uname"){a(e,"Linux win11react 6.7.0-static #1 SMP x86_64 GNU/Linux");return}if(r==="neofetch"){a(e,["       .--.        eliottine@win11react","      |o_o |       OS: Win11React Linux Layer","      |:_/ |       Shell: bash-sim","     //   \\ \\      UI: HTML + CSS + JS","    (|     | )     Theme: Fluent terminal","   /'\\_   _/`\\     Kernel: simulated","   \\___)=(___/"].join(`
`));return}if(r==="history"){a(e,n.commandHistory.map((t,s)=>`${s+1}  ${t}`).join(`
`));return}if(r==="tree"){const t=l(n.path,o[0]||".");a(e,g(t,n.files).join(`
`));return}if(r==="mkdir"){if(!o[0]){a(e,"mkdir: indique un nom de dossier","error");return}const t=l(n.path,o[0]),s=l(t,"..");if(!m(s,n.files)){a(e,"mkdir: dossier parent introuvable","error");return}n.files[s]=[...new Set([...n.files[s],d(t)])],n.files[t]=[],a(e,"");return}if(r==="touch"){if(!o[0]){a(e,"touch: indique un nom de fichier","error");return}const t=l(n.path,o[0]),s=l(t,"..");if(!m(s,n.files)){a(e,"touch: dossier parent introuvable","error");return}n.files[s]=[...new Set([...n.files[s],d(t)])],a(e,"");return}if(r==="rm"){if(!o[0]){a(e,"rm: indique un fichier ou dossier","error");return}const t=l(n.path,o[0]),s=l(t,"..");if(!n.files[s]?.includes(d(t))){a(e,`rm: ${o[0]}: introuvable`,"error");return}n.files[s]=n.files[s].filter(u=>u!==d(t)),a(e,"");return}if(r==="git"){a(e,o[0]==="status"?`Sur la branche main
Rien à valider, la copie de travail est propre.`:"git: simulation disponible: git status");return}if(r==="npm"){a(e,o.join(" ")==="run dev"?"VITE prêt sur http://127.0.0.1:5173/":"npm: simulation disponible: npm run dev");return}a(e,`${r}: commande introuvable`,"error")}function $(){const[i,...e]=c.value.split(/\s+/);if(!e.length){const t=j.find(s=>s.startsWith(i));t&&(c.value=t);return}const r=e.at(-1)||"",o=(n.files[n.path]||[]).find(t=>t.startsWith(r));o&&(c.value=`${i} ${e.slice(0,-1).join(" ")} ${o}`.trim())}c.addEventListener("keydown",i=>{if(i.key==="Enter"&&(D(c.value),c.value=""),i.key==="Tab"&&(i.preventDefault(),$()),i.key==="ArrowUp"){i.preventDefault();const e=n.historyIndex===null?n.commandHistory.length-1:Math.max(0,n.historyIndex-1);e>=0&&(n.historyIndex=e,c.value=n.commandHistory[e])}if(i.key==="ArrowDown"){if(i.preventDefault(),n.historyIndex===null)return;const e=n.historyIndex+1;e>=n.commandHistory.length?(n.historyIndex=null,c.value=""):(n.historyIndex=e,c.value=n.commandHistory[e])}});f.addEventListener("click",()=>c.focus());setInterval(()=>{E.textContent=new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})},1e3);p();c.focus();
