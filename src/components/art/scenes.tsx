import Image from "next/image";
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
