"use client";
import {TalentPlanner} from "@/components/talents/talent-planner";
import {talentSnapshot} from "@/lib/talent-planner-data";

export default function TalentsPage(){
 return <>
  <div className="talent-page-intro">
   <div>
    <div className="eyebrow">COMBAT TALENTS // LIVE DATA SNAPSHOT</div>
    <h1 className="page-title">Build the tree.</h1>
    <p className="lead">All four class trees are loaded from the current AFK Meta Deskrawl talent pages. Spend points directly on the constellation, inspect a talent, switch to the full combat table, or browse all Life Skills.</p>
   </div>
   <div className="talent-data-stamp"><strong>{talentSnapshot.combatTalentCount}</strong><span>combat talent rows</span><b>+</b><strong>{talentSnapshot.lifeSkillCount}</strong><span>Life Skills</span></div>
  </div>
  <TalentPlanner/>
 </>;
}
