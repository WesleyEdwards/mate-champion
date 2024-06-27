export function generateRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomOutOf(max: number): boolean {
  return generateRandomInt(0, max) === 1;
}

export function debounceLog(...args: any[]) {
  if (generateRandomInt(0, 10) === 1) {
    console.log(...args);
  }
}

export const emptyStats = {
  score: 0,
  lives: 3,
  level: 1,
  ammo: 20,
  levelCreator: "",
};
