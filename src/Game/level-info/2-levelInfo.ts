import { LevelInfo } from "./levelInfo";

export const levelTwoInfo: LevelInfo = {
  platforms: [
    { x: 100, y: 150, width: 80, height: 40, color: "red" },
    { x: 350, y: 450, width: 230, height: 40, color: "red" },
    { x: 540, y: 110, width: 220, height: 40, color: "red" },
    { x: 950, y: 280, width: 260, height: 40, color: "red" },
    { x: 1000, y: 400, width: 470, height: 40, color: "red" },
    { x: 1130, y: 210, width: 300, height: 40, color: "red" },
    { x: 1250, y: 160, width: 360, height: 40, color: "red" },
    { x: 1680, y: 300, width: 60, height: 40, color: "red" },
    { x: 1830, y: 430, width: 100, height: 40, color: "red" },
    { x: 1870, y: 270, width: 60, height: 40, color: "red" },
    { x: 2020, y: 330, width: 100, height: 40, color: "red" },
    { x: 2320, y: 400, width: 100, height: 40, color: "red" },
    { x: 2380, y: 280, width: 450, height: 40, color: "red" },
    { x: 2730, y: 210, width: 440, height: 40, color: "red" },
    { x: 2750, y: 150, width: 340, height: 40, color: "red" },
    { x: 3200, y: 420, width: 200, height: 40, color: "red" },
    { x: 3290, y: 360, width: 100, height: 40, color: "red" },
    { x: 3550, y: 270, width: 100, height: 40, color: "red" },
    { x: 3730, y: 300, width: 100, height: 40, color: "red" },
    { x: 3920, y: 100, width: 320, height: 40, color: "red" },
    { x: 3930, y: 180, width: 350, height: 40, color: "red" },
    { x: 4080, y: 380, width: 340, height: 40, color: "red" },
    { x: 4240, y: 40, width: 200, height: 40, color: "red" },
    { x: 4330, y: 450, width: 80, height: 40, color: "red" },
    { x: 4570, y: 420, width: 310, height: 40, color: "red" },
  ],
  floors: [
    { x: -500, width: 870, color: "green" },
    { x: 500, width: 660, color: "green" },
    { x: 1500, width: 850, color: "green" },
    { x: 2500, width: 870, color: "green" },
    { x: 3500, width: 760, color: "green" },
    { x: 4500, width: 2000, color: "green" },
  ],
  opponents: {
    grog: [
      { initPos: { x: 1000, y: 100 }, moveSpeed: 0.07 },
      { initPos: { x: 2000, y: 100 }, moveSpeed: 0.07 },
      { initPos: { x: 3000, y: 100 }, moveSpeed: 0.07 },
      { initPos: { x: 4000, y: 100 }, moveSpeed: 0.07 },
    ],
  },
  packages: [
    { x: 1680, y: 300 },
    { x: 2930, y: 150 },
    { x: 4730, y: 420 },
  ],
};
