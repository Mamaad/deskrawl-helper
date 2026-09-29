import {notFound} from "next/navigation";
import Link from "next/link";
import {demoBuilds} from "@/lib/data/demo-builds";

export default async function BuildDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const build=demoBuilds.find(b=>b.slug===slug);
  if(!build)notFound();
  const sections=[["Skills",build.skills],["Talents",build.talents],["Equipment",build.items],["Runes",build.runes]] as const;
  return <article>
    <div className="eyebrow">COMMUNITY LOADOUT // {build.className}</div>
    <h1 className="page-title">{build.title}</h1>
    <p className="lead">{build.description}</p>
    <div className="cta-row">
      <span className="source-badge">{build.className}</span>
      <span className="source-badge">PATCH {build.gameVersion}</span>
      <span className="source-badge">▲ {build.votes}</span>
      <span className="source-badge">{build.author}</span>
    </div>
    {build.demo&&<div className="notice" style={{margin:"22px 0"}}>DEMO DATA // This loadout exists to test the community-build UI. It is not presented as a verified Deskrawl meta build.</div>}
    <div className="talent-grid" style={{marginTop:24}}>
      {sections.map(([title,values])=><section className="game-card" key={title}><div className="eyebrow">LOADOUT</div><h2>{title}</h2><div className="talent-meta">{values.map(v=><span className="mini-chip" key={v}>{v}</span>)}</div></section>)}
    </div>
    <section className="game-card" style={{marginTop:18}}>
      <div className="eyebrow">COMMUNITY</div><h2>Comments & fork</h2>
      <p className="muted">Persistent comments, votes and build forks activate when authentication and PostgreSQL writes are enabled.</p>
      <div className="cta-row"><button className="game-btn primary">Copy Build</button><Link className="game-btn" href="/builds">Back to archive</Link></div>
    </section>
  </article>
}
