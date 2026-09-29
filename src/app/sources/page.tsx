"use client";
import {useI18n} from "@/components/i18n-provider";
import {dataSources} from "@/lib/deskrawl-data";

export default function SourcesPage(){
 const {t}=useI18n();
 const cards=[
  [t("sources.afkTitle"),t("sources.afkBody"),dataSources[0],"method"],
  [t("sources.releaseTitle"),t("sources.releaseBody"),dataSources[2],"launch"],
  [t("sources.demoTitle"),t("sources.demoBody"),dataSources[1],"demo"],
  [t("sources.saveTitle"),t("sources.saveBody"),dataSources[3],"launch"]
 ] as const;
 return <>
  <div className="eyebrow">{t("sources.eyebrow")}</div><h1 className="page-title">{t("sources.title")}</h1><p className="lead">{t("sources.lead")}</p>
  <div className="spacer"/>
  <div className="source-grid">{cards.map(([title,body,source,kind])=><article className="game-card source-card" key={source.id}><span className={"source-badge "+kind}>{source.kind.toUpperCase()} · {source.snapshot}</span><h2>{title}</h2><p>{body}</p><a href={source.url} target="_blank" rel="noreferrer">{t("common.view")} ↗</a></article>)}</div>
  <div className="spacer"/>
  <section className="game-card"><div className="eyebrow">EVIDENCE RULES</div><h2>Source data ≠ measurement ≠ inference</h2><div className="table-wrap"><table className="data-table"><thead><tr><th>Badge</th><th>Meaning</th><th>How Deskrawl Helper uses it</th></tr></thead><tbody>
   <tr><td>GAME DATA</td><td>Value stored in client-shipped data tables/string tables.</td><td>Shown with snapshot date and source URL.</td></tr>
   <tr><td>MEASURED</td><td>Observed in runs, screenshots or tooltips.</td><td>Kept separate from stored values.</td></tr>
   <tr><td>COMMUNITY</td><td>Player report or build theory.</td><td>Never silently promoted to a game-data fact.</td></tr>
   <tr><td>UNKNOWN</td><td>No reliable source yet.</td><td>Displayed as unknown rather than guessed.</td></tr>
  </tbody></table></div></section>
  <div className="spacer"/>
  <section className="game-card"><div className="eyebrow">IMPORT STRATEGY</div><h2>Where AFK Meta appears to get class/talent data</h2><p className="muted">Their methodology says the game client ships data tables. They decode those tables, infer column meanings by cross-checking values, and validate against what is visible in game. A separate Deskrawl reference likewise says entity names and values were read from the installed build and its string tables. That is the data-provenance model used here: versioned extracted facts, not scraped prose or copied page layouts.</p><p className="muted">For the launch build, a current reference reports 161 talents across four trees. The site architecture now has a versioned data layer so those rows can be imported when we have a directly inspectable release dataset or a game-data export, without rewriting the UI.</p></section>
 </>;
}
