import Image from "next/image";
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
export function JournalCover({ src }: { src: string }) {
  return (
    <div className="journal-cover journal-medium-cover">
      <Image
        src={src}
        alt=""
        width={1024}
        height={1024}
        sizes="(max-width: 767px) 92vw, (max-width: 1200px) 46vw, 660px"
      />
    </div>
  );
}
