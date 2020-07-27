import p5 from "p5";
import palettes from 'nice-color-palettes';


const makeArt = (p: p5) => {
  const palette = palettes[Math.floor(p.random() * palettes.length - 1)];
 
  const createGrid = (count) => {
    const points = [];

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = p.map(p.noise(x, y), 0, 1, 0, 39);
        points.push({
          prevRadius: radius,
          radius,
          position: { u, v },
        });
      }
    }

    return points;
  };

  const count = 15;
  const points = createGrid(count);
  const margin = 100;

  let zoff = 0.0;

  p.setup = () => {
    p.createCanvas(800, 800);
    p.background("white");
    // p.noLoop();
  };

  p.draw = () => {
    p.noFill();
    p.strokeWeight(1);

    const { width, height } = p;
    
    points.forEach((data) => {
      const { prevRadius = 0, radius, position } = data;
      
      const x = p.lerp(margin, width - margin, position.u);
      const y = p.lerp(margin, height - margin, position.v);

      p.stroke("white");
      p.strokeWeight(2);
      p.arc(x, y, prevRadius, prevRadius, 0, Math.PI * 2);
      
      p.strokeWeight(p.map(p.noise(x, y, zoff), 0, 1, 0, 5));
      p.stroke('black');
      
      p.arc(x, y, radius, radius, 0, Math.PI * 2);

      data.prevRadius = radius
      data.radius = p.map(p.noise(x, y, zoff), 0, 1, 0, 150);
    });
    
    zoff += 0.006;

  };
};

new p5(makeArt);
