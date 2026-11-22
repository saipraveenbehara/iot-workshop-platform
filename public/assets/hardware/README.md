# Wokwi-style electronic parts (React + SVG)

Parts: Breadboard (63 cols, a–j, 4 power rails), LED, Resistor, Push button, OLED SSD1306, DHT22, Potentiometer module, Raspberry Pi Pico W.

Units: 1 SVG unit = 1 CSS px @96dpi (1 mm = 3.78 units). Pin pitch = 9.6 units (0.1").
Every part is `<svg x y width height viewBox>` so it works standalone or nested in a parent <svg>.

Each part file exports:
- `default` component. Props: `x, y, scale, ...svgProps` plus part props
  (Led: color, lit, brightness · Resistor: ohms, tolerance · PushButton: color, pressed ·
   Oled: children drawn in 128x64 pixel space · PotModule: value 0..1)
- `<name>Meta` = { id, name, width, height, pins: [{ name, x, y }] }  (pin coords are the connection points, scale 1, relative to part top-left)

Breadboard helpers (breadboardGeometry.js):
- getHole('a', 11) -> { id, x, y, net }          terminal strip hole
- getRailHole('top', '+', 3)                      power rail hole
- snapToHole(x, y), snapPartToBreadboard(meta, origin) -> { x, y, connections } | null
- `net` tells you what is electrically shorted (a–e of a column, f–j of a column, each rail)

Placement: `placeByPin(ledMeta, 'C', getHole('a', 11))` -> top-left for the LED so its cathode sits in a11
(anode lands in a12 because the pins are exactly one pitch apart).
Needs React 18+ (useId). See Example.jsx.
