"use client";
import {useEffect,useRef,useState,type DragEvent} from "react";
import {parseDeskrawlLog,type LogSummary} from "@/lib/deskrawl-log-parser";
import {useI18n} from "@/components/i18n-provider";

type LocalFileHandle={getFile:()=>Promise<File>};
const MAX_SIZE=50*1024*1024;
const nf=new Intl.NumberFormat();

function rate(value?:number){return value===undefined?"—":nf.format(Math.round(value))}
function elapsed(seconds?:number){
 if(!seconds)return "—";
 const h=Math.floor(seconds/3600),m=Math.floor((seconds%3600)/60),s=Math.floor(seconds%60);
 return h>0?`${h}h ${m}m`:`${m}m ${s}s`;
}

export function TrackerClient(){
 const {t}=useI18n();
 const input=useRef<HTMLInputElement>(null);
 const [summary,setSummary]=useState<LogSummary|null>(null);
 const [error,setError]=useState("");
 const [drag,setDrag]=useState(false);
 const [handle,setHandle]=useState<LocalFileHandle|null>(null);
 const [fileName,setFileName]=useState("");
 const [lastRead,setLastRead]=useState<Date|null>(null);

 async function parseFile(file:File){
   if(file.size>MAX_SIZE){setError("Game.log is larger than 50 MB. Start Deskrawl again to rotate the log, or choose a smaller current log.");return}
   setError("");
   try{setSummary(parseDeskrawlLog(await file.text()));setFileName(file.name);setLastRead(new Date())}
   catch{setError("Unable to read this Game.log.")}
 }
 async function attachHandle(next:LocalFileHandle){setHandle(next);await parseFile(await next.getFile())}
 async function choose(){
   const picker=(window as unknown as {showOpenFilePicker?:(options?:unknown)=>Promise<LocalFileHandle[]>}).showOpenFilePicker;
   if(picker){
    try{const [picked]=await picker({multiple:false,types:[{description:"Deskrawl Game.log",accept:{"text/plain":[".log",".txt"]}}]});if(picked)await attachHandle(picked);return}catch(e){if((e as {name?:string})?.name==="AbortError")return}
   }
   input.current?.click();
 }
 async function drop(e:DragEvent){
   e.preventDefault();setDrag(false);
   const item=e.dataTransfer.items?.[0] as unknown as {getAsFileSystemHandle?:()=>Promise<LocalFileHandle|null>}|undefined;
   if(item?.getAsFileSystemHandle){try{const h=await item.getAsFileSystemHandle();if(h){await attachHandle(h);return}}catch{}}
   const file=e.dataTransfer.files?.[0];if(file)await parseFile(file);
 }
 useEffect(()=>{
   if(!handle)return;
   const timer=window.setInterval(async()=>{try{await parseFile(await handle.getFile())}catch{}},2500);
   return()=>window.clearInterval(timer);
 },[handle]);

 const stats=summary?.stats;
 return <div className="tracker-workbench">
  <section className="game-card">
   <div className={"dropzone"+(drag?" drag":"")} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={drop}>
    <div><div className="drop-icon">⌁</div><h2>{t("tracker.drop")}</h2><p className="muted">Game.log stays in your browser. Nothing is uploaded.</p>
     <button className="game-btn primary" type="button" onClick={choose}>{t("tracker.choose")}</button>
     <input ref={input} type="file" accept=".log,.txt,text/plain" onChange={e=>{const f=e.target.files?.[0];if(f)parseFile(f)}}/>
     {fileName&&<p className="live-file"><span className={handle?"pulse-dot":""}/>{fileName}{handle?" · live reading":" · snapshot"}{lastRead?` · ${lastRead.toLocaleTimeString()}`:""}</p>}
     {error&&<p style={{color:"#d8707d"}}>{error}</p>}
    </div>
   </div>
  </section>

  <section className="tracker-dashboard">
   <div className="tracker-kpis">
    <article className="hud-kpi"><span>LEVEL</span><strong>{stats?.level??"—"}</strong><small>{stats?.heroClass??"Class not found in log"}</small></article>
    <article className="hud-kpi"><span>XP TO NEXT</span><strong>{stats?.xpToNext!==undefined?nf.format(stats.xpToNext):"—"}</strong><small>{elapsed(stats?.elapsedSeconds)} observed</small></article>
    <article className="hud-kpi accent"><span>XP / HOUR</span><strong>{rate(stats?.xpPerHour)}</strong><small>{stats?.xpGained?nf.format(stats.xpGained)+" XP seen":"Needs XP gain lines"}</small></article>
    <article className="hud-kpi"><span>GOLD / HOUR</span><strong>{rate(stats?.goldPerHour)}</strong><small>{stats?.goldGained?nf.format(stats.goldGained)+" gold seen":"Needs gold gain lines"}</small></article>
    <article className="hud-kpi"><span>ITEMS / HOUR</span><strong>{rate(stats?.itemsPerHour)}</strong><small>{stats?.itemsFound?stats.itemsFound+" loot events":"Needs loot lines"}</small></article>
    <article className="hud-kpi stage"><span>FARMING STAGE</span><strong>{stats?.stage??"—"}</strong><small>Normal is the most reliable mode for stage detection.</small></article>
   </div>
   <aside className="game-card tracker-debug">
    <div className="eyebrow">LOG HEALTH</div><h2>{t("tracker.summary")}</h2>
    {!summary?<p className="muted">{t("tracker.waiting")}</p>:<>
      <div className="mini-stat-row"><span>Lines</span><b>{nf.format(summary.totalLines)}</b></div>
      <div className="mini-stat-row"><span>{t("tracker.recognized")}</span><b>{nf.format(summary.recognizedLines)}</b></div>
      <div className="mini-stat-row"><span>{t("tracker.unknown")}</span><b>{nf.format(summary.unknownLines)}</b></div>
      <div className="ornament"/>
      <div className="talent-meta">{Object.entries(summary.categories).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([k,v])=><span className="mini-chip" key={k}>{k.toUpperCase()} {v}</span>)}</div>
      <details style={{marginTop:16}}><summary>{t("tracker.unknownLines")}</summary><pre className="code">{summary.parsed.filter(l=>l.category==="unknown").slice(-60).map(l=>l.raw).join("\n")||"—"}</pre></details>
    </>}
   </aside>
  </section>
 </div>
}
