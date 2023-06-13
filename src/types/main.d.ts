export type SimulationSettings = {
  ini_x: number;
  ini_y: number;
  ini_angle: number;
  reflectionsNum: bigint;
};

export type RenderSettings = {
  zoom: number;
  cameraX: number;
  cameraY: number;
};

export type MassSetCircles = {
  circleAmountX: number;
  circleAmountY: number;
  circleRadius: number;
  circleSpacing: number;
  circleSetShiftX: number;
};
