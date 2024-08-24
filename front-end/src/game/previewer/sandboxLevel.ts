import { FullLevelInfo } from "../loopShared/models";
import { sandboxOpps } from "./sandboxOpps";

export const sandboxLevel: FullLevelInfo = {
  _id: "0ea89995-0720-4ef2-a865-f2d37bbf4698",
  owner: "",
  public: true,
  creatorName: "OWNER",
  endPosition: 4500,
  name: "Sandbox",
  description: "A level for testing",
  packages: [
    { x: 1187, y: 338 },
    { x: 1035, y: 341 },
    { x: 1420, y: 195 },
    { x: 1231, y: 118 },
  ],
  opponents: {
    grog: [
      ...sandboxOpps({ direction: "horizontal", start: { x: 700, y: 270 } }),
      ...sandboxOpps({ direction: "horizontal", start: { x: 1500, y: 500 } }),
      ...sandboxOpps({ direction: "horizontal", start: { x: 1800, y: 500 } }),
      ...sandboxOpps({ direction: "vertical", start: { x: 270, y: 90 } }),
      ...sandboxOpps({ direction: "vertical", start: { x: 270, y: 500 } }),
    ],
  },
  platforms: [
    { x: 389, y: 440, width: 100, height: 40, color: "springgreen" },
    { x: 895, y: -160, width: 100, height: 40, color: "springgreen" },
    { x: 966, y: 199, width: 100, height: 40, color: "springgreen" },
    { x: 979, y: -90, width: 100, height: 40, color: "springgreen" },
    { x: 987, y: 114, width: 100, height: 40, color: "springgreen" },
    { x: 1061, y: 424, width: 310, height: 40, color: "springgreen" },
    { x: 1083, y: 59, width: 100, height: 40, color: "springgreen" },
    { x: 1100, y: 200, width: 200, height: 40, color: "springgreen" },
    { x: 1194, y: -47, width: 100, height: 40, color: "springgreen" },
    { x: 1250, y: -150, width: 100, height: 40, color: "springgreen" },
    { x: 1300, y: 290, width: 290, height: 40, color: "springgreen" },
    { x: 2800, y: 410, width: 270, height: 40, color: "springgreen" },
    { x: 3050, y: 160, width: 430, height: 40, color: "springgreen" },
    { x: 3100, y: 350, width: 240, height: 40, color: "springgreen" },
    { x: 3410, y: 270, width: 370, height: 40, color: "springgreen" },
    { x: 3650, y: 430, width: 490, height: 40, color: "springgreen" },
    { x: 4060, y: 340, width: 450, height: 40, color: "springgreen" },
    { x: 4420, y: 240, width: 450, height: 40, color: "springgreen" },
  ],
  floors: [
    { x: -500, width: 2500, color: "green" },
    { x: 2100, width: 2200, color: "green" },
    { x: 4500, width: 1000, color: "green" },
  ],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};
