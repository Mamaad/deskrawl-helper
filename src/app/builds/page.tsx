"use client";
import Link from "next/link";
import {BuildCard} from "@/components/builds/build-card";
import {demoBuilds} from "@/lib/data/demo-builds";
import {useI18n} from "@/components/i18n-provider";

export default function Builds(){
  const {t}=useI18n();
  return <>
    <div className="eyebrow">COMMUNITY LOADOUT ARCHIVE</div>
    <h1 className="page-title">{t("builds.title")}</h1>
    <p className="lead">Build sharing is scaffolded; current cards are explicitly marked demo data until PostgreSQL + auth writes are enabled.</p>
    <div className="cta-row"><Link href="/builds/new" className="game-btn primary">Create Build</Link></div>
    <div className="talent-grid" style={{marginTop:28}}>{demoBuilds.map(b=><BuildCard key={b.slug} build={b}/>)}</div>
  </>;
}
