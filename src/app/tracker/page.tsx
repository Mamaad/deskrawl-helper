"use client";
import {TrackerClient} from "@/components/tracker/tracker-client";
import {TrackerGuide} from "@/components/tracker/tracker-guide";
import {useI18n} from "@/components/i18n-provider";

export default function TrackerPage(){
 const {t}=useI18n();
 return <>
  <div className="eyebrow">{t("tracker.eyebrow")}</div>
  <h1 className="page-title">{t("tracker.title")}</h1>
  <p className="lead">{t("tracker.lead")}</p>
  <div className="spacer"/>
  <TrackerGuide/>
  <div className="spacer"/>
  <TrackerClient/>
 </>;
}
