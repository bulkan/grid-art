import p5 from "p5";
import palettes from "nice-color-palettes/200.json";
import random from "canvas-sketch-util/random";
import { IMakeArt } from "../../types";
import { fitSquares } from "../../utils";

const LEFT = "LEFT";
const RIGHT = "RIGHT";
type Direction = typeof LEFT | typeof RIGHT;

type Position = {
  direction: Direction;
  color: p5.Color;
  rotation: number;
  width: number;
  position: { u: number; v: number };
};

const makeSketch = (seed: any, paletteId?: number) => {
  let yoff = 0.0;

  const SEED = parseInt(seed) || Math.floor(Math.random() * 1000000);
  random.setSeed(SEED);

  // Interesting palettes = 41, 62, 108
  let paletteIndex =
    paletteId || Math.floor(random.valueNonZero() * palettes.length);

  if (paletteIndex >= palettes.length) {
    paletteIndex = Math.floor(random.valueNonZero() * palettes.length);
  }

  const palette = palettes[paletteIndex];
  const backgroundColorString = palette.pop() || "white";

  const sketch = (p: p5) => {
    const CANVAS_WIDTH =
      fitSquares(p.windowWidth, p.windowHeight, 1) - p.windowWidth / 15;
    const GRID_COUNT = 125;
    const MARGIN = CANVAS_WIDTH * 0.05;

    p.randomSeed(SEED);
    p.noiseSeed(SEED);

    const CELL_COLOR = p.color(palette.pop() || "white");

    const h = p.hue(CELL_COLOR);
    const s = p.saturation(CELL_COLOR);
    const l = p.lightness(CELL_COLOR);

    console.log(h, s, l);

    let POSITIONS: Position[] = [];
    const backgroundColor = p.color(backgroundColorString);

    const createGrid = () => {
      console.time("createGrid");

      for (let x = 0; x < GRID_COUNT; x++) {
        for (let y = 0; y < GRID_COUNT; y++) {
          const u = x / (GRID_COUNT - 1);
          const v = y / (GRID_COUNT - 1);
          const noise = p.noise(u, v);

          const color = p.color(
            h,
            p.map(noise, 0, 1, 0, 100),
            p.map(noise, 0, 1, 0, 100)
          );

          const width = p.map(
            noise,
            0,
            1,
            CANVAS_WIDTH * 0.0001,
            CANVAS_WIDTH * 0.1
          );

          const direction = noise > 0.4 ? LEFT : RIGHT;
          const rotation = p.map(noise, 0, 1, 0, p.PI);

          POSITIONS.push({
            direction,
            rotation,
            color,
            width,
            position: { u, v },
          });
        }
      }

      console.timeEnd("createGrid");
      return POSITIONS;
    };

    // const drawCurve = (direction: string, p1: p5.Vector, p2: p5.Vector, width: number, color: p5.Color) => {
    const drawCurve = (
      direction: string,
      x: number,
      y: number,
      width: number,
      color: p5.Color
    ) => {
      let p1: p5.Vector = p.createVector();
      let p2: p5.Vector = p.createVector();

      if (direction === RIGHT) {
        // bottom left
        p1 = p.createVector(x, y + width);

        // top right
        p2 = p.createVector(x + width, 0);
      }

      if (direction === LEFT) {
        // top left;
        p2 = p.createVector(0, 0);

        // top right
        p1 = p.createVector(x + width, y + width);
      }

      p.strokeWeight(0.6);
      p.stroke(color);

      const _draw = () => {
        let points = direction === RIGHT ? [p1] : [p1];

        const step = 0.01;
        const amp = 20;

        for (let i = 0; i < 1; i += step) {
          const noise = p.noise(yoff) * amp;

          const v = p5.Vector.lerp(p1, p2, i) as unknown as p5.Vector;
          if (direction === RIGHT) {
            v.add(noise);
          }

          if (direction === LEFT) {
            v.sub(noise);
          }

          points.push(v);
          yoff += 0.03;
        }

        points = direction === RIGHT ? [...points, p2] : [...points, p2];

        p.beginShape();
        points.forEach((v) => p.curveVertex(v.x, v.y));
        p.endShape();
      };

      for (let i = 0; i <= 2; i++) {
        _draw();
      }
    };

    p.setup = () => {
      document.onkeydown = function (e) {
        if (e.metaKey && e.keyCode === 83) {
          p.saveCanvas(`squiggles-${SEED}-${paletteIndex}`, "png");
          return false;
        }
      };

      p.colorMode(p.HSL);
      p.createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
      p.background(backgroundColor);
      p.rectMode(p.CENTER);

      POSITIONS = createGrid().filter(() => p.random() > 0.75);

      console.table({
        palette,
        paletteIndex,
        POSITIONS_LENGTH: POSITIONS.length,
        backgroundColor: backgroundColor.toString(),
        MARGIN,
        GRID_COUNT,
        SEED,
        CANVAS_WIDTH,
      });
    };

    p.draw = () => {
      const data = POSITIONS.pop();
      p.noFill();

      if (!data) {
        p.noLoop();
        return;
      }

      const { rotation, width, direction, color, position } = data;
      const x = p.lerp(MARGIN, CANVAS_WIDTH - MARGIN, position.u);
      const y = p.lerp(MARGIN, CANVAS_WIDTH - MARGIN, position.v);

      p.translate(x, y);
      p.rotate(rotation);

      drawCurve(direction, 0, 0, width, color);

      p.resetMatrix();

      if (POSITIONS.length === 0) {
        console.log("done drawing");
        p.noLoop();
      }
    };
  };

  return { sketch, paletteIndex, SEED, backgroundColorString };
};

export const makeArt = ({ seed, paletteId, node }: IMakeArt) => {
  const {
    sketch,
    paletteIndex,
    SEED,
    backgroundColorString: backgroundColor,
  } = makeSketch(seed, paletteId);

  new p5(sketch, node);

  return { paletteId: paletteIndex, seed: SEED, backgroundColor };
};
