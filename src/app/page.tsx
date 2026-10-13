import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Impact } from "@/components/sections/impact";
import { Events } from "@/components/sections/events";
import { Bengaluru } from "@/components/sections/bengaluru";
import { Collaborate } from "@/components/sections/collaborate";
import { Ecosystem } from "@/components/sections/ecosystem";
import { People } from "@/components/sections/people";
import { Join } from "@/components/sections/join";
import { Footer } from "@/components/sections/footer";
// Classify dates at request time, not at build time.
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Impact />
        <Events />
        <Bengaluru />
        <Collaborate />
        <Ecosystem />
        <People />
        <Join />
      </main>
      <Footer />
    </>
  );
}
