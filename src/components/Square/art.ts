import p5 from "p5";
import palettes from 'nice-color-palettes/200.json';
import random from 'canvas-sketch-util/random';
import { halton as Halton } from 'low-discrepancy-sequence';

const sketch = (p: p5) => {
  let points;
  const count = 21;
  const MAX_POINTS = 5000;
  const MIN_POINTS = MAX_POINTS / 10;
  const MIN_WIDTH = 21;
  const MAX_WIDTH = 105;

  const haltonSequence = new Halton();

  const paletteIndex = 39;//Math.floor(p.random() * palettes.length - 1;
  const palette = p.shuffle(palettes[paletteIndex]);
  const backgroundColor = p.color(palette.pop());
  
  const createGrid = (count) => {
    const points = [];
    
    for (let x = 0; x < count; x++) {      
      for (let y = 0; y < count; y++) {
        const color = p.color(palette[Math.floor(p.random() * palette.length)]);
        const u = x / (count - 1);
        const v = y / (count - 1);

                     //p.map(p.noise(u, v), 0, 1, MIN_WIDTH, MAX_WIDTH);
        const width = Math.abs(p.random(MIN_WIDTH, MAX_WIDTH)); 
        const rotation = p.map(p.noise(u, v), 0, 1, 0, p.TWO_PI);

        if((p.random()) > 0.2) {
          points.push({
            color,
            rotation,
            width,
            position: { u, v },
          });
        }
      }
    }

    return points;
  };

  const rect = (width: number, color: p5.Color) => {
    const POINTS = p.map(width, MIN_WIDTH, MAX_WIDTH, MIN_POINTS, MAX_POINTS);

    color.setAlpha(p.map(POINTS, MIN_POINTS, MAX_POINTS, 150, 100));
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

    const seed =  random.getRandomSeed();
    
    // interesting seeds
    // 527.5082494902459
    // 74.0410697292676;
    // 42.545741789881994
    
    random.setSeed(seed);
    p.randomSeed(seed);
    p.noiseSeed(seed);

    const width = 750;

    p.noLoop();
    p.noStroke();
    p.createCanvas(width, width);
    backgroundColor.setAlpha(100);
    p.background(backgroundColor);
    
    // points = createGrid(count).filter(() => ;
    points = createGrid(count);
        
    console.table({ 
      seed,
      palette,
      paletteIndex,
      width,
      pointsLegth: points.length,
      backgroundColor: backgroundColor.toString(),
      MAX_POINTS,
      MAX_WIDTH,
      MIN_WIDTH
    });

  };
  
  p.draw = () => {
    console.time('draw');
    const margin = p.width * 0.075 - MAX_WIDTH;
    p.rectMode(p.CENTER);
    points.forEach(data => {
      
      const { width, color, position, rotation = 0 } = data;
      
      const x = p.lerp(margin, p.width - margin, position.u);
      const y = p.lerp(margin, p.height - margin, position.v);
      
      p.push();
      
      p.translate(x, y);
      p.rotate(rotation);      
      rect(width, color);
      // p.stroke(color);
      // p.rect(0, 0, 50, 50);
      
      p.pop();
    });
    console.timeEnd('draw');
  };
};

export const makeArt = (node: HTMLElement) => new p5(sketch, node);
