import p5 from "p5";
// import palettes from 'nice-color-palettes';

const makeArt = (p: p5) => {
  let points;

  const count = 50;
  const MIN_WIDTH = 5;
  const MAX_WIDTH = 70;

  const loading = p.select('#loading');

  // const palette = palettes[Math.floor(p.random() * palettes.length - 1)];
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

  const rect = (x, y, width, color) => {
    const MAX_POINTS = p.randomGaussian() * width * 40;

    color.setAlpha(p.map(MAX_POINTS, 0, width * 40, 120, 1));
    p.fill(color);

    for (let i = 0; i < MAX_POINTS; i++) {
      const noise = p.noise(i);
      // const d = p.map(noise, 0, 1, 0, 3);
      const d = 2;

      const x1 = p.random(x, x + width);
      const y1 = p.random(y, y + width);

      p.circle(x1 + noise * 2, y1 + noise * 2, d);
    }
  }

  p.setup = () => {
    const seed = p.random() * 100; 
    
    p.randomSeed(seed);
    
    console.table({ seed });
    
    p.createCanvas(p.windowWidth / 2, p.windowWidth / 2);
    p.background("white");
    p.noLoop();
    p.noStroke();
    
    points = createGrid(count).filter(() => p.randomGaussian() > 0.35);
    // points = createGrid(count);
  };
  
  p.draw = () => {
    const { width, height } = p;
    const margin = width * 0.075;
    
    points.forEach((data) => {
      const { color, radius, position, rotation = 0 } = data;
      
      const x = p.lerp(margin, width - margin, position.u);
      const y = p.lerp(margin, height - margin, position.v);

      p.push();

      p.translate(x, y);
      p.rotate(rotation);      
      rect(0, 0, radius, color);
      // p.fill(color);
      // p.rect(0, 0, radius, radius);

      p.pop();
    });

    loading.html('');
  };
};

new p5(makeArt);
