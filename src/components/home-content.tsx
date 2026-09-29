"use client";
import Link from "next/link";
import {useI18n} from "@/components/i18n-provider";
import {releaseStats} from "@/lib/deskrawl-data";

export function HomeContent(){
 const {t}=useI18n();
 const stats=[[releaseStats.heroes,t("home.heroes")],[releaseStats.abilities,t("home.abilities")],[releaseStats.talents,t("home.talentCount")],[releaseStats.equipment,t("home.items")],[releaseStats.minions,t("home.minions")],[releaseStats.enemies,t("home.enemies")]];
 const features=[["01",t("home.privacy"),t("home.privacyDesc")],["02",t("home.provenance"),t("home.provenanceDesc")],["03",t("home.community"),t("home.communityDesc")]];
 return <>
  <section className="hero">
   <div className="hero-copy">
    <div className="eyebrow">{t("home.eyebrow")}</div>
    <h1>{t("home.title")}</h1>
    <p className="lead">{t("home.lead")}</p>
    <div className="cta-row"><Link className="game-btn primary" href="/tracker">{t("home.track")}</Link><Link className="game-btn gold" href="/talents">{t("home.talents")}</Link></div>
   </div>
   <aside className="game-card hero-terminal">
    <div><span className="source-badge launch">{t("common.launch")} · 2026-09-29</span><div className="sigil"><span>D</span></div></div>
    <div><div className="terminal-row"><span>DATASET</span><strong>{t("home.data")}</strong></div><div className="terminal-row"><span>MAX LEVEL</span><strong>{releaseStats.maxLevel}</strong></div><div className="terminal-row"><span>MODE</span><strong>NORMAL // NIGHTMARE // INFERNO</strong></div></div>
   </aside>
  </section>
  <section className="stat-grid">{stats.map(([n,label])=><div className="stat-chip" key={String(label)}><strong>{n}</strong><span>{label}</span></div>)}</section>
  <section><div className="section-head"><div><div className="eyebrow">SYSTEMS</div><h2>Built like a tool, not a landing-page template.</h2></div></div><div className="feature-grid">{features.map(([num,title,desc])=><article className="game-card feature-card" key={String(num)}><span className="num">{num}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
 </>;
}
