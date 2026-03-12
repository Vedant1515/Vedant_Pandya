declare module 'gsap-trial/SplitText' {
  export class SplitText {
    constructor(target: string | Element | (string | Element)[], vars?: Record<string, any>);
    chars: any[];
    words: any[];
    lines: any[];
    revert(): void;
    split(vars?: Record<string, any>): void;
  }
}
