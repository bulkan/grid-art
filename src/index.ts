import p5 from "p5";
import palettes from 'nice-color-palettes';

function fitSquares(width: number, height: number, n): number {
  let sx = 0
  let sy = 0;

  const px = Math.ceil(Math.sqrt((n * width) / height));

  if (Math.floor((px * height) / width) * px < n) {
    sx = height / Math.ceil((px * height) / width);
  } else {
    sx = width / px;
  }

  const py = Math.ceil(Math.sqrt((n * height) / width));

  if (Math.floor((py * width) / height) * py < n) {
    sy = width / Math.ceil((width * py) / height);
  } else {
    sy = height / py;
  }

  return Math.max(sx, sy);
}

const makeArt = (p: p5) => {
  let points;

  const count = 50;

  const MIN_WIDTH = 5;
  const MAX_WIDTH = 90;

  const loading = p.select('#loading');

  const palette = palettes[Math.floor(p.random() * palettes.length - 1)];
  // const color = p.color(palette[Math.floor(p.random() * palette.length)]);
  const color = p.color('black');
 
  const createGrid = (count) => {
    const points = [];

    for (let x = 0; x < count; x++) {      
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);

        const radius = p.map(p.noise(u, v), 0, 1, MIN_WIDTH, MAX_WIDTH);
        const rotation = p.map(p.noise(u, v), 0, 1, 0, p.TWO_PI);

        points.push({
          color,
          rotation,
          radius,
          position: { u, v },
        });
      }
    }

    return points;
  };

  const rect = (x, y, width, color: p5.Color) => {
    // const MAX_POINTS = p.randomGaussian() * 1000;
    const MAX_POINTS = p.map(width, MIN_WIDTH, MAX_WIDTH, count, 4000);

    color.setAlpha(p.map(MAX_POINTS, count, 4000, 190, 1));
    p.fill(color);

    for (let i = 0; i < MAX_POINTS; i++) {
      const noise = p.noise(i, MAX_POINTS * 0.1) * 4;

      const x1 = p.random(x + noise, x + width + noise);
      const y1 = p.random(y + noise, y + width + noise );

      p.circle(x1, y1, 1);
    }
  }

  p.setup = () => {
    const seed =  p.random() * 1000; 

    // interesting seeds
      // 74.0410697292676;
      // 42.545741789881994
    
    p.randomSeed(seed);
    p.noiseSeed(seed);
    
    console.table({ seed });

    const width = fitSquares(p.windowWidth - 10, p.windowHeight - 10, 1);
    
    p.createCanvas(width, width);
    p.background("white");
    p.noLoop();
    p.noStroke();
    
    points = createGrid(count).filter(() => p.randomGaussian() > 0.55);
    // points = createGrid(count);
  };
  
  p.draw = () => {
    const { width, height } = p;
    const margin = width * 0.075;
    points.forEach((data, i) => {

      const { color, radius, position, rotation = 0 } = data;
      
      const x = p.lerp(margin, width - margin, position.u);
      const y = p.lerp(margin, height - margin, position.v);

      p.push();

      p.translate(x, y);
      p.rotate(rotation);      
      rect(0, 0, radius, color);

      p.pop();
    });

    loading.html('');
  };
};

new p5(makeArt);
