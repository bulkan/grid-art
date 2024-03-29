/**
 * Reference: https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/random.md
 */
declare module "canvas-sketch-util/random" {
  type Seed = number;

  function chance(probability: number): boolean;

  /** returns -1 or 1 */
  function sign(): number;

  /** returns a value between 0 and 1 */
  function value(): number;

  /** returns a random float value inclusive or min and max */
  function range(min: number, max: number): number;
  function rangeFloor(min: number, max: number): number;
  /** 1D simplex noise */
  function noise1D(d1: number, frequency?: number, amplitude?: number): number;
  /** 2D simplex noise */
  function noise2D(
    d1: number,
    d2: number,
    frequency?: number,
    amplitude?: number
  );
  /** 3D simplex noise */
  function noise3D(
    d1: number,
    d2: number,
    d3: number,
    frequency?: number,
    amplitude?: number
  );
  /** 4D simplex noise */
  function noise4D(
    d1: number,
    d2: number,
    d3: number,
    d4: number,
    frequency?: number,
    amplitude?: number
  );
  /** pick a random item from an array */
  function pick<Item>(array: Item[]): Item;
  /** returns new array, with same items as input, but with order randomised */
  function shuffle<Arr>(array: Arr): Arr;
  /** forces random number generator to use seed */
  function setSeed(n: Seed): void;
  function getSeed(): Seed;
  function getRandomSeed(): Seed;
  function weightedSet(set: { value: string; weight: number }): string;
  function weightedSet(set: { value: number; weight: number }): number;
  function valueNonZero(): number;

  interface Random {
    // values
    chance;
    sign;
    value;
    // noise
    noise1D;
    noise2D;
    noise3D;
    noise4D;
    // arrays
    pick;
    range;
    rangeFloor;
    shuffle;
    // seed
    setSeed;
    getSeed;
    getRandomSeed;
    valueNonZero;
    // object
    weightedSet;
  }

  function createRandom(): Random;
}
