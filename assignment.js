/** Multiple image Sprite */
class MSprite {
  constructor(
    spritesheet,
    transform,
    cellSizeX = 16,
    cellSizeY = 16,
    filter = false,
    isFlipped = false,
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
    this.isHidden = false;
    this.width = this.cellSizeX * this.transform.scale.x;
    this.height = this.cellSizeY * this.transform.scale.y;
    // center
    this.transform.center(cellSizeX, cellSizeY, isFlipped);

    console.log(
      "Sprite Sheet created with cells ( " +
        this.cellAmountX +
        " , " +
        this.cellAmountY +
        " )",
    );
  }

  update() {}

  draw(ctx) {
    if (this.isHidden) {
      // if hidden don't draw
      return;
    }

    this.width = this.cellSizeX * this.transform.scale.x;
    this.height = this.cellSizeY * this.transform.scale.y;

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
      this.width,
      this.height,
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
      isFlipped,
    );
  }

  update() {
    super.update();
  }

  draw() {
    super.draw();
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

class Button {
  constructor(buttonSprite, gameEngine, text = "Button", onPressButton = null) {
    this.buttonSprite = buttonSprite;
    this.rectTransform = {
      width: buttonSprite.width,
      height: buttonSprite.height,
      x: buttonSprite.transform.position.x,
      y: buttonSprite.transform.position.y,
    };

    this.gameEngine = gameEngine;
    this.onPressButton = onPressButton;
    this.text = text;

    // Visual
    this.originalScaleX = this.buttonSprite.transform.scale.x;
    this.originalScaleY = this.buttonSprite.transform.scale.y;
    this.isScaled = false;
    this.scalefactor = 1.1;
  }

  update() {
    //this.buttonSprite.update();
    const mousePos = this.gameEngine.mouse; // mousePosition
    const clickPos = this.gameEngine.click; // clcik position

    const posInside =
      mousePos === null ? false : this.pointInside(mousePos.x, mousePos.y);
    const clickedInside =
      clickPos === null ? false : this.pointInside(clickPos.x, clickPos.y);

    // visual
    if (posInside) {
      this.buttonSprite.transform.scale.x =
        this.originalScaleX * this.scalefactor;
      this.buttonSprite.transform.scale.y =
        this.originalScaleY * this.scalefactor;
      this.isScaled = true;
      //console.log("Button Hovered!");
    } else {
      this.buttonSprite.transform.scale.x = this.originalScaleX;
      this.buttonSprite.transform.scale.y = this.originalScaleY;
      this.isScaled = false;
      //console.log("Button NOT Hovered!");
    }

    if (clickPos !== null && posInside && clickedInside) {
      //console.log("Button Clicked");

      if (this.onPressButton !== null) {
        this.onPressButton();
      }

      this.gameEngine.click = null;

      // visual
      this.buttonSprite.transform.scale.x = this.originalScaleX;
      this.buttonSprite.transform.scale.y = this.originalScaleY;
    }
  }

  draw(ctx) {
    this.buttonSprite.draw(ctx);
    ctx.save();
    let remSize = 3.2;
    if (this.isScaled) {
      remSize = remSize * this.scalefactor;
    }
    ctx.font = remSize + "rem Pixelify Sans";

    // does not work properly
    const xScaling = this.isScaled ? 1 : 1 * this.scalefactor;
    const yScaling = this.isScaled ? 1 : 1 * this.scalefactor;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.text,
      this.rectTransform.x + this.rectTransform.width / 2, // + offsetX,
      this.rectTransform.y + this.rectTransform.height / 2, // + offsetY,
    );

    ctx.scale(xScaling, yScaling);
    ctx.restore();
  }

  pointInside(px, py) {
    return (
      px >= this.rectTransform.x &&
      px <= this.rectTransform.x + this.rectTransform.width &&
      py >= this.rectTransform.y &&
      py <= this.rectTransform.y + this.rectTransform.height
    );
  }
}
