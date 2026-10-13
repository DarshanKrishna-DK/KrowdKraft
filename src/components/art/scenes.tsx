import Image from "next/image";
import { Icon } from "@/components/icon";
export function ComputerScene() {
  return (
    <div className="computer-scene" aria-hidden="true" data-parallax>
      <div className="scene-orbit orbit-one" />
      <div className="scene-orbit orbit-two" />
      <svg className="signal-lines" viewBox="0 0 700 650" fill="none">
        <path
          className="wire"
          d="M0 470C150 470 90 240 270 240S360 80 700 80M40 570C240 570 80 380 300 380S420 580 700 520"
        />
        <path
          className="signal"
          d="M0 470C150 470 90 240 270 240S360 80 700 80"
        />
      </svg>
      <div className="floating-code glass">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mono muted">a little idea.ts</span>
        <code>
          <span className="code-lilac">const</span> yourPeople ={" "}
          <span className="code-lime">await</span>
          <br />
          &nbsp;&nbsp;community.<span className="code-coral">find</span>
          (&apos;you&apos;);
          <br />
          <br />
          <span className="code-comment">{"// better things, together."}</span>
        </code>
      </div>
      <Image
        className="computer-art"
        src="/art/clubhouse-computer.webp"
        width={1200}
        height={800}
        alt=""
        priority
        sizes="(max-width: 767px) 100vw, 58vw"
      />
      <div className="screen-copy">
        <span className="terminal-prompt">
          &gt; hello, bengaluru<span className="terminal-caret">_</span>
        </span>
        <span>
          find your people.
          <br />
          build your thing.
        </span>
      </div>
      <div className="glass-chip chip-branch">
        <Icon name="branch" />
        <span>ideas → pull requests</span>
      </div>
      <div className="clay-key">&lt;/&gt;</div>
      <div className="scene-star">
        <Icon name="spark" size={46} />
      </div>
      <span className="scene-coordinate mono">12.9716° N / 77.5946° E</span>
    </div>
  );
}
export function OrbitScene() {
  return (
    <div className="orbit-scene" aria-hidden="true" data-parallax>
      <div className="product-orbit ring-a" />
      <div className="product-orbit ring-b" />
      <div className="product-core">
        <Icon name="code" size={72} />
      </div>
      <div className="orbit-node node-a glass">
        <Icon name="globe" size={34} />
      </div>
      <div className="orbit-node node-b clay-small">
        <Icon name="branch" size={31} />
      </div>
      <div className="orbit-label glass">made by the Krowd</div>
      <span className="orbit-satellite" />
    </div>
  );
}
export function SpotlightScene() {
  return (
    <div className="spotlight-scene" aria-hidden="true" data-parallax>
      <div className="spot-beam" />
      <div className="award-ribbon ribbon-left" />
      <div className="award-ribbon ribbon-right" />
      <div className="award">
        <div className="award-inner">
          <Icon name="star" size={78} />
        </div>
      </div>
      <div className="award-caption glass">
        <span className="mini-star">✧</span> a little well-deserved spotlight
      </div>
      <span className="award-spark spark-a">✧</span>
      <span className="award-spark spark-b">✧</span>
    </div>
  );
}
export function JournalCover({ variant }: { variant: string }) {
  return (
    <div className={`journal-cover cover-${variant}`} aria-hidden="true">
      {variant === "certification" ? (
        <>
          <div className="paper-certificate">
            <span />
            <span />
            <span />
            <i>✓</i>
          </div>
          <div className="certificate-seal">
            <Icon name="star" size={25} />
          </div>
        </>
      ) : variant === "code" ? (
        <>
          <span className="code-book">&lt;/&gt;</span>
          <span className="dsa-orb">{`{ }`}</span>
          <span className="cover-amp">&</span>
        </>
      ) : (
        <>
          <div className="compass-disc">
            <Icon name="diagonal" size={80} />
          </div>
          <span className="compass-n">N</span>
          <i className="compass-orbit" />
        </>
      )}
    </div>
  );
}
export function ContributionGarden() {
  return (
    <div className="contribution-garden" aria-hidden="true">
      <div className="garden-label mono">a little progress, every day.</div>
      <div className="garden-grid">
        {Array.from({ length: 105 }, (_, i) => (
          <i key={i} className={`grow-${(i * 7 + Math.floor(i / 9)) % 5}`} />
        ))}
      </div>
      <div className="garden-caption">
        Your next green square starts with an idea.
      </div>
    </div>
  );
}
