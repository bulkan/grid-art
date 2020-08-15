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
    const GRID_COUNT = 20;
    const MARGIN = CANVAS_WIDTH * 0.12;
    
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

          const width = CANVAS_WIDTH / GRID_COUNT - MARGIN;
          const direction = noise > 0.4 ? LEFT : RIGHT;

          POSITIONS.push({
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

    // const drawCurve = (direction: string, p1: p5.Vector, p2: p5.Vector, width: number, color: p5.Color) => {
    const drawCurve = (direction: string, x: number, y: number, width: number, color: p5.Color) => {
      let p1 = null;
      let p2 = null;

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

      const _draw = () => {  
        let points = direction === RIGHT ? [p1]: [p1];

        const step = 0.25;
        const amp = 10;
        
        for(let i=0; i < 1; i += step) {
     
          const v = p5.Vector.lerp(p1, p2, i) as unknown as p5.Vector;
          
          points.push(v);
          yoff += 0.01;
        }

        const v = points[Math.floor(points.length / 2)];
        const noise = p.noise(yoff) * amp;

        if(direction === RIGHT) {
          v.add(noise);
        }

        if(direction === LEFT) {
          v.sub(noise);
        }

        points = direction === RIGHT ? [...points, p2, p2]: [...points, p2, p2];
        p.strokeWeight(0.5);
        color.setAlpha(5);
        p.stroke(color);

        p.beginShape();
        points.forEach(v => p.curveVertex(v.x, v.y));
        p.endShape();
      }

      for(let i=0; i <= 250; i++) {
        _draw();
      }
    }

    p.setup = () => {
      document.onkeydown = function(e) {
        if (e.metaKey && e.keyCode === 83) {
          p.saveCanvas(`squiggles-${SEED}-${paletteIndex}`, "png");
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
        CANVAS_WIDTH
      });
    };
    
    p.draw = () => {
      const data = POSITIONS.pop();
      p.noFill();

      if(!data) {
        p.noLoop()
        return;
      }

      const { width, direction, color, position } = data;
      const x = p.lerp(MARGIN, CANVAS_WIDTH - MARGIN, position.u);
      const y = p.lerp(MARGIN, CANVAS_WIDTH - MARGIN, position.v);

      p.translate(x, y);

      // color.setAlpha(20);
      // p.stroke(color);
      // p.strokeWeight(1);
      // p.rect(0, 0, width, width);

      drawCurve(direction, 0, 0, width, color);
    
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
