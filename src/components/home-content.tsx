"use client";
import Link from "next/link";
import {useI18n} from "@/components/i18n-provider";
import {releaseStats} from "@/lib/deskrawl-data";
import {BrandMark} from "@/components/brand-mark";

export function HomeContent(){
 const {t}=useI18n();
 const stats=[[releaseStats.heroes,t("home.heroes")],[releaseStats.abilities,t("home.abilities")],[releaseStats.talents,t("home.talentCount")],[releaseStats.equipment,t("home.items")],[releaseStats.minions,t("home.minions")],[releaseStats.enemies,t("home.enemies")]];
 const features=[["TRACK",t("home.privacy"),t("home.privacyDesc")],["PLAN",t("home.provenance"),t("home.provenanceDesc")],["SHARE",t("home.community"),t("home.communityDesc")]];
 return <>
  <section className="hero new-home-hero">
   <div className="hero-copy">
    <div className="eyebrow">{t("home.eyebrow")}</div>
    <h1>Know the grind.<br/>Build the next run.</h1>
    <p className="lead">Deskrawl data, local Game.log tracking and talent planning in one community tool — built to feel like an ARPG utility, not a startup dashboard.</p>
    <div className="cta-row"><Link className="game-btn primary" href="/tracker">{t("home.track")}</Link><Link className="game-btn gold" href="/talents">{t("home.talents")}</Link></div>
   </div>
   <aside className="home-command">
    <div className="home-mark"><BrandMark/><span>FIELD TOOLKIT</span></div>
    <div className="hero-manifest">
      <div><span>01</span><b>WARRIOR</b><small>Strength · melee</small></div>
      <div><span>02</span><b>SORCERER</b><small>Intelligence · ranged</small></div>
      <div><span>03</span><b>HUNTER</b><small>Dexterity · ranged</small></div>
      <div><span>04</span><b>MONK</b><small>Dexterity · melee</small></div>
    </div>
    <div className="home-command-foot"><span>LAUNCH REFERENCE · 29 SEP 2026</span><strong>LV {releaseStats.maxLevel}</strong></div>
   </aside>
  </section>
  <section className="stat-grid">{stats.map(([n,label])=><div className="stat-chip" key={String(label)}><strong>{n}</strong><span>{label}</span></div>)}</section>
  <section><div className="section-head"><div><div className="eyebrow">TOOLS, NOT FILLER</div><h2>Three things players actually need.</h2></div></div><div className="feature-grid">{features.map(([num,title,desc])=><article className="game-card feature-card" key={String(num)}><span className="num">{num}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
 </>;
}
