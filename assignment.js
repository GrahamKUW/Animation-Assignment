/** Multiple image Sprite */
class MSprite {
  constructor(
    spritesheet,
    transform,
    cellSizeX = 16,
    cellSizeY = 16,
    filter = false,
    isFlipped = false
  ) {
    this.spritesheet = spritesheet;
    this.transform = transform;
    this.cellSizeX = cellSizeX;
    this.cellSizeY = cellSizeY;
    this.cellPosX = 0;
    this.cellPosY = 0;
    this.filter = filter;
    this.flip = isFlipped;
    this.cellAmountX = this.spritesheet.width / this.cellSizeX; // treat as grid
    this.cellAmountY = this.spritesheet.height / this.cellSizeY; // treat as grid

    // center
    this.transform.center(cellSizeX, cellSizeY, isFlipped);

    console.log(
      "Sprite Sheet created with cells ( " +
        this.cellAmountX +
        " , " +
        this.cellAmountY +
        " )"
    );
  }

  update() {}

  draw(ctx) {
    const cellImgX = this.cellPosX * this.cellSizeX;
    const cellImgY = this.cellPosY * this.cellSizeY;
    const flippedStatus = this.flip ? -1 : 1; // assume facing right from start

    ctx.save();
    ctx.imageSmoothingEnabled = this.filter;
    ctx.scale(flippedStatus, 1);

    ctx.drawImage(
      this.spritesheet,
      cellImgX,
      cellImgY,
      this.cellSizeX,
      this.cellSizeY,
      flippedStatus * this.transform.position.x,
      this.transform.position.y,
      this.cellSizeX * this.transform.scale.x,
      this.cellSizeY * this.transform.scale.y
    );

    ctx.restore();
  }
}

/** Single Image Sprite */
class SSprite extends MSprite {
  constructor(spritesheet, transform, filter = false, isFlipped = false) {
    super(
      spritesheet,
      transform,
      spritesheet.width,
      spritesheet.height,
      filter,
      isFlipped
    );
  }
}

/** Animates a sprite, with keyframes, duration, row offset, and a reference to the game engine */
class Animation {
  constructor(msprite, keyframes, duration, rowOffset = 0, gameEngine) {
    this.currentFrame = 0;
    this.msprite = msprite;
    this.keyframes = keyframes; // # of keyFrames
    this.duration = duration; // how long it takes to finish 1 loop;
    this.keyFrameDuration = duration / keyframes; // how long to stay on each keyframe;
    this.gameEngine = gameEngine;
    this.runningTime = 0;

    this.rowOffset = rowOffset;
    this.playing = true;
  }

  update() {
    if (!this.playing) {
      return;
    }

    this.runningTime += this.gameEngine.clockTick;

    if (this.runningTime >= this.keyFrameDuration) {
      this.currentFrame = (this.currentFrame + 1) % this.keyframes;
      this.runningTime = 0;
    }
  }

  draw(ctx) {
    this.msprite.cellPosY = this.rowOffset;
    this.msprite.cellPosX = this.currentFrame;
    this.msprite.draw(ctx);
  }
}

/** Simple state machine that allows a single aniamtion to played at a time */
class AnimationController {
  constructor() {
    this.currentAnimation = null;
    this.playing = true;
    this.animations = [];
  }

  update() {
    if (this.currentAnimation != null) {
      this.currentAnimation.playing = this.playing;
      this.currentAnimation.update();
    }
  }

  draw(ctx) {
    if (this.currentAnimation != null) {
      this.currentAnimation.draw(ctx);
    }
  }

  add(anim) {
    if (this.currentAnimation === null) {
      this.currentAnimation = anim;
    }

    this.animations.push(anim);
  }

  switch(index) {
    this.currentAnimation = this.animations[index];
  }

  play() {
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }
}

class Transform {
  /** Position vector2, rotation float, scale vector2, vectors are [x, y] */
  constructor(posX = 0, posY = 0, rotZ = 0, sclX = 1, sclY = 1) {
    this.position = new Object();
    this.position.x = posX;
    this.position.y = posY;
    this.rotation = rotZ;
    this.scale = new Object();
    this.scale.x = sclX;
    this.scale.y = sclY;
  }

  center(width, height, isFlipped = false) {
    const widthMod = isFlipped ? this.scale.x * width : 0;

    this.position.x -= (width * this.scale.x) / 2 - widthMod;

    this.position.y -= (height * this.scale.y) / 2;
  }

  translate(x, y, width = 0, height = 0) {
    this.position.x = x;
    this.position.y = y;
    this.center(width, height);
  }
}
