"use client";
import {useEffect,useMemo,useState,type CSSProperties} from "react";
import {plannerTrees,type PlannerClass,type PlannerTalent} from "@/lib/talent-planner-data";

const classOrder:PlannerClass[]=["warrior","sorcerer","hunter","monk"];
const rowThresholds=[0,5,10,15,20,30,40,50,60];

function glyph(id:PlannerClass){return id==="warrior"?"⚔":id==="sorcerer"?"✦":id==="hunter"?"➶":"◉"}

export function TalentPlanner(){
 const [classId,setClassId]=useState<PlannerClass>("warrior");
 const [level,setLevel]=useState(60);
 const [points,setPoints]=useState<Record<string,number>>({});
 const tree=plannerTrees[classId];
 const spent=Object.values(points).reduce((a,b)=>a+b,0);
 const available=Math.max(0,level-spent);
 const selected=useMemo(()=>tree.talents.filter(t=>(points[t.id]??0)>0),[tree,points]);

 useEffect(()=>{
   const q=new URLSearchParams(window.location.search);
   const requested=q.get("class") as PlannerClass|null;
   const nextClass=requested&&classOrder.includes(requested)?requested:"warrior";
   const nextLevel=Math.max(1,Math.min(70,Number(q.get("lvl"))||60));
   const allowed=new Map(plannerTrees[nextClass].talents.map(t=>[t.id,t.max]));
   const parsed:Record<string,number>={};
   for(const pair of (q.get("p")??"").split(",")){
     const [id,raw]=pair.split(":");const max=allowed.get(id);const value=Number(raw);
     if(max&&Number.isFinite(value)&&value>0)parsed[id]=Math.min(max,Math.floor(value));
   }
   setClassId(nextClass);setLevel(nextLevel);setPoints(parsed);
 },[]);

 function switchClass(id:PlannerClass){setClassId(id);setPoints({})}
 function rank(t:PlannerTalent){return points[t.id]??0}
 function canUse(t:PlannerTalent){
   if(t.row>0&&spent<t.row)return false;
   if(t.requires){const req=tree.talents.find(x=>x.name===t.requires);if(req&&(points[req.id]??0)<req.max)return false}
   return true;
 }
 function change(t:PlannerTalent,delta:number){
   setPoints(prev=>{
    const current=prev[t.id]??0;
    if(delta>0&&(available<=0||current>=t.max||!canUse(t)))return prev;
    if(delta<0&&current<=0)return prev;
    const next=Math.max(0,Math.min(t.max,current+delta));
    return {...prev,[t.id]:next};
   });
 }
 async function copyLink(){
   const compact=Object.entries(points).filter(([,v])=>v>0).map(([k,v])=>`${k}:${v}`).join(",");
   const url=new URL(window.location.href);url.searchParams.set("class",classId);url.searchParams.set("lvl",String(level));
   if(compact)url.searchParams.set("p",compact);else url.searchParams.delete("p");
   await navigator.clipboard.writeText(url.toString());
 }
 return <div className="planner-shell">
  <div className="planner-class-tabs">
   {classOrder.map(id=>{const c=plannerTrees[id];return <button key={id} className={"planner-class "+(id===classId?"active":"")} style={{"--class-accent":c.accent} as CSSProperties} onClick={()=>switchClass(id)}>
    <span className="class-glyph">{glyph(id)}</span><strong>{c.name}</strong><small>{c.stat}</small>
   </button>})}
  </div>

  <div className="planner-toolbar game-card">
    <div><div className="eyebrow">YOUR BUILD</div><h2>{tree.name} Combat Talents</h2><p className="muted">{tree.status}</p></div>
    <div className="planner-controls"><label>Hero level<input type="number" min={1} max={70} value={level} onChange={e=>setLevel(Math.max(1,Math.min(70,Number(e.target.value)||1)))}/></label><div className="point-orb"><strong>{spent}</strong><span>/ {level} points</span></div></div>
  </div>

  <div className="planner-sourcebar"><span>{tree.sourceLabel}</span><a href={tree.sourceUrl} target="_blank" rel="noreferrer">Open source ↗</a></div>

  {tree.talents.length===0?<section className="game-card empty-tree"><div className="class-empty-glyph">{glyph(classId)}</div><h2>{tree.name} tree awaiting verified release rows</h2><p>{tree.status}</p><a className="game-btn gold" href={tree.sourceUrl} target="_blank" rel="noreferrer">Open {tree.name} source page</a></section>:
  <div className="interactive-tree">
   {rowThresholds.filter(row=>tree.talents.some(t=>t.row===row)).map(row=>{
    const unlocked=row===0||spent>=row;
    return <section className={"planner-row "+(!unlocked?"locked":"")} key={row}>
     <div className="planner-row-label"><span>{row}</span><small>{row===0?"OPEN":`${row} points spent`}</small></div>
     <div className="planner-nodes">
      {tree.talents.filter(t=>t.row===row).map(t=>{
       const r=rank(t);const usable=canUse(t);
       return <article className={"planner-node "+(r>0?"chosen ":"")+(!usable?"disabled":"")} key={t.id} onClick={()=>change(t,1)} onContextMenu={e=>{e.preventDefault();change(t,-1)}}>
        <div className="node-top"><span className="node-icon">{t.name.slice(0,1)}</span><span className="node-rank">{r}/{t.max}</span></div>
        <h3>{t.name}</h3><p>{t.effect}</p>{t.requires&&<small className="node-requires">Requires {t.requires}</small>}
        <div className="node-actions"><button type="button" onClick={e=>{e.stopPropagation();change(t,-1)}} disabled={r===0}>−</button><button type="button" onClick={e=>{e.stopPropagation();change(t,1)}} disabled={!usable||r>=t.max||available<=0}>+</button></div>
       </article>
      })}
     </div>
    </section>
   })}
  </div>}

  <aside className="planner-summary game-card">
   <div><div className="eyebrow">BUILD SUMMARY</div><h2>{spent} points placed</h2><p className="muted">{available} point{available===1?"":"s"} left at hero level {level}.</p></div>
   <div className="summary-effects">{selected.length?selected.map(t=><div key={t.id}><strong>{t.name}</strong><span>{rank(t)}/{t.max} · {t.effect}</span></div>):<p className="muted">Click a talent to add a point. Right-click or use − to remove one.</p>}</div>
   <div className="cta-row"><button className="game-btn gold" type="button" onClick={copyLink}>Copy build link</button><button className="game-btn" type="button" onClick={()=>setPoints({})}>Start over</button></div>
  </aside>
 </div>
}
