"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import init, { manny_circle_set } from "chaos_theory";
import { cn } from "@/lib/utils";
import { render, initCanvas } from "@/lib/renderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { Settings, MassSetCircles } from "@/types/main.d";
import { isInteger } from "tailwind-merge/dist/lib/validators";
export default function Home() {
  const [angleCalculated, setAngleCalculated] = useState<number>(0);
  const simCanvas = useRef<HTMLCanvasElement>(null);

  // simulation settings
  const [settings, setSettings] = useState<Settings>({
    zoom: 20,
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

      if (!settings) return;
      initCanvas(simCanvas);
      render(settings, setAngleCalculated);
    }
    window.addEventListener("resize", resizer);

    return () => {
      window.removeEventListener("resize", resizer);
    };
  }, [settings, simCanvas]);

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
        render(settings, setAngleCalculated);
      });
    }
  }, [massSetCircles]);

  useEffect(() => {
    render(settings, setAngleCalculated);
  }, [settings]);

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

    // for settings
    let zoom: number = setValueBasedOnForm<Settings>(settings, "zoom");
    let ini_x: number = setValueBasedOnForm<Settings>(settings, "ini_x");
    let ini_y: number = setValueBasedOnForm<Settings>(settings, "ini_y");
    let ini_angle = setValueBasedOnForm<Settings>(settings, "ini_angle");
    let reflectionsNum: bigint = BigInt(
      setValueBasedOnForm<Settings>(settings, "reflectionsNum", 20, true)
    );

    setMassSetCircles({
      circleAmountX,
      circleAmountY,
      circleRadius,
      circleSpacing,
      circleSetShiftX,
    });
    setSettings({
      zoom,
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
            min={0}
          ></Input>
        </div>

        <h1 className="p-0 pb-2">Laser settings</h1>

        <div className="space-y-1 mb-2">
          <label htmlFor="ini_angle">Set angle of the laser</label>
          <Input
            type="number"
            name="ini_angle"
            id="ini_angle"
            placeholder="Angle"
            defaultValue={settings?.ini_angle || ""}
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
            defaultValue={settings?.ini_x || ""}
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
            defaultValue={settings?.ini_y || ""}
            step={0.01}
          ></Input>
        </div>

        <h1 className="p-0 pb-2">Misc.</h1>

        <div className="space-y-1 mb-2">
          <label htmlFor="reflectionsNum">Maximum amount of reflections</label>
          <Input
            type="number"
            name="reflectionsNum"
            id="reflectionsNum"
            placeholder="Maximum amount of reflections"
            defaultValue={Number(settings?.reflectionsNum || 20) || ""}
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
            defaultValue={settings?.zoom || ""}
            step={0.01}
            min={0.01}
          ></Input>
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
