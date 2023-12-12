import { LevelInfo } from "./levelInfo";
export const levelOneInfo: LevelInfo = {
  platforms: [
    { x: 100, y: 150, width: 70, height: 40, color: "springgreen" },
    { x: 1080, y: 400, width: 310, height: 40, color: "springgreen" },
    { x: 1100, y: 200, width: 200, height: 40, color: "springgreen" },
    { x: 1300, y: 290, width: 290, height: 40, color: "springgreen" },
    { x: 1840, y: 420, width: 420, height: 40, color: "springgreen" },
    { x: 2580, y: 410, width: 270, height: 40, color: "springgreen" },
    { x: 3010, y: 410, width: 240, height: 40, color: "springgreen" },
    { x: 3050, y: 160, width: 430, height: 40, color: "springgreen" },
    { x: 3410, y: 270, width: 370, height: 40, color: "springgreen" },
    { x: 3650, y: 430, width: 490, height: 40, color: "springgreen" },
    { x: 3830, y: 230, width: 250, height: 40, color: "springgreen" },
    { x: 4060, y: 340, width: 450, height: 40, color: "springgreen" },
    { x: 4420, y: 240, width: 450, height: 40, color: "springgreen" },
  ],
  floors: [
    { x: -500, width: 2500, color: "green" },
    { x: 2100, width: 2200, color: "green" },
    { x: 4500, width: 1000, color: "green" },
  ],
  opponents: { grog: [{ initPos: { x: 3000, y: 100 }, moveSpeed: 0.05 }] },
  packages: [
    // { x: 1200, y: 200 },
    // { x: 2670, y: 525 },
    // { x: 4190, y: 340 },
  ],
};
