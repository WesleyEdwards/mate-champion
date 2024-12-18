export const MAX_CANVAS_HEIGHT = 730
// export const MAX_CANVAS_HEIGHT = 576
export const MAX_CANVAS_WIDTH = MAX_CANVAS_HEIGHT * 1.78

// export const GRAVITY = 0.001;
export const GRAVITY = 0.004

export const levelConst = {
  endPos: 4500,
  playerMinX: 300
}

export const playerConst = {
  radius: 32,
  moveSpeed: 0.5,
  jumpSpeed: -0.85,
  shankTime: 250,
  meleeCoolDown: 275,
  meleeReach: 120,
  shootCoolDown: 200,
  initPos: {x: 400, y: 400},
  maxCoyoteTime: 80,
  jumpGravityFactor: 0.9,
  jumpGravityFrameDecrease: 0.93
} as const

export const cameraConst = {
  idealDistFromLeftWall: 400,
  idealMinDistFromCeiling: 290
}

export const grogConst = {
  width: 90,
  height: 90,
  distFromChampMelee: 10,
  jumpSpeed: -1
} as const

export const platformConst = {
  defaultHeight: 40
} as const

export const floorConst = {
  floorY: MAX_CANVAS_HEIGHT - 40,
  floorHeight: 40
} as const

export const firebaseCollection = "scores-test-1"
