import { siteConfig, xProfileUrl } from "@/lib/site";
import { Hero } from "@/components/sections/Hero";
import { TopNav } from "@/components/TopNav";
import { Concept } from "@/components/sections/Concept";
import { Format } from "@/components/sections/Format";
import { Room } from "@/components/sections/Room";
import { Sponsors } from "@/components/sections/Sponsors";
import { Participants } from "@/components/sections/Participants";
import { Status } from "@/components/sections/Status";
import { ApplyCta } from "@/components/sections/ApplyCta";
import { SponsorCta } from "@/components/sections/SponsorCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <TopNav />
      <Concept />
      <Format />
      <Room />
      <Sponsors />
      <Participants />
      <Status />
      <ApplyCta />
      <SponsorCta
        contactEmail={siteConfig.contactEmail}
        contactXHandle={siteConfig.contactXHandle}
        xUrl={xProfileUrl}
      />
      <Footer
        contactEmail={siteConfig.contactEmail}
        contactXHandle={siteConfig.contactXHandle}
        xUrl={xProfileUrl}
      />
    </main>
  );
}
