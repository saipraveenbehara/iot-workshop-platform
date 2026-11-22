import React from 'react';
import { Breadboard, Led, Resistor, PushButton, Oled, Dht22, PotModule, PicoW,
  ledMeta, resistorMeta, pushButtonMeta, oledMeta, dht22Meta, potModuleMeta, picoWMeta,
  getHole, placeByPin, PartHover, BreadboardHover } from './index.js';

/** Everything lives in one SVG; the breadboard sits at (BB.x, BB.y) and parts use breadboard coordinates. */
export default function Example() {
  const BB = { x: 120, y: 0 };
  const at = (h) => ({ x: BB.x + h.x, y: BB.y + h.y });

  const led = placeByPin(ledMeta, 'C', at(getHole('a', 11)));        // cathode a11, anode a12
  const res = placeByPin(resistorMeta, '1', at(getHole('c', 20)));   // 1 kΩ across c20 → c26
  const btn = placeByPin(pushButtonMeta, '1.l', at(getHole('c', 36)));

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="520" viewBox="0 0 800 416" style={{ background: '#dcdcdc' }}>
      <PicoW x="20" y="2" />
      <Breadboard x={BB.x} y={BB.y} highlight={['e26']} />
      <Led {...led} lit />
      <Resistor {...res} ohms={1000} />
      <PushButton {...btn} />
      <PushButton x="160" y="270" color="red" />
      <Oled x="250" y="250">
        <text x="4" y="18" fill="#fff" fontFamily="monospace" fontSize="14">Hello</text>
      </Oled>
      <Dht22 x="380" y="240" />
      <PotModule x="470" y="250" value={0.3} />
      {/* hover layers: same x/y/scale as the part, rendered after it */}
      <BreadboardHover x={BB.x} y={BB.y} defaultHole={getHole('e', 26)} />
      <PartHover meta={ledMeta} {...led} defaultHover="A" />
      <PartHover meta={resistorMeta} {...res} />
      <PartHover meta={pushButtonMeta} {...btn} />
      <PartHover meta={oledMeta} x={250} y={250} />
      <PartHover meta={dht22Meta} x={380} y={240} />
      <PartHover meta={potModuleMeta} x={470} y={250} />
      <PartHover meta={picoWMeta} x={20} y={2} />
    </svg>
  );
}
