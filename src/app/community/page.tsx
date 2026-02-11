import CommunityNavigation from "@/components/community-navigation";
import CommunityHero from "@/components/sections/community/hero";
import CommunityAbout from "@/components/sections/community/about";
import PastEvents from "@/components/sections/community/past-events";
import UpcomingEvents from "@/components/sections/community/upcoming-events";
import EventProposal from "@/components/sections/community/event-proposal";
import PastCollaborations from "@/components/sections/community/past-collaborations";
import Footer from "@/components/sections/footer";
import ParallaxWrapper from "@/components/parallax-wrapper";
import LatestArticles from "@/components/sections/community/LatestArticles";
import DevHub from "@/components/sections/community/dev-hub";

export default function CommunityPage() {
  return (
    <main className="min-h-screen">
      <CommunityNavigation />
      <section id="hero" className="flex items-center justify-center max-h-screen min-h-screen">
        <CommunityHero />
      </section>
      <section id="about" className="flex items-center justify-center max-h-screen min-h-screen">
        <ParallaxWrapper speed={0.3}>
          <CommunityAbout />
        </ParallaxWrapper>
      </section>
      <section id="dev-hub" className="flex items-center justify-center max-h-screen min-h-screen">
        <ParallaxWrapper speed={0.4}>
          <DevHub />
        </ParallaxWrapper>
      </section>
      <section id="past-events">
        <ParallaxWrapper speed={0.4}>
          <PastEvents />
        </ParallaxWrapper>
      </section>
      <section id="upcoming-events" className="flex items-center justify-center max-h-screen min-h-screen">
        <ParallaxWrapper speed={0.2}>
          <UpcomingEvents />
        </ParallaxWrapper>
      </section>
      <section id="latest-articles" className="flex items-center justify-center max-h-screen min-h-screen">
        <ParallaxWrapper speed={0.2}>
          <LatestArticles />
        </ParallaxWrapper>
      </section>
      <section id="event-proposal" className="flex items-center justify-center max-h-screen min-h-screen">
        <ParallaxWrapper speed={0.5}>
          <EventProposal />
        </ParallaxWrapper>
      </section>
      <section id="collaborations" className="flex items-center justify-center max-h-screen min-h-screen">
        <ParallaxWrapper speed={0.3}>
          <PastCollaborations />
        </ParallaxWrapper>
      </section>
      <Footer />
    </main>
  );
}
