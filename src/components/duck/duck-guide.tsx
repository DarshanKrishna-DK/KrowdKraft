"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { DuckAvatar, type DuckMood } from "./duck-avatar";
import { DuckSound } from "./sound";
const stops: { id: string; label: string; mood: DuckMood; copy: string }[] = [
  { id: "top", label: "Welcome", mood: "wave", copy: "Need a wing finding your people? Let's take a look around." },
  { id: "about", label: "Meet the Krowd", mood: "happy", copy: "Learning, building, and showing up for each other. This is what brings the Krowd together." },
  { id: "impact", label: "Our impact", mood: "celebrate", copy: "Every room starts with people. Here's a little of what this community has built together." },
  { id: "events", label: "Explore events", mood: "thinking", copy: "This is the Krowd Map. Switch tracks to explore our events, community collaborations, and what's next." },
  { id: "bengaluru", label: "Around Bengaluru", mood: "curious", copy: "Our city keeps building. Find the topics and rooms you'd like to be part of." },
  { id: "collaborate", label: "Build together", mood: "wave", copy: "Got an idea for the community? Tap Build with the Krowd and tell the team what you have in mind." },
  { id: "ecosystem", label: "Ecosystem", mood: "curious", copy: "This space is still taking shape. New ecosystem connections will appear here as they're added." },
  { id: "people", label: "Meet the people", mood: "happy", copy: "Meet Darshan, Deepak, and Vihar: the people behind the Krowd." },
  { id: "join", label: "Find your place", mood: "wave", copy: "There's room for you. Leave an interest note for the team, or reach out by email." },
];
type MailState = "sending" | "delivered" | "unconfigured" | "error";
const mailMessages: Record<MailState, { mood: DuckMood; copy: string }> = {
  sending: { mood: "thinking", copy: "Your note is on its way to the mail service. Let's wait for the result." },
  delivered: { mood: "celebrate", copy: "Quack! The mail service accepted your note. Thanks for reaching out." },
  unconfigured: { mood: "concerned", copy: "Mail isn't connected here yet. Your note hasn't been sent; the form has a direct email link." },
  error: { mood: "concerned", copy: "That note didn't go through. Your details are still in the form so you can try again." },
};
export function DuckGuide() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false), [hidden, setHidden] = useState(false), [active, setActive] = useState(0);
  const [mail, setMail] = useState<MailState | null>(null), [sound, setSound] = useState<"off" | "on" | "unavailable">("off");
  const [reaction, setReaction] = useState(0);
  const launcher = useRef<HTMLButtonElement>(null), heading = useRef<HTMLHeadingElement>(null);
  const audio = useRef<DuckSound | null>(null);
  const soundIntent = useRef(0);
  const detail = pathname !== "/";
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const index = stops.findIndex(stop => stop.id === entry.target.id);
        if (index >= 0) { setActive(index); setMail(null); }
      }
    }, { rootMargin: "-18% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    function received(event: Event) {
      const state: unknown = (event as CustomEvent).detail;
      if (typeof state === "string" && Object.hasOwn(mailMessages, state)) {
        setMail(state as MailState); setReaction(value => value + 1);
        if (state === "delivered") audio.current?.quack(true);
      }
    }
    window.addEventListener("krowd:mail", received);
    return () => { window.removeEventListener("krowd:mail", received); soundIntent.current++; audio.current?.disable(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    heading.current?.focus();
    function escape(event: KeyboardEvent) { if (event.key === "Escape") { setOpen(false); launcher.current?.focus(); } }
    window.addEventListener("keydown", escape); return () => window.removeEventListener("keydown", escape);
  }, [open]);
  function react() { setReaction(value => value + 1); setMail(null); audio.current?.quack(); }
  function close() { setOpen(false); launcher.current?.focus(); }
  async function toggleSound() {
    const ticket = ++soundIntent.current;
    if (sound === "on") { audio.current?.disable(); setSound("off"); return; }
    audio.current ??= new DuckSound();
    setSound("on");
    const enabled = await audio.current.enable();
    if (ticket === soundIntent.current) setSound(enabled ? "on" : "unavailable");
  }
  const stop = stops[active], next = stops[(active + 1) % stops.length];
  const expression = detail ? { mood: "thinking" as const, copy: "Here's the event's date, place, and source. Follow its registration link when you're ready, or come back to the Krowd Map." } : mail ? mailMessages[mail] : stop;
  return <aside className={`duck-guide ${hidden ? "duck-hidden" : ""}`} aria-label="Krafty, your community guide">
    {open && <div className="guide-panel clay" id="krafty-panel" role="region" aria-labelledby="krafty-title">
      <div className="guide-header"><div><span className="eyebrow">A little help, on the wing</span><h2 id="krafty-title" ref={heading} tabIndex={-1}>Hey, I&apos;m Krafty.</h2></div>
        <button className="icon-button" type="button" onClick={close} aria-label="Close duck guide">×</button></div>
      <p className="guide-message" aria-live="polite">{expression.copy}</p>
      <a className="button primary guide-next" href={detail ? "/#events" : `#${next.id}`} onClick={react}>{detail ? "Back to the Krowd Map" : `Show me: ${next.label}`}<span aria-hidden="true">↗</span></a>
      <nav className="guide-shortcuts" aria-label="Duck guide shortcuts">
        {[stops[3], stops[5], stops[8]].map(item => <a href={`${detail ? "/" : ""}#${item.id}`} key={item.id} onClick={react}>{item.label}</a>)}
      </nav>
      <div className="guide-controls"><button type="button" onClick={() => void toggleSound()} aria-pressed={sound === "on"} aria-label={sound === "on" ? "Turn duck sounds off" : "Turn duck sounds on"}><span aria-hidden="true">{sound === "on" ? "♫" : "♪"}</span> Sound {sound === "on" ? "on" : "off"}</button>
        <button type="button" onClick={() => { setHidden(true); close(); soundIntent.current++; audio.current?.disable(); setSound("off"); }}>Hide duck</button></div>
      {sound === "unavailable" && <p className="guide-note" role="status">Sound is unavailable in this browser. I can still show you around.</p>}
    </div>}
    <button ref={launcher} type="button" className="duck-launcher" aria-expanded={open} aria-controls={open ? "krafty-panel" : undefined} aria-label={hidden ? "Show Krafty, the duck guide" : open ? "Close Krafty, the duck guide" : "Open Krafty, the duck guide"} onClick={() => { setHidden(false); setOpen(value => !value); setReaction(value => value + 1); audio.current?.quack(); }}>
      {hidden ? <span className="guide-return">Guide</span> : <><span className="duck-greeting">{open ? "Here to help." : "Need a wing?"}</span><span className="duck-character" key={reaction}><DuckAvatar mood={expression.mood} /></span></>}
    </button>
  </aside>;
}
