import { Home } from "@/components/home";
// Classify dates at request time, not at build time.
export const dynamic = "force-dynamic";
export default function Page() {
  return <Home />;
}
