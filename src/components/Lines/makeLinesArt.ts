import p5 from "p5";
import palettes from 'nice-color-palettes/200.json';
import random from 'canvas-sketch-util/random';
import { IMakeArt } from "../../types";
import { fitSquares } from "../../utils";

const makeSketch = (seed: any, paletteId: number) => {
  const LEFT = 'LEFT';
  const RIGHT = 'RIGHT';
  const SEED = parseInt(seed) || Math.floor(Math.random() * 1000000);
  random.setSeed(SEED);

  // Interesting palettes = 41, 62, 108
  let paletteIndex = paletteId || Math.floor(random.valueNonZero() * palettes.length);
  
  if (paletteIndex >= palettes.length) {
    paletteIndex = Math.floor(random.valueNonZero() * palettes.length);
  }
  
  const palette = palettes[paletteIndex];

  const backgroundColorString = palette.pop();
  
  palette.pop();
  palette.pop();


  const sketch = (p: p5) => {
    const CANVAS_WIDTH = fitSquares(p.windowWidth, p.windowHeight, 1) - p.windowWidth / 15;
    const GRID_COUNT = 20;
    const MARGIN = CANVAS_WIDTH * 0.0775;
    
    p.randomSeed(SEED);
    p.noiseSeed(SEED);

    let points;
    const backgroundColor = p.color(backgroundColorString);

    const createGrid = () => {
      console.time('createGrid');
      const points = [];
      
      for (let x = 0; x < GRID_COUNT; x++) {      
        for (let y = 0; y < GRID_COUNT; y++) {
          const color = p.color(palette[Math.floor(p.random(palette.length))]);
          const u = x / (GRID_COUNT - 1);
          const v = y / (GRID_COUNT - 1);

          const noise = p.noise(x, y);

          const width = 44;
          const direction = noise > 0.4 ? LEFT : RIGHT;
          const strokeWeight = p.random(1, 20);
          const opacity = p.map(strokeWeight, 1, 20, 200, 150);
          color.setAlpha(opacity);

          points.push({
            strokeWeight,
            direction,
            color,
            width,
            position: { u, v },
          });

        }
      }

      console.timeEnd('createGrid');
      return points;
    };

    const rightDiag = (x: number, y: number, width: number, color: p5.Color) => {
      const x1 = 0;
      const y1 = y + width;

      const x2 = x + width;
      const y2 = 0;

      p.line(x1, y1, x2, y2);
    }

    const leftDiag = (x: number, y: number, width: number, color: p5.Color) => {
      const x1 = 0;
      const y1 = 0;

      const x2 = x + width;
      const y2 = x + width;

      p.line(x1, y1, x2, y2);
    }

    p.setup = () => {
      document.onkeydown = function(e) {
        if (e.metaKey && e.keyCode === 83) {
          p.saveCanvas(`lines-${SEED}-${paletteIndex}`, "png");
          return false;
        }
      };
      
      p.createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
      p.background(backgroundColor);
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
        // MAX_WIDTH,
        // MIN_WIDTH,
        CANVAS_WIDTH
      });

    };
    
    p.draw = () => {
      const data = points.pop();
      p.noFill();

      if(!data) {
        p.noLoop()
        return;
      }

      const { strokeWeight, width, direction, color, position } = data;
      const x = p.abs(p.lerp(MARGIN, p.width - MARGIN, position.u));
      const y = p.abs(p.lerp(MARGIN, p.height - MARGIN, position.v));

      p.translate(x, y);
 
      p.strokeCap(p.SQUARE);
      p.stroke(color);

      
      p.strokeWeight(strokeWeight);
      if (direction === RIGHT) {
        rightDiag(0, 0, width, color);
      } 

      if (direction === LEFT) {
        leftDiag(0, 0, width, color);
      }
      
      color.setAlpha(50);
      p.stroke(color);
      p.strokeWeight(1);
      p.rect(0, 0, width, width);
      p.resetMatrix();

      if (points.length === 0) {
        console.log('done drawing');
        p.noLoop();
      }
    };
  };

  return { sketch, paletteIndex, SEED, backgroundColorString };
};

export const makeArt = ( {seed, paletteId, node}: IMakeArt) => {
  const { sketch, paletteIndex, SEED, backgroundColorString: backgroundColor } = makeSketch(seed, paletteId);

  new p5(sketch, node);

  return { paletteId: paletteIndex, seed: SEED, backgroundColor};
};
