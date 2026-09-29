"use client";
import {Planner} from "@/components/planner/planner";
import {useI18n} from "@/components/i18n-provider";
export default function Page(){const {t}=useI18n();return <><div className="eyebrow">THEORYCRAFT // SANDBOX</div><h1 className="page-title">{t("planner.title")}</h1><p className="lead">Generic calculation sandbox plus the versioned game-data foundation. Formulas are not labelled Deskrawl-exact until a source verifies them.</p><div className="spacer"/><Planner/></>}
