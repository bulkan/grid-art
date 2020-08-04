import p5 from "p5";
import palettes from 'nice-color-palettes/200.json';
import { halton as Halton } from 'low-discrepancy-sequence';
import { fitSquares } from "./fitSquares";

const sketch = (p: p5) => {
  let points;

  const count = 51;
  const MAX_POINTS = 10000;
  const MIN_POINTS = 1000;
  const MIN_WIDTH = 21;
  const MAX_WIDTH = 84;
  // const CANVAS_WIDTH = 750; 
  const CANVAS_WIDTH = fitSquares(p.windowWidth, p.windowHeight, 1) - 100; 
  const haltonSequence = new Halton();
  const seed = Math.floor(Math.random() * 1000000);

  // interesting seeds
    // 101435
    // 699087
    // 15965086346200000
    // 527.5082494902459
    // 74.0410697292676;
    // 42.545741789881994
  
  p.randomSeed(seed);
  p.noiseSeed(seed);

  // Interesting palettes = 62, 108
  const paletteIndex = Math.floor(p.random() * palettes.length - 1);
  const palette = p.shuffle(palettes[paletteIndex]);
  const backgroundColor = p.color(palette.pop());

  palette.pop();
  
  const createGrid = (count) => {
    console.time('createGrid');
    const points = [];
    
    for (let x = 0; x < count; x++) {      
      for (let y = 0; y < count; y++) {
        const color = p.color(palette[Math.floor(p.random() * palette.length)]);
        const u = x / (count - 1);
        const v = y / (count - 1);

                     //p.map(p.noise(u, v), 0, 1, MIN_WIDTH, MAX_WIDTH);
        const width = Math.abs(p.random(MIN_WIDTH, MAX_WIDTH)); 
        const rotation = p.map(p.noise(u, v), 0, 1, 0, p.TWO_PI);

        if((p.random()) > 0.55) {
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

  const rect = (width: number, color: p5.Color) => {
    const POINTS = p.map(width, MIN_WIDTH, MAX_WIDTH, MIN_POINTS, MAX_POINTS);

    const alpha = p.map(POINTS, MIN_POINTS, MAX_POINTS, 100, 10);
    color.setAlpha(alpha);
    p.fill(color);
    
    for (let i = 0; i < POINTS; i++) {
      const [x, y] = haltonSequence.getNext();

      const x1 = x * width;
      const y1 = y * width;

      p.circle(x1, y1, 1);
    }
  }

  p.setup = () => {
    document.onkeydown = function(e) {
      if (e.metaKey && e.keyCode === 83) {
        p.saveCanvas(`squares-${Date.now()}`, "png");
        return false;
      }
    };
    
    p.createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
    p.background(backgroundColor);
    p.rectMode(p.CENTER);
    p.noStroke();
    backgroundColor.setAlpha(128);

    points = createGrid(count);
        
    console.table({ 
      seed,
      palette,
      paletteIndex,
      pointsLegth: points.length,
      backgroundColor: backgroundColor.toString(),
      MAX_POINTS,
      MAX_WIDTH,
      MIN_WIDTH,
      CANVAS_WIDTH
    });

  };
  
  p.draw = () => {
    const margin = p.width * 0.075;

    const data = points.pop();

    if(!data) {
      p.noLoop()
      return;
    }

    const { width, color, position, rotation = 0 } = data;
    const x = p.abs(p.lerp(margin, p.width - margin, position.u));
    const y = p.abs(p.lerp(margin, p.height - margin, position.v));

    p.translate(x, y);
    p.rotate(rotation);
    
    rect(width, color);
    
    p.resetMatrix();

    if (points.length === 0) {
      console.log('done drawing');
      p.noLoop();
    }
  };
};

export const makeArt = (node: HTMLElement) => new p5(sketch, node);
