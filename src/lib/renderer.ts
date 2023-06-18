import init, { simulate } from "chaos_theory";
import * as PIXI from "pixi.js";
import type { RenderSettings, SimulationSettings } from "@/types/main.d";
import { RefObject } from "react";

// render circles
function calculateNewPoint(
  originalX: number,
  originalY: number,
  angleInDegrees: number,
  distance: number
) {
  // Convert angle from degrees to radians
  let angleInRadians = angleInDegrees * (Math.PI / 180);

  // Calculate the new coordinates
  let newX = distance * Math.cos(angleInRadians) + originalX;
  let newY = distance * Math.sin(angleInRadians) + originalY;

  // Return the new coordinates as an object
  return { x: newX, y: newY };
}

// Simulate and render
let app: PIXI.Application | null = null;
export function initCanvas(canvasRef: RefObject<HTMLCanvasElement>) {
  // attach app to the canvas
  if (canvasRef.current === null) return;
  app = new PIXI.Application({
    view: canvasRef.current,
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    antialias: true,
  });
}

type Circle = {
  x: number;
  y: number;
  radius: number;
  id: number | null;
};
type LaserBeam = {
  x: number;
  y: number;
  angle: number;
  bounces: boolean;
  end_x: number;
  end_y: number;
};

let circles: Circle[] = [];
let laserBeams: LaserBeam[] = [];

export function renderWorld({ zoom, cameraX, cameraY }: RenderSettings) {
  // checks before rendering
  // checks if runs on client
  if (typeof window === "undefined") return;

  // check if canvas is initialized
  if (!app) {
    console.warn("app is not initialized");
    return;
  }

  const SCALER_CONST = zoom;
  let res_x = window.innerWidth;
  let res_y = window.innerHeight;

  // clear canvas before the next render
  app.stage.removeChildren();

  // create circle sprite
  for (let i of circles) {
    let circle = new PIXI.Graphics();
    circle.beginFill(0x9966ff);
    circle.drawCircle(
      (i.x + cameraX) * SCALER_CONST,
      -(i.y + cameraY) * SCALER_CONST,
      i.radius * SCALER_CONST
    );
    circle.endFill();
    circle.x = res_x / 2;
    circle.y = res_y / 2;
    app.stage.addChild(circle);
  }
  // create laser beams
  for (let i of laserBeams) {
    // check if the laser beam has not bounced from one circle to another circle
    if (!i.bounces) {
      let line = new PIXI.Graphics();
      line.lineStyle(1, 0xffffff);
      line.moveTo(
        (i.x + cameraX) * SCALER_CONST,
        -(i.y + cameraY) * SCALER_CONST
      );

      const line_end = calculateNewPoint(i.x, i.y, i.angle, 100);
      line.lineTo(
        (line_end.x + cameraX) * SCALER_CONST,
        -(line_end.y + cameraY) * SCALER_CONST
      );

      line.x = res_x / 2;
      line.y = res_y / 2;
      app.stage.addChild(line);
      break;
    }

    let line = new PIXI.Graphics();
    line.lineStyle(1, 0xffffff);
    line.moveTo(
      (i.x + cameraX) * SCALER_CONST,
      -(i.y + cameraY) * SCALER_CONST
    );
    line.lineTo(
      (i.end_x + cameraX) * SCALER_CONST,
      -(i.end_y + cameraY) * SCALER_CONST
    );
    line.x = res_x / 2;
    line.y = res_y / 2;
    app.stage.addChild(line);
  }
}

export async function simulateWorld(
  { ini_x, ini_y, ini_angle, reflectionsNum }: SimulationSettings,
  setAngleCalculated: (angle: number) => void
) {
  await init();
  const out = JSON.parse(simulate(ini_x, ini_y, ini_angle, reflectionsNum));
  circles = out.circles;
  laserBeams = out.laser_beams;
  setAngleCalculated(out.laser_beams[out.laser_beams.length - 1].angle / 360);
}
