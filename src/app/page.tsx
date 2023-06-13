"use client";

import { useEffect, useRef, useState } from "react";
import init, { manny_circle_set } from "chaos_theory";
import { cn } from "@/lib/utils";
import { initCanvas, simulateWorld, renderWorld } from "@/lib/renderer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type {
  MassSetCircles,
  RenderSettings,
  SimulationSettings,
} from "@/types/main.d";
export default function Home() {
  const [angleCalculated, setAngleCalculated] = useState<number>(0);
  const simCanvas = useRef<HTMLCanvasElement>(null);

  // simulation settings
  const [renderSettings, setRenderSettings] = useState<RenderSettings>({
    zoom: 20,
    cameraX: 0,
    cameraY: 0,
  });
  const [simulationSettings, setSimulationSettings] =
    useState<SimulationSettings>({
      ini_x: 0,
      ini_y: 0,
      ini_angle: 40,
      reflectionsNum: 20n,
    });

  /* we don't set the default values here because we want to
   * first init the canvas and then set the default values which will call a render
   */
  const [massSetCircles, setMassSetCircles] = useState<MassSetCircles | null>(
    null
  );

  // make canvas full screen
  useEffect(() => {
    function resizer() {
      const canvas = simCanvas.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      initCanvas(simCanvas);
      renderWorld(renderSettings);
    }
    window.addEventListener("resize", resizer);

    return () => {
      window.removeEventListener("resize", resizer);
    };
  }, [simCanvas, renderSettings]);

  // init canvas
  useEffect(() => {
    initCanvas(simCanvas);
    // default mass set circles settings
    setMassSetCircles({
      circleAmountX: 2,
      circleAmountY: 2,
      circleRadius: 1,
      circleSpacing: 3,
      circleSetShiftX: 0,
    });
  }, []);

  // create circles and before render
  useEffect(() => {
    if (massSetCircles !== null) {
      init().then(() => {
        manny_circle_set(
          massSetCircles.circleAmountX,
          massSetCircles.circleAmountY,
          massSetCircles.circleSpacing,
          massSetCircles.circleRadius,
          massSetCircles.circleSetShiftX
        );
        simulateWorld(simulationSettings, setAngleCalculated).then(() => {
          renderWorld(renderSettings);
        });
      });
    }
  }, [massSetCircles]);

  useEffect(() => {
    renderWorld(renderSettings);
  }, [renderSettings]);
  useEffect(() => {
    simulateWorld(simulationSettings, setAngleCalculated);
  }, [simulationSettings]);

  const formRef = useRef<HTMLFormElement>(null);
  function setValueBasedOnForm<T>(
    curValues: T,
    formValue: keyof T,
    defaultTo: number = 0,
    returnInt: boolean = false
  ): number {
    let value = (formRef?.current as HTMLFormElement)[formValue as string]
      ?.value;

    if (!value) {
      if (!curValues) value = curValues[formValue];
      else value = defaultTo;
    }

    // checks for big int
    if (returnInt) {
      if (Number(value) % 1 === 0) {
        return Number(BigInt(value));
      } else {
        throw new Error("value is not an integer");
      }
    }

    return Number(value);
  }
  function updateSettings() {
    if (!massSetCircles) return;
    let [
      circleAmountX,
      circleAmountY,
      circleRadius,
      circleSpacing,
      circleSetShiftX,
    ] = (
      [
        "circleAmountX",
        "circleAmountY",
        "circleRadius",
        "circleSpacing",
        "circleSetShiftX",
      ] as const
    ).map((value) => {
      return setValueBasedOnForm<MassSetCircles>(massSetCircles, value);
    });

    let [ini_x, ini_y, ini_angle] = (
      ["ini_x", "ini_y", "ini_angle"] as const
    ).map((value) => {
      return setValueBasedOnForm<SimulationSettings>(simulationSettings, value);
    });
    let reflectionsNum = BigInt(
      setValueBasedOnForm<SimulationSettings>(
        simulationSettings,
        "reflectionsNum",
        20,
        true
      )
    );
    let [cameraX, cameraY, zoom] = (
      ["cameraX", "cameraY", "zoom"] as const
    ).map((value) => {
      return setValueBasedOnForm<RenderSettings>(renderSettings, value);
    });

    setMassSetCircles({
      circleAmountX,
      circleAmountY,
      circleRadius,
      circleSpacing,
      circleSetShiftX,
    });
    setRenderSettings({
      zoom,
      cameraX,
      cameraY,
    });
    setSimulationSettings({
      ini_x,
      ini_y,
      ini_angle,
      reflectionsNum,
    });
  }
  return (
    <main>
      <div className={cn("fixed text-white m-4")}>
        <p>Angle: {angleCalculated}</p>
        <p>Random Number: {angleCalculated / 360}</p>
      </div>
      <form
        action=""
        ref={formRef}
        className={cn("fixed right-0 text-white m-4")}
        onChange={() => {
          updateSettings();
        }}
        onSubmit={(e) => {
          e.preventDefault();
          updateSettings();
        }}
      >
        <h1 className="p-0 pb-2">Set Circles</h1>
        <div>
          <div className="space-y-1 mb-2">
            <label htmlFor="circleAmountX">Amount of circles in X</label>
            <Input
              type="number"
              name="circleAmountX"
              id="circleAmountX"
              placeholder="Circle Amount X"
              defaultValue={massSetCircles?.circleAmountX || ""}
              min={0}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="circleAmountY">Amount of circles in Y</label>
            <Input
              type="number"
              name="circleAmountY"
              id="circleAmountY"
              placeholder="Circle Amount Y"
              defaultValue={massSetCircles?.circleAmountY || ""}
              min={0}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="circleRadius">Radius of the circles</label>
            <Input
              type="number"
              name="circleRadius"
              id="circleRadius"
              placeholder="Circles radius"
              defaultValue={massSetCircles?.circleRadius || ""}
              step={0.01}
              min={0}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="circleRadius">Spacing between circles</label>
            <Input
              type="number"
              name="circleSpacing"
              id="circleSpacing"
              placeholder="Circles spacing"
              defaultValue={massSetCircles?.circleSpacing || ""}
              step={0.01}
              min={0}
            ></Input>
          </div>
          <div className="space-y-1">
            <label htmlFor="circleSetShiftX">Even circle shift X</label>
            <Input
              type="number"
              name="circleSetShiftX"
              id="circleSetShiftX"
              placeholder="Even circle shift X"
              defaultValue={massSetCircles?.circleSetShiftX || ""}
              step={0.01}
            ></Input>
          </div>
        </div>
        <h1 className="p-0 pb-2">Laser settings</h1>
        <div>
          <div className="space-y-1 mb-2">
            <label htmlFor="ini_angle">Set angle of the laser</label>
            <Input
              type="number"
              name="ini_angle"
              id="ini_angle"
              placeholder="Angle"
              defaultValue={simulationSettings?.ini_angle || ""}
              step={1e-13}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="ini_x">Initial X of the laser</label>
            <Input
              type="number"
              name="ini_x"
              id="ini_x"
              placeholder="Initial X"
              defaultValue={simulationSettings?.ini_x || ""}
              step={0.01}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="ini_y">Initial Y of the laser</label>
            <Input
              type="number"
              name="ini_y"
              id="ini_y"
              placeholder="Initial Y"
              defaultValue={simulationSettings?.ini_y || ""}
              step={0.01}
            ></Input>
          </div>
        </div>

        <h1 className="p-0 pb-2">Misc.</h1>
        <div>
          <div className="space-y-1 mb-2">
            <label htmlFor="reflectionsNum">
              Maximum amount of reflections
            </label>
            <Input
              type="number"
              name="reflectionsNum"
              id="reflectionsNum"
              placeholder="Maximum amount of reflections"
              defaultValue={
                Number(simulationSettings?.reflectionsNum || 20) || ""
              }
              step={1}
              min={0}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="zoom">Zoom</label>
            <Input
              type="number"
              name="zoom"
              id="zoom"
              placeholder="Zoom"
              defaultValue={renderSettings?.zoom || ""}
              step={0.01}
              min={0.01}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="CameraX">Camera X possition</label>
            <Input
              type="number"
              name="cameraX"
              id="cameraX"
              placeholder="Camera X"
              defaultValue={renderSettings?.cameraX || ""}
              step={0.01}
            ></Input>
          </div>
          <div className="space-y-1 mb-2">
            <label htmlFor="CameraY">Camera Y possition</label>
            <Input
              type="number"
              name="cameraY"
              id="cameraY"
              placeholder="Camera Y"
              defaultValue={renderSettings?.cameraY || ""}
              step={0.01}
            ></Input>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button className="mt-4" variant="outline">
            Render
          </Button>
        </div>
      </form>
      <canvas ref={simCanvas} />
    </main>
  );
}
