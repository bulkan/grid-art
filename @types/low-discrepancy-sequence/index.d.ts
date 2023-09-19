declare module "low-discrepancy-sequence" {
  declare class halton {
    constructor(bases: Array<number> = [2, 3], seed: number = 0);
    getNext(): [number, number];
  }
}
