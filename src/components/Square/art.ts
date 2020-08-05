import p5 from "p5";
import palettes from 'nice-color-palettes/200.json';
import random from 'canvas-sketch-util/random';
import { halton as Halton } from 'low-discrepancy-sequence';
import { fitSquares } from "./fitSquares";

const makeSketch = (seed: any, paletteId: number) => {
  // interesting seeds
      // 955971
      // 823050
      // 101435
      // 699087
      // 15965086346200000
      // 527.5082494902459
      // 74.0410697292676;
      // 42.545741789881994
  const SEED = seed || Math.floor(Math.random() * 1000000);

  random.setSeed(SEED);

  // Interesting palettes = 41, 62, 108
  let paletteIndex = paletteId || Math.floor(random.valueNonZero() * palettes.length);
  
  if (paletteIndex >= palettes.length) {
    paletteIndex = Math.floor(random.valueNonZero() * palettes.length);
  }
  
  const palette = random.shuffle(palettes[paletteIndex]);
  const backgroundColorString = palette.pop();

  palette.pop();
  palette.pop();

  const sketch = (p: p5) => {
    const CANVAS_WIDTH = fitSquares(p.windowWidth, p.windowHeight, 1) - p.windowWidth / 15;
    const GRID_COUNT = CANVAS_WIDTH * 0.09;
    const MAX_POINTS = 4000;
    const MIN_POINTS = 2000;
    const MIN_WIDTH = CANVAS_WIDTH * 0.01;
    // const MAX_WIDTH = CANVAS_WIDTH * 0.15;
    const MAX_WIDTH = MIN_WIDTH * 10;
    const MARGIN = MAX_WIDTH;
    
    p.randomSeed(SEED);
    p.noiseSeed(SEED);

    let points;
    const haltonSequence = new Halton();

    const backgroundColor = p.color(backgroundColorString);

    const createGrid = () => {
      console.time('createGrid');
      const points = [];
      
      for (let x = 0; x < GRID_COUNT; x++) {      
        for (let y = 0; y < GRID_COUNT; y++) {
          const color = p.color(palette[Math.floor(p.random() * palette.length)]);
          const u = x / (GRID_COUNT - 1);
          const v = y / (GRID_COUNT - 1);

                      //p.map(p.noise(u, v), 0, 1, MIN_WIDTH, MAX_WIDTH);
          const width = Math.abs(p.random(MIN_WIDTH, MAX_WIDTH)); 
          const rotation = p.map(p.noise(u, v), 0, 1, 0, p.TWO_PI);

          if((p.random()) > 0.95) {
            points.push({
              color,
              rotation,
              width,
              position: { u, v },
            });
          }
        }
      }

      console.timeEnd('createGrid');
      return points;
    };

    const stiple = (width: number, color: p5.Color) => {
      const POINTS = p.map(width, MIN_WIDTH, MAX_WIDTH, MIN_POINTS, MAX_POINTS);

      // const alpha = p.map(POINTS, MIN_POINTS, MAX_POINTS, 100, 10);

      for (let i = 0; i < POINTS; i++) {
        const [x, y] = haltonSequence.getNext();
        
        const alpha = p.noise(x, y, i) * 255;
        color.setAlpha(alpha);
        p.fill(color);

        const x1 = x * width;
        const y1 = y * width;

        p.circle(x1, y1, 1);
      }
    }

    p.setup = () => {
      document.onkeydown = function(e) {
        if (e.metaKey && e.keyCode === 83) {
          p.saveCanvas(`squares-${SEED}-${paletteIndex}`, "png");
          return false;
        }
      };
      
      p.createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
      p.background(backgroundColor);
      p.rectMode(p.CENTER);
      p.noStroke();
      // backgroundColor.setAlpha(128);

      points = createGrid();
          
      console.table({ 
        palette,
        paletteIndex,
        pointsLegth: points.length,
        backgroundColor: backgroundColor.toString(),
        MARGIN,
        GRID_COUNT,
        SEED,
        MAX_POINTS,
        MAX_WIDTH,
        MIN_WIDTH,
        CANVAS_WIDTH
      });

    };
    
    p.draw = () => {
      const data = points.pop();

      if(!data) {
        p.noLoop()
        return;
      }

      const { width, color, position, rotation = 0 } = data;
      const x = p.abs(p.lerp(MARGIN, p.width - MARGIN, position.u));
      const y = p.abs(p.lerp(MARGIN, p.height - MARGIN, position.v));

      p.translate(x, y);
      p.rotate(rotation);
      
      stiple(width, color);
      
      p.resetMatrix();

      if (points.length === 0) {
        console.log('done drawing');
        p.noLoop();
      }
    };
  };

  return { sketch, paletteIndex, SEED, backgroundColorString };
};

interface IMakeArt {
  seed?: any;
  paletteId?: number;
  node: HTMLElement;
}

export const makeArt = ( {seed, paletteId, node}: IMakeArt) => {
  const { sketch, paletteIndex, SEED, backgroundColorString: backgroundColor } = makeSketch(seed, paletteId);

  new p5(sketch, node);

  return { paletteId: paletteIndex, seed: SEED, backgroundColor};
};
