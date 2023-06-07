"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
          massSetCircles.circleRadius
        );
        render(settings, setAngleCalculated);
      });
    }
  }, [massSetCircles]);

  useEffect(() => {
    render(settings, setAngleCalculated);
  }, [settings]);

  const formRef = useRef<HTMLFormElement>(null);
  function updateSettings() {
    // get data from form
    // for mass set circles
    let circleAmountX: number | undefined = Number(
      (formRef?.current as HTMLFormElement).circleAmountX?.value
    );
    if (circleAmountX === undefined) {
      if (!massSetCircles?.circleAmountX) {
        circleAmountX = 0;
      } else {
        circleAmountX = massSetCircles.circleAmountX;
      }
    }
    let circleAmountY: number | undefined = Number(
      (formRef?.current as HTMLFormElement).circleAmountY?.value
    );
    if (circleAmountY === undefined) {
      if (!massSetCircles?.circleAmountY) {
        circleAmountY = 0;
      } else {
        circleAmountY = massSetCircles.circleAmountY;
      }
    }
    let circleRadius: number | undefined = Number(
      (formRef?.current as HTMLFormElement).circleRadius?.value
    );
    if (circleRadius === undefined) {
      if (!massSetCircles?.circleRadius) {
        circleRadius = 0;
      } else {
        circleRadius = massSetCircles.circleRadius;
      }
    }
    let circleSpacing = Number(
      (formRef?.current as HTMLFormElement).circleSpacing?.value
    );
    if (circleSpacing === undefined) {
      if (!massSetCircles?.circleSpacing) {
        circleSpacing = 0;
      } else {
        circleSpacing = massSetCircles.circleSpacing;
      }
    }
    // for settings
    let zoom = Number((formRef?.current as HTMLFormElement).zoom?.value);
    let ini_x = Number((formRef?.current as HTMLFormElement).ini_x?.value);
    let ini_y = Number((formRef?.current as HTMLFormElement).ini_y?.value);
    let ini_angle = Number(
      (formRef?.current as HTMLFormElement).ini_angle?.value
    );
    let reflectionsNum: number | bigint | undefined = Number(
      (formRef?.current as HTMLFormElement).reflectionsNum?.value
    );
    if (reflectionsNum === undefined || isNaN(reflectionsNum)) {
      if (!settings?.reflectionsNum) {
        reflectionsNum = 20n;
      } else {
        reflectionsNum = settings.reflectionsNum;
      }
    } else {
      reflectionsNum = BigInt(reflectionsNum);
    }

    setMassSetCircles({
      circleAmountX,
      circleAmountY,
      circleRadius,
      circleSpacing,
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
        <div className="space-y-1">
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

        <h1 className="p-0 pb-2">Laser settings</h1>

        <div className="space-y-1 mb-2">
          <label htmlFor="ini_angle">Set angle of the laser</label>
          <Input
            type="number"
            name="ini_angle"
            id="ini_angle"
            placeholder="Angle"
            defaultValue={settings?.ini_angle || ""}
            step={0.00000001}
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
