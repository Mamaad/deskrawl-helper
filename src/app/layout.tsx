import "./globals.css";
import {I18nProvider} from "@/components/i18n-provider";
import {SiteShell} from "@/components/site-shell";

export const metadata={
  title:{default:"Deskrawl Helper",template:"%s · Deskrawl Helper"},
  description:"Community Deskrawl tracker, talent lab, build planner and versioned game-data reference."
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><I18nProvider><SiteShell>{children}</SiteShell></I18nProvider></body></html>
}
