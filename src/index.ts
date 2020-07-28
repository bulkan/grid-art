import p5 from "p5";
import palettes from 'nice-color-palettes';


const makeArt = (p: p5) => {
  const palette = palettes[Math.floor(p.random() * palettes.length - 1)];
 
  const createGrid = (count) => {
    const points = [];

    for (let x = 0; x < count; x++) {
      const color = p.color(palette[Math.floor(p.random() * palette.length)]);
      color.setAlpha(p.map(p.noise(x), 0, 1, 0, 255));

      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = p.map(p.noise(u, v), 0, 1, 0, p.width * 0.09);
        const rotation = p.map(p.noise(u, v), 0, 1, 0, p.PI);

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

  let points; 

  const count = 30;
  const margin = 100;

  let zoff = 0.0;

  p.setup = () => {
    p.createCanvas(800, 800);
    p.background("white");
    p.noLoop();
    p.noStroke();

    points = createGrid(count).filter(() => p.randomGaussian() > 0.5);
  };

  p.draw = () => {
    // p.fill('black')
    // p.textFont('Helvetica');

    const { width, height } = p;
    
    points.forEach((data) => {
      const { color, radius, position, rotation = 0 } = data;
      
      const x = p.lerp(margin, width - margin, position.u);
      const y = p.lerp(margin, height - margin, position.v);

      // p.strokeWeight(1);
      // p.stroke('black');
      
      // p.arc(x, y, radius, radius, 0, Math.PI * 2);

      // data.prevRadius = radius
      // data.radius = p.map(p.noise(x, y, zoff), 0, 1, 1, 20);

      p.push();
      p.fill(color);
      p.translate(x, y);
      p.rotate(rotation);
      
      p.rect(0, 0, radius, radius);

      // p.text("|", 0, 0);

      p.pop();
    });
    
    // zoff += 0.006;

  };
};

new p5(makeArt);
