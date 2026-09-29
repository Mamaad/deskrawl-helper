"use client";
import {TalentPlanner} from "@/components/talents/talent-planner";
import {useI18n} from "@/components/i18n-provider";

export default function TalentsPage(){
 const {t}=useI18n();
 return <>
  <div className="eyebrow">{t("talents.eyebrow")}</div>
  <h1 className="page-title">{t("talents.title")}</h1>
  <p className="lead">Pick a class, spend points directly on the tree, remove them with − or right-click, and copy a build link. The interaction follows the same planner idea as AFK Meta without copying its page layout.</p>
  <div className="spacer"/>
  <TalentPlanner/>
 </>;
}
