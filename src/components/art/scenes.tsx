import { Icon } from "@/components/icon";
export function WorkbenchScene() {
  return (
    <div className="workbench-scene" aria-hidden="true">
      <div className="workbench-halo" />
      <div className="workbench-window">
        <div className="workbench-chrome">
          <i />
          <i />
          <i />
        </div>
        <div className="workbench-content">
          <Icon name="code" size={60} />
          <span>
            made by
            <br />
            the Krowd.
          </span>
        </div>
        <div className="workbench-rule" />
      </div>
      <div className="workbench-tile">
        <Icon name="branch" size={42} />
      </div>
      <div className="workbench-disc">
        <Icon name="globe" size={44} />
      </div>
      <div className="workbench-shelf" />
      <span className="workbench-caption">
        Small experiments. Real possibilities.
      </span>
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
