import p5 from "p5";
import palettes from 'nice-color-palettes/200.json';
import { halton as Halton } from 'low-discrepancy-sequence';

const sketch = (p: p5) => {
  let points;
  let pg;

  const count = 51;
  const MAX_POINTS = 2000;
  const MIN_POINTS = 1000;
  const MIN_WIDTH = 21;
  const MAX_WIDTH = 84;
  const CANVAS_WIDTH = 600;
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

  const rect = (width: number, color: p5.Color, pg: p5.Graphics) => {
    const POINTS = p.map(width, MIN_WIDTH, MAX_WIDTH, MIN_POINTS, MAX_POINTS);

    const alpha = p.map(POINTS, MIN_POINTS, MAX_POINTS, 175, 75);
    color.setAlpha(alpha);
    pg.fill(color);
    
    for (let i = 0; i < POINTS; i++) {
      const [x, y] = haltonSequence.getNext();

      const x1 = x * width;
      const y1 = y * width;

      pg.circle(x1, y1, 1);
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
    pg = p.createGraphics(CANVAS_WIDTH, CANVAS_WIDTH)

    backgroundColor.setAlpha(128);
    p.background(backgroundColor);
    p.rectMode(p.CENTER);
    p.noLoop();
    p.noStroke();

    pg.background(backgroundColor);
    pg.noStroke();
    pg.rectMode(p.CENTER);

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
    console.time('draw');
    const margin = p.width * 0.075 - MAX_WIDTH;

    points.forEach(data => {
      
      const { width, color, position, rotation = 0 } = data;
      
      const x = p.abs(p.lerp(margin, p.width - margin, position.u));
      const y = p.abs(p.lerp(margin, p.height - margin, position.v));

      pg.translate(x, y);
      pg.rotate(rotation);
      
      rect(width, color, pg);
      
      pg.resetMatrix();
      p.image(pg, 0, 0, CANVAS_WIDTH, CANVAS_WIDTH)
    });

    p.image(pg, 0, 0, CANVAS_WIDTH, CANVAS_WIDTH)
    console.timeEnd('draw');
  };
};

export const makeArt = (node: HTMLElement) => new p5(sketch, node);
