"use client";

import {useEffect,useMemo,useState,type CSSProperties, type MouseEvent} from "react";
import {lifeSkills,plannerTrees,talentElement,talentSnapshot,type PlannerClass,type PlannerTalent} from "@/lib/talent-planner-data";

const classOrder:PlannerClass[]=["warrior","sorcerer","hunter","monk"];
type ViewMode="tree"|"table"|"life";

function glyph(id:PlannerClass){return id==="warrior"?"⚔":id==="sorcerer"?"✦":id==="hunter"?"➶":"◉"}
function formatDate(value:string){const d=new Date(value);return Number.isNaN(d.getTime())?value:d.toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"})}

export function TalentPlanner(){
 const [classId,setClassId]=useState<PlannerClass>("sorcerer");
 const [heroLevel,setHeroLevel]=useState(70);
 const [points,setPoints]=useState<Record<string,number>>({});
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const [mode,setMode]=useState<ViewMode>("tree");
 const [query,setQuery]=useState("");
 const tree=plannerTrees[classId];
 const budget=Math.max(0,heroLevel-1);
 const spent=Object.values(points).reduce((a,b)=>a+b,0);
 const available=Math.max(0,budget-spent);
 const rows=useMemo(()=>[...new Set(tree.talents.map(t=>t.row))].sort((a,b)=>a-b),[tree]);
 const selected=tree.talents.find(t=>t.id===selectedId)??null;

 useEffect(()=>{
   const q=new URLSearchParams(window.location.search);
   const requested=q.get("class") as PlannerClass|null;
   const nextClass=requested&&classOrder.includes(requested)?requested:"sorcerer";
   const nextLevel=Math.max(1,Math.min(70,Number(q.get("lvl"))||70));
   const allowed=new Map(plannerTrees[nextClass].talents.map(t=>[t.id,t.max]));
   const parsed:Record<string,number>={};
   for(const pair of (q.get("p")??"").split(",")){
     const [id,raw]=pair.split(":");const max=allowed.get(id);const value=Number(raw);
     if(max&&Number.isFinite(value)&&value>0)parsed[id]=Math.min(max,Math.floor(value));
   }
   setClassId(nextClass);setHeroLevel(nextLevel);setPoints(parsed);
 },[]);

 function switchClass(id:PlannerClass){
   setClassId(id);setPoints({});setSelectedId(null);setQuery("");
 }
 function rank(t:PlannerTalent){return points[t.id]??0}
 function rowUnlocked(t:PlannerTalent){return t.row===0||spent>=t.row}
 function prerequisiteMet(t:PlannerTalent){
   if(!t.requires||t.requires==="—")return true;
   const req=tree.talents.find(x=>x.name===t.requires);
   return !req||(points[req.id]??0)>=req.max;
 }
 function canAdd(t:PlannerTalent){return available>0&&rank(t)<t.max&&rowUnlocked(t)&&prerequisiteMet(t)}
 function canRemove(t:PlannerTalent){
   const r=rank(t);if(r<=0)return false;
   const nextSpent=spent-1;
   return tree.talents.every(other=>{
     if(other.id===t.id)return true;
     return (points[other.id]??0)===0||other.row<=nextSpent;
   });
 }
 function change(t:PlannerTalent,delta:number){
   if(delta>0&&!canAdd(t))return;
   if(delta<0&&!canRemove(t))return;
   setPoints(prev=>({...prev,[t.id]:Math.max(0,Math.min(t.max,(prev[t.id]??0)+delta))}));
 }
 function talentClick(t:PlannerTalent,e:MouseEvent){
   setSelectedId(t.id);
   if(e.shiftKey)change(t,-1);else change(t,1);
 }
 async function copyLink(){
   const compact=Object.entries(points).filter(([,v])=>v>0).map(([k,v])=>`${k}:${v}`).join(",");
   const url=new URL(window.location.href);
   url.searchParams.set("class",classId);url.searchParams.set("lvl",String(heroLevel));
   if(compact)url.searchParams.set("p",compact);else url.searchParams.delete("p");
   await navigator.clipboard.writeText(url.toString());
 }
 const filteredTalents=tree.talents.filter(t=>(t.name+" "+t.effect).toLowerCase().includes(query.toLowerCase()));
 const filteredLife=lifeSkills.filter(t=>(t.name+" "+t.requires+" "+t.effects).toLowerCase().includes(query.toLowerCase()));

 return <div className="constellation">
  <header className="constellation-head">
   <div className="class-medallions">
    {classOrder.map(id=>{const c=plannerTrees[id];return <button key={id} onClick={()=>switchClass(id)} className={"class-medallion "+(id===classId?"active":"")} style={{"--class-accent":c.accent} as CSSProperties}>
      <span>{glyph(id)}</span><b>{c.name}</b><small>{c.stat}</small>
    </button>})}
   </div>
   <div className="talent-hud">
    <label><span>Hero level</span><input type="number" min={1} max={70} value={heroLevel} onChange={e=>setHeroLevel(Math.max(1,Math.min(70,Number(e.target.value)||1)))}/></label>
    <div className="hud-points"><strong>{spent}</strong><span>/ {budget}</span><small>{available} free</small></div>
    <button type="button" onClick={copyLink}>COPY BUILD</button>
    <button type="button" onClick={()=>setPoints({})}>RESET</button>
   </div>
  </header>

  <div className="source-strip">
    <span><i/> {tree.talents.length} {tree.name} talents · {talentSnapshot.lifeSkillCount} Life Skills · snapshot {formatDate(talentSnapshot.fetchedAt)}</span>
    <a href={tree.sourceUrl} target="_blank" rel="noreferrer">AFK META SOURCE ↗</a>
  </div>

  <nav className="talent-view-tabs">
   <button className={mode==="tree"?"active":""} onClick={()=>setMode("tree")}>CONSTELLATION</button>
   <button className={mode==="table"?"active":""} onClick={()=>setMode("table")}>COMBAT TABLE</button>
   <button className={mode==="life"?"active":""} onClick={()=>setMode("life")}>LIFE SKILLS <em>{lifeSkills.length}</em></button>
  </nav>

  {mode==="tree"&&<div className="constellation-layout">
   <main className="talent-sky" style={{"--class-accent":tree.accent} as CSSProperties}>
    <div className="sky-title"><span>{glyph(classId)}</span><div><b>{tree.name}</b><small>Left click adds · Shift/right click removes</small></div></div>
    <div className="tier-stack">
     {rows.map((row,rowIndex)=>{
      const talents=tree.talents.filter(t=>t.row===row);
      const unlocked=row===0||spent>=row;
      return <section className={"talent-tier "+(unlocked?"unlocked":"locked")} key={row}>
       {rowIndex>0&&<div className="tier-bridge" aria-hidden="true"/>}
       <div className="tier-gate"><strong>{row}</strong><span>{row===0?"START":"SPENT"}</span></div>
       <div className="orb-field">
        {talents.map(t=>{
         const r=rank(t),element=talentElement(t),can=canAdd(t);
         return <div className={"orb-unit "+element+(r>0?" invested":"")} key={t.id}>
          <button
           type="button"
           className="talent-orb"
           title={t.effect}
           onClick={e=>talentClick(t,e)}
           onContextMenu={e=>{e.preventDefault();setSelectedId(t.id);change(t,-1)}}
           disabled={!unlocked&&r===0}
           aria-label={`${t.name}, ${r} of ${t.max} points`}
          >
           <span className="orb-core">{t.name.slice(0,1)}</span>
           <span className="orb-rank">{r}/{t.max}</span>
           {can&&<span className="orb-pulse"/>}
          </button>
          <button className="orb-name" onClick={()=>setSelectedId(t.id)}>{t.name}</button>
         </div>
        })}
       </div>
      </section>
     })}
    </div>
   </main>

   <aside className="talent-inspector" style={{"--class-accent":tree.accent} as CSSProperties}>
    {selected?<>
      <div className={"inspect-sigil "+talentElement(selected)}>{selected.name.slice(0,1)}</div>
      <span className="inspect-tier">TIER {selected.row}</span>
      <h2>{selected.name}</h2>
      <div className="inspect-rank"><span>RANK</span><strong>{rank(selected)} / {selected.max}</strong></div>
      <p>{selected.effect}</p>
      {selected.requires!=="—"&&<small>Requires: {selected.requires}</small>}
      <div className="inspect-actions">
       <button onClick={()=>change(selected,-1)} disabled={!canRemove(selected)}>−</button>
       <button onClick={()=>change(selected,1)} disabled={!canAdd(selected)}>+</button>
      </div>
    </>:<>
      <div className="inspect-sigil empty">{glyph(classId)}</div>
      <span className="inspect-tier">BUILD INSPECTOR</span>
      <h2>Select a talent</h2>
      <p>Choose any orb to see its full effect. The row number is how many points must already be spent to open that tier.</p>
    </>}
    <div className="invested-list">
     <span>ALLOCATED</span>
     {tree.talents.filter(t=>rank(t)>0).map(t=><button key={t.id} onClick={()=>setSelectedId(t.id)}><b>{t.name}</b><em>{rank(t)}/{t.max}</em></button>)}
     {spent===0&&<small>No points placed yet.</small>}
    </div>
   </aside>
  </div>}

  {(mode==="table"||mode==="life")&&<section className="talent-ledger-wrap">
   <div className="ledger-toolbar">
    <div><span>{mode==="table"?"COMBAT TALENTS":"LIFE SKILLS"}</span><strong>{mode==="table"?tree.talents.length:lifeSkills.length} entries</strong></div>
    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={mode==="table"?"Search talent or effect…":"Search Life Skill, requirement or effect…"}/>
   </div>
   {mode==="table"?<div className="ledger-scroll"><table className="talent-ledger">
    <thead><tr><th>Talent</th><th>Tier</th><th>Rank</th><th>Requires</th><th>At max</th><th/></tr></thead>
    <tbody>{filteredTalents.map(t=><tr key={t.id} className={rank(t)>0?"active":""}>
      <td><span className={"ledger-gem "+talentElement(t)}/><button className="ledger-name" onClick={()=>{setMode("tree");setSelectedId(t.id)}}>{t.name}</button></td>
      <td>{t.row}</td><td><b>{rank(t)}</b> / {t.max}</td><td>{t.requires}</td><td>{t.effect}</td>
      <td><div className="ledger-stepper"><button onClick={()=>change(t,-1)} disabled={!canRemove(t)}>−</button><button onClick={()=>change(t,1)} disabled={!canAdd(t)}>+</button></div></td>
    </tr>)}</tbody>
   </table></div>:<div className="ledger-scroll"><table className="talent-ledger life-ledger">
    <thead><tr><th>#</th><th>Life Skill</th><th>Requires</th><th>Gold</th><th>Effect</th></tr></thead>
    <tbody>{filteredLife.map(skill=><tr key={skill.index}><td>{skill.index}</td><td><b>{skill.name}</b></td><td>{skill.requires}</td><td className="gold-cell">{skill.gold}</td><td>{skill.effects}</td></tr>)}</tbody>
   </table></div>}
  </section>}
 </div>
}
