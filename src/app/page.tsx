import Image from "next/image";
import { heroDescription } from "@/data/community";
export default function Home() {
  return <main className="container foundation-preview"><Image src="/brand/logo.webp" width={88} height={88} alt="KrowdKraft" priority /><p className="eyebrow">Bengaluru, India</p><h1>Where Bengaluru&apos;s<br />developers connect.</h1><p className="body-copy">{heroDescription}</p><a className="button primary" href="mailto:krowdkraft.official@gmail.com">Build with the Krowd</a></main>;
}
