"use client";
import {TrackerClient} from "@/components/tracker/tracker-client";
import {QuickOpenGameLog} from "@/components/tracker/quick-open-game-log";
import {useI18n} from "@/components/i18n-provider";

const fallbackSearchCommand='Get-ChildItem -Path "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Deskrawl" -Filter game.log -Recurse -ErrorAction SilentlyContinue';

export default function TrackerPage(){
 const {t}=useI18n();
 return <>
  <div className="eyebrow">{t("tracker.eyebrow")}</div>
  <h1 className="page-title">{t("tracker.title")}</h1>
  <p className="lead">{t("tracker.lead")}</p>

  <div className="spacer"/><QuickOpenGameLog/><div className="spacer"/>
  <TrackerClient/><div className="spacer"/>

  <section className="game-card">
   <div className="section-head">
    <div><div className="eyebrow">MANUAL FALLBACK</div><h2>{t("tracker.findTitle")}</h2></div>
    <span className="source-badge launch">Steam</span>
   </div>

   <div className="steps">
    <div className="step">{t("tracker.find1")}</div>
    <div className="step">{t("tracker.find2")}</div>
    <div className="step">{t("tracker.find3")}</div>
    <div className="step">{t("tracker.find4")}</div>
   </div>

   <div className="ornament"/>
   <div className="notice">{t("tracker.saveNote")}</div>
   <div className="spacer"/>
   <div className="code">{fallbackSearchCommand}</div>
  </section>
 </>;
}
