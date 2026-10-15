import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { Computer } from './computer';
import { Printer } from './printer';
import { Arcade } from './arcade';
import { dateLabel } from '@/lib/events';
import type { EventRecord } from '@/lib/types';
const computer = fs.readFileSync(path.join(process.cwd(), 'public/figures/computer.svg'), 'utf8');
const printer = fs.readFileSync(path.join(process.cwd(), 'public/figures/printer.svg'), 'utf8');
// This trusted, checked-in artwork is passed as server-rendered children, not a client bundle import.
// Remove its standalone stylesheet so embedding it cannot change other figures on the page.
const arcade = fs
  .readFileSync(path.join(process.cwd(), 'public/figures/arcade.svg'), 'utf8')
  .replace(/<style>[\s\S]*?<\/style>/g, '')
  .replace('data-mode="attract" style="display:none"', 'data-mode="attract"')
  .replace(
    /aria-label="[^"]*"/,
    'aria-label="An open KrowdKraft arcade cabinet with a looping pixel game, moving joystick, and glowing circuits."',
  );
export function ArcadeFigure() {
  return (
    <Arcade>
      <div dangerouslySetInnerHTML={{ __html: arcade }} />
    </Arcade>
  );
}
export function ComputerFigure() {
  return (
    <Computer>
      <div dangerouslySetInnerHTML={{ __html: computer }} />
    </Computer>
  );
}
export function PrinterFigure({ event, decorative = false }: { event?: EventRecord; decorative?: boolean }) {
  const escape = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const artwork = event
    ? printer
        .replace('NEXT GATHERING', escape(dateLabel(event.date, { month: 'short' }).toUpperCase()))
        .replace('a place to make things', escape(event.title.slice(0, 38)))
    : printer;
  return (
    <Printer event={decorative ? undefined : event}>
      <div className="iso printer-art" dangerouslySetInnerHTML={{ __html: artwork }} />
    </Printer>
  );
}
