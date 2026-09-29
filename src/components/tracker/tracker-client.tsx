"use client";
import {useRef,useState,type DragEvent} from "react";
import {parseDeskrawlLog,type LogSummary} from "@/lib/deskrawl-log-parser";
import {useI18n} from "@/components/i18n-provider";

const MAX_SIZE=10*1024*1024;
export function TrackerClient(){
 const {t}=useI18n();const input=useRef<HTMLInputElement>(null);const [summary,setSummary]=useState<LogSummary|null>(null);const [error,setError]=useState("");const [drag,setDrag]=useState(false);
 async function load(file?:File){setError("");setSummary(null);if(!file)return;if(file.size>MAX_SIZE){setError("File is larger than 10 MB.");return}try{setSummary(parseDeskrawlLog(await file.text()))}catch{setError("Unable to read this file.")}}
 function drop(e:DragEvent){e.preventDefault();setDrag(false);load(e.dataTransfer.files?.[0])}
 return <div className="tracker-layout">
  <section className="game-card">
   <div className={"dropzone"+(drag?" drag":"")} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={drop}>
    <div><div className="drop-icon">⌁</div><h2>{t("tracker.drop")}</h2><p className="muted">{t("tracker.local")}</p><button className="game-btn primary" onClick={()=>input.current?.click()}>{t("tracker.choose")}</button><input ref={input} type="file" accept=".log,.txt,text/plain" onChange={e=>load(e.target.files?.[0])}/>{error&&<p style={{color:"#d8707d"}}>{error}</p>}</div>
   </div>
  </section>
  <aside className="game-card">
   <div className="eyebrow">TELEMETRY</div><h2>{t("tracker.summary")}</h2>
   {!summary?<p className="muted">{t("tracker.waiting")}</p>:<>
    <div className="metric-grid"><div className="metric"><strong>{summary.totalLines}</strong><span>Lines</span></div><div className="metric"><strong>{summary.recognizedLines}</strong><span>{t("tracker.recognized")}</span></div><div className="metric"><strong>{summary.unknownLines}</strong><span>{t("tracker.unknown")}</span></div></div>
    <p className="muted">{t("tracker.timestamps")}: {summary.timestamps}</p>
    <div className="ornament"/><h3>{t("tracker.events")}</h3>
    <div className="talent-meta">{Object.entries(summary.categories).sort((a,b)=>b[1]-a[1]).map(([k,v])=><span className="mini-chip" key={k}>{k.toUpperCase()} {v}</span>)}</div>
    <div className="ornament"/><details><summary>{t("tracker.unknownLines")}</summary><pre className="code">{summary.parsed.filter(l=>l.category==="unknown").slice(0,80).map(l=>l.raw).join("\n")||"—"}</pre></details>
   </>}
  </aside>
 </div>
}
