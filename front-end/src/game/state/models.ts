
export type Keys = {
    up: boolean
    right: boolean
    left: boolean
    down: boolean
    jump: boolean
    shoot: boolean
    shank: boolean
    toJump: 0 | 1
    toShoot: 0 | 1
    toShank: 0 | 1
    mostRecentX: "left" | "right"
  }
  
export type PlayStats = {
    score: number
    lives: number
    level: number
    ammo: number
  }
  

export type WinState = "lose" | "playing" | "initial" | "nextLevel" | "loseLife"
