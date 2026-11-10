import Capabilities from "@/components/Capabilities";
import BootIntro from "@/components/effects/BootIntro";
import Crosshair from "@/components/effects/Crosshair";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import LinkCards from "@/components/LinkCards";
import Products from "@/components/Products";
import RevealObserver from "@/components/RevealObserver";
import SectionDivider from "@/components/SectionDivider";
import Stats from "@/components/Stats";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#work">
        К проектам
      </a>
      <BootIntro />
      <RevealObserver />
      <Crosshair />
      <Header />
      <div className="page">
        <main className="stack">
          <Hero />
          <LinkCards />
          <Stats />
          <SectionDivider number="01" title="Веб" text="Сайты с характером — от лендингов до целых продуктов." count="06 проектов" />
          <Work />
          <SectionDivider number="02" title="Продукты" text="Инструменты для разработчиков и AI, голос и Telegram." count="08 репозиториев" />
          <Products />
          <Capabilities />
        </main>
        <Contact />
      </div>
    </>
  );
}
