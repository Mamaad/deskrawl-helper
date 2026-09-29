"use client";
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import {getMessage,localeNames,locales,type Locale} from "@/lib/i18n";

type I18nContextValue={locale:Locale;setLocale:(locale:Locale)=>void;t:(key:string)=>string};
const I18nContext=createContext<I18nContextValue|null>(null);

export function I18nProvider({children}:{children:ReactNode}){
  const [locale,setLocaleState]=useState<Locale>("en");
  useEffect(()=>{
    const saved=window.localStorage.getItem("deskrawl-locale") as Locale|null;
    const browser=navigator.language;
    const candidate=saved??(locales.includes(browser as Locale)?browser as Locale:browser.startsWith("fr")?"fr":browser.startsWith("de")?"de":browser.startsWith("es")?"es":browser.startsWith("zh")?"zh-CN":browser.startsWith("ja")?"ja":browser.startsWith("ko")?"ko":browser.startsWith("pl")?"pl":browser.startsWith("pt")?"pt-BR":browser.startsWith("ru")?"ru":"en");
    if(locales.includes(candidate))setLocaleState(candidate);
  },[]);
  const setLocale=(value:Locale)=>{setLocaleState(value);window.localStorage.setItem("deskrawl-locale",value);document.documentElement.lang=value};
  const value=useMemo(()=>({locale,setLocale,t:(key:string)=>getMessage(locale,key)}),[locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
export function useI18n(){const ctx=useContext(I18nContext);if(!ctx)throw new Error("useI18n must be inside I18nProvider");return ctx}
export {localeNames,locales};
