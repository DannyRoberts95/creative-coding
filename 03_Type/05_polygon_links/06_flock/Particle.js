class Particle {
  constructor(x, y, r, col) {
    this.loc = createVector(x + random(width), y + random(height));
    this.origin = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 10;
    this.maxForce = 2.5;

    //display lets
    this.alphaValue = 100;
    this.col = col;
    this.radius = r;
  }

  run(particlesArray) {
    // this.seek(this.origin);
    // this.flee(createVector(mouseX, mouseY));
    this.behaviour(particlesArray);
    this.update();
    this.edgeCheck();
    this.display(particlesArray);
  }

  behaviour(particlesArray) {
    //get the array of particlesArray forces from steer
    let particlesArrayForces = this.steer(particlesArray);
    console.log(particlesArrayForces);
    //for every steering force...
    for (let force of particlesArrayForces) {
      //apply that force
      // force.mult(10);
      this.applyForce(force);
    }
  }

  steer(particlesArray) {
    let alignment = createVector();
    let cohesion = createVector();
    let seperation = createVector();
    let total = 0;
    //for every member of the particlesArray...
    for (let other of particlesArray) {
      let vecToOther = p5.Vector.sub(this.loc, other.loc);
      //get the distance between myself and the other Particle
      let d = vecToOther.mag();
      alignment.add(other.vel);
      cohesion.add(other.loc);
      let diff = p5.Vector.sub(this.loc, other.loc);
      diff.div(d * d);
      seperation.add(diff);
      total++;
    }

    if (total > 0) {
      //ALIGNMENT
      alignment.div(total);
      alignment.setMag(this.maxSpeed);
      alignment.sub(this.vel);
      alignment.limit(this.maxForce);
      alignment.mult(0.5);
      //COHESION
      cohesion.div(total);
      cohesion.sub(this.loc);
      cohesion.setMag(this.maxSpeed);
      cohesion.limit(this.maxForce);
      cohesion.mult(0.75);
      //SEPERATION
      seperation.div(total);
      seperation.setMag(this.maxSpeed);
      seperation.sub(this.vel);
      seperation.limit(this.maxForce);
      seperation.mult(0.75);
    }
    let steeringForces = [alignment, cohesion, seperation];
    return steeringForces;
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.loc);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < fontSize * 0.5) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    this.applyForce(steer);
  }

  flee(target) {
    let desired = p5.Vector.sub(target, this.loc);
    let d = desired.mag();
    if (d < fontSize * 0.5) {
      let speed = map(d, 0, 100, 0, this.maxSpeed);
      desired.setMag(speed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.mult(-1);
      this.applyForce(steer);
    }
  }

  display(particlesArray) {
    fill(100);
    strokeWeight(2);
    point(this.loc.x, this.loc.y);
    for (let p of particlesArray) {
      let d = dist(this.loc.x, this.loc.y, p.loc.x, p.loc.y);
      if (d > connectionDistance || this === p) continue;
      let a = map(d, 0, connectionDistance, 100, 5);
      let sw = map(d, 0, connectionDistance, strokeW, strokeW / 100);
      strokeWeight(sw);
      stroke(90, a);
      line(this.loc.x, this.loc.y, p.loc.x, p.loc.y);
    }
  }

  update() {
    this.loc.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
  }

  edgeCheck() {
    let buffer = width * 0.1;
    if (this.loc.x <= -buffer) {
      this.loc.x = width + buffer;
    } else if (this.loc.x >= width + buffer) {
      this.loc.x = 0 - buffer;
    } else if (this.loc.y <= -buffer) {
      this.loc.y = height + buffer;
    } else if (this.loc.y >= height + buffer) {
      this.loc.y = 0 - buffer;
    }
  }

  applyForce(force) {
    let f = force;
    f.limit(this.maxForce);
    this.acc.add(f);
  }
} // END OF CLASS
