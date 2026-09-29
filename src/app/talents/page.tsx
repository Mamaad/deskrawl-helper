"use client";
import Link from "next/link";
import {useState} from "react";
import {heroData,releaseStats,warriorTalents} from "@/lib/deskrawl-data";
import {useI18n} from "@/components/i18n-provider";

export default function TalentsPage(){
 const {t}=useI18n();
 const [hero,setHero]=useState("Warrior");
 const rows=[0,5,10,15,20];

 return <>
  <div className="eyebrow">{t("talents.eyebrow")}</div>
  <h1 className="page-title">{t("talents.title")}</h1>
  <p className="lead">{t("talents.lead")}</p>

  <div className="stat-grid" style={{marginTop:30}}>
   <div className="stat-chip"><strong>{releaseStats.talents}</strong><span>{t("talents.current")}</span></div>
   <div className="stat-chip"><strong>4</strong><span>Talent trees</span></div>
   <div className="stat-chip"><strong>29</strong><span>Warrior named · demo</span></div>
   <div className="stat-chip"><strong>{releaseStats.maxLevel}</strong><span>Max level · launch ref</span></div>
   <div className="stat-chip"><strong>56</strong><span>Abilities · launch ref</span></div>
   <div className="stat-chip"><strong>2026-09-29</strong><span>Release snapshot</span></div>
  </div>

  <div className="notice">{t("talents.sourceWarn")}</div>

  <div className="hero-tabs">
   {heroData.map(h=><button className={"hero-tab "+(h.name==="Warrior"?"imported":"")} key={h.name} onClick={()=>setHero(h.name)}>
    <strong>{h.name}</strong><span>{h.stat}</span>
   </button>)}
  </div>

  {hero==="Warrior"?<>
    <div className="section-head">
      <div><div className="eyebrow">WARRIOR · COMBAT TALENTS</div><h2>{t("talents.demo")} · 2026-09-27</h2></div>
      <span className="source-badge demo">AFK META · DEMO</span>
    </div>
    <div className="talent-rows">
      {rows.map(row=><section className="talent-row" key={row}>
        <div className="row-label">ROW {row} · {row===0?"OPEN":row+" SPENT"}</div>
        <div className="talent-grid">{warriorTalents.filter(x=>x.row===row).map(x=><article className="talent-node" key={x.name}>
          <h3>{x.name}</h3><p>{x.effect}</p>
          <div className="talent-meta">
            <span className="mini-chip">{x.maxPoints} {t("talents.points")}</span>
            {x.requires&&<span className="mini-chip">{t("talents.requires")}: {x.requires}</span>}
          </div>
        </article>)}</div>
      </section>)}
    </div>
   </>:<section className="game-card">
    <span className="source-badge launch">{t("common.launch")} · 2026-09-29</span>
    <h2>{hero}</h2>
    <p className="lead" style={{fontSize:16}}>{heroData.find(x=>x.name===hero)?.note}</p>
    <div className="notice">{t("common.notImported")}. The release index confirms the class has its own talent tree; this site will not backfill it with stale demo placeholders or unsourced guide names.</div>
   </section>}

  <div className="spacer"/>
  <section className="game-card">
    <div className="eyebrow">PROVENANCE</div>
    <h2>Why the trees look uneven right now</h2>
    <p className="muted">AFK Meta’s publicly indexed Deskrawl talent snapshot is from 27 September and exposes the Warrior’s 29 named demo talents. A launch-day reference indexed on 29 September reports 161 talents across four class trees. Until the release rows are available from a directly verifiable dataset, Deskrawl Helper keeps the old Warrior snapshot separate instead of pretending demo placeholders are current class data.</p>
    <Link className="game-btn gold" href="/sources">Data sources</Link>
  </section>
 </>;
}
