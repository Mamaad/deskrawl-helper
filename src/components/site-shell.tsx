"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {localeNames,locales,useI18n} from "@/components/i18n-provider";
import {BrandMark} from "@/components/brand-mark";
import type {ReactNode} from "react";

const links=[["/","nav.home"],["/tracker","nav.tracker"],["/talents","nav.talents"],["/builds","nav.builds"],["/planner","nav.planner"],["/sources","nav.sources"]] as const;

export function SiteShell({children}:{children:ReactNode}){
  const {locale,setLocale,t}=useI18n();const path=usePathname();
  return <div className="shell">
    <div className="scanlines" aria-hidden="true"/>
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand"><span className="brand-mark-wrap"><BrandMark className="brand-mark"/></span><span><b>DESKRAWL HELPER</b><small>{t("brand.tag")}</small></span></Link>
        <nav className="nav">{links.map(([href,key])=><Link key={href} href={href} className={path===href?"active":""}>{t(key)}</Link>)}</nav>
        <select className="lang" value={locale} onChange={e=>setLocale(e.target.value as typeof locale)} aria-label="Language">
          {locales.map(l=><option key={l} value={l}>{localeNames[l]}</option>)}
        </select>
      </div>
    </header>
    <main className="page">{children}</main>
    <footer className="footer"><span>DESKRAWL HELPER // UNOFFICIAL COMMUNITY TOOL</span><span>DATA IS VERSIONED · UNKNOWN ≠ ZERO</span></footer>
  </div>
}
