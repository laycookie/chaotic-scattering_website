"use client";
import { useState, useEffect } from "react";
import { render } from "@/renderer";
import { manny_circle_set } from "chaos_theory";
import type { Settings, MassSetCircles } from "@/types.d";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    zoom: 20,
    ini_x: 0,
    ini_y: 0,
    ini_angle: 0,
    reflectionsNum: 20n,
  });

  const [massSetCircles, setMassSetCircles] = useState<MassSetCircles>({
    circleAmountX: 0,
    circleAmountY: 0,
    circleRadius: 1,
    circleSpacing: 3,
  });

  return (
    <main>
      <form
        id="form-submition"
        onClick={(e) => {
          e.preventDefault();

          manny_circle_set(
            massSetCircles.circleAmountX,
            massSetCircles.circleAmountY,
            massSetCircles.circleSpacing,
            massSetCircles.circleRadius
          );
          render(settings);
        }}
      >
        <input type="number" name="zoom" id="zoom" placeholder="zoom" />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Setup basic circles</AccordionTrigger>
            <AccordionContent>
              <input
                type="number"
                step="0.000000000001"
                name="circleAmountX"
                id="circleAmountX"
                placeholder="X circles amount"
              />
              <input
                type="number"
                step="0.000000000001"
                name="circleAmountY"
                id="circleAmountY"
                placeholder="Y circles amount"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Setup basic circles</AccordionTrigger>
            <AccordionContent>
              <input
                type="number"
                step="0.000000000001"
                name="ini_x"
                id="ini_x"
                placeholder="X staring position"
              />
              <input
                type="number"
                step="0.000000000001"
                name="ini_y"
                id="ini_y"
                placeholder="Y staring position"
              />
              <input
                type="number"
                step="0.000000000001"
                name="angle"
                id="angle"
                placeholder="angle"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <input type="submit" value="render" />
      </form>
    </main>
  );
}
