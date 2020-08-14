import p5 from "p5";
import palettes from 'nice-color-palettes/200.json';
import random from 'canvas-sketch-util/random';
import { IMakeArt } from "../../types";
import { fitSquares } from "../../utils";

const makeSketch = (seed: any, paletteId: number) => {
  let yoff = 0.0;

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
    const GRID_COUNT = 25;
    const MARGIN = CANVAS_WIDTH * 0.0775;
    
    p.randomSeed(SEED);
    p.noiseSeed(SEED);

    let POSITIONS;
    const backgroundColor = p.color(backgroundColorString);

    const createGrid = () => {
      console.time('createGrid');
      const POSITIONS = [];
      
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

          POSITIONS.push({
            strokeWeight,
            direction,
            color,
            width,
            position: { u, v },
          });

        }
      }

      console.timeEnd('createGrid');
      return POSITIONS;
    };

    const drawCurve = (p1: p5.Vector, p2: p5.Vector, color: p5.Color) => {
      const points = [];

      yoff += 0.01;
      const step = 0.05;

      for(let i=0; i <= 1; i += step) {
        const noise = p.noise(i, yoff) * 30;
        const v = p5.Vector.lerp(p1, p2, i) as unknown as p5.Vector;
        v.add(noise, p.random() * 2)
        points.push(v);
      }

      p.strokeWeight(0.09);
      color.setAlpha(15);
      p.stroke(color);

      p.beginShape();
      points.forEach(v => {
        p.curveVertex(v.x, v.y);
      });
      p.endShape();
    }

    const rightDiag = (x: number, y: number, width: number, color: p5.Color) => {
      // bottom left
      const p1 = p.createVector(x, y + width);

      // top right
      const p2 = p.createVector(x + width, 0);

      for(let i=0; i <= 200; i++) {
        drawCurve(p1, p2, color);
      }
    }

    const leftDiag = (x: number, y: number, width: number, color: p5.Color) => {
      const p1 = p.createVector(0, 0);

      // top right
      const p2 = p.createVector(x + width, y + width);
      
      for(let i=0; i <= 200; i++) {
        drawCurve(p1, p2, color);
      }
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

      POSITIONS = createGrid();
          
      console.table({ 
        palette,
        paletteIndex,
        POSITIONS_LENGTH: POSITIONS.length,
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
      // yoff += 0.1;

      const data = POSITIONS.pop();
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
    
      p.resetMatrix();

      if (POSITIONS.length === 0) {
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
