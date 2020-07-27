import p5, { Vector } from "p5";

const makeArt = (p: p5) => {
  const createGrid = (count) => {
    const points = [];

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = p.map(p.noise(x, y), 0, 1, 0, 39);
        points.push({
          radius,
          position: { u, v },
        });
      }
    }

    return points;
  };

  const count = 25;
  const points = createGrid(count);
  const margin = 20;

  p.setup = () => {
    p.createCanvas(800, 800);
    p.background("white");
    p.noLoop();
  };

  p.draw = () => {
    p.noFill();
    p.stroke("black");
    p.strokeWeight(1);

    const { width, height } = p;

    points.forEach((data) => {
      const { radius, position } = data;

      const x = p.lerp(margin, width - margin, position.u);
      const y = p.lerp(margin, height - margin, position.v);

      // p.circle(x, y, radius);
      p.arc(x, y, radius, radius, 0, Math.PI * 2);
    });
  };
};

new p5(makeArt);
