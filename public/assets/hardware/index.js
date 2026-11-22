import Breadboard, { breadboardMeta } from './Breadboard.jsx';
import Led, { ledMeta } from './Led.jsx';
import Resistor, { resistorMeta, resistorBands } from './Resistor.jsx';
import PushButton, { pushButtonMeta } from './PushButton.jsx';
import Oled, { oledMeta } from './Oled.jsx';
import Dht22, { dht22Meta } from './Dht22.jsx';
import PotModule, { potModuleMeta } from './PotModule.jsx';
import PicoW, { picoWMeta } from './PicoW.jsx';

export * from './utils.js';
export { PartHover, BreadboardHover, PART_SPECS } from './Hover.jsx';
export * from './breadboardGeometry.js';
export { Breadboard, Led, Resistor, PushButton, Oled, Dht22, PotModule, PicoW, resistorBands };
export { breadboardMeta, ledMeta, resistorMeta, pushButtonMeta, oledMeta, dht22Meta, potModuleMeta, picoWMeta };

/** Registry: look a part up by id, e.g. PARTS['led'].Component / .meta.pins */
export const PARTS = {
  breadboard: { Component: Breadboard, meta: breadboardMeta },
  led: { Component: Led, meta: ledMeta },
  resistor: { Component: Resistor, meta: resistorMeta },
  pushbutton: { Component: PushButton, meta: pushButtonMeta },
  ssd1306: { Component: Oled, meta: oledMeta },
  dht22: { Component: Dht22, meta: dht22Meta },
  potentiometer: { Component: PotModule, meta: potModuleMeta },
  'pico-w': { Component: PicoW, meta: picoWMeta },
};
