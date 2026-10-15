export const HL: {
  inject(root: Document): void;
  mk(tag: string, attrs: Record<string, string>, parent: HTMLElement): SVGSVGElement;
  tour(stage: HTMLElement, stops: (number[] | null)[]): { stop(): void };
};
export const definition: {
  name: string;
  means: string;
  tour: (number[] | null)[];
  mount(
    host: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string } },
    value: number,
  ): { set(value: number): void; destroy(): void };
};
