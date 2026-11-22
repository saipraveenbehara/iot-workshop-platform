import React from 'react';

declare module '../hardware/index.js' {
  export interface Pin {
    name: string;
    label?: string;
    number?: number;
    x: number;
    y: number;
  }

  export interface PartMeta {
    id: string;
    name: string;
    width: number;
    height: number;
    pins: Pin[];
    screen?: {
      x: number;
      y: number;
      width: number;
      height: number;
      pixelsW: number;
      pixelsH: number;
    };
  }

  export interface Hole {
    id: string;
    x: number;
    y: number;
    net: string;
  }

  export const BREADBOARD: {
    id: string;
    name: string;
    width: number;
    height: number;
    columns: number;
    pitch: number;
  };

  export const ROW_Y: Record<string, number>;
  export const RAIL_Y: Record<string, Record<string, number>>;
  export const RAIL_HOLES: number;

  export function colX(col: number): number;
  export function railX(n: number): number;
  export function getHole(row: string, col: number): Hole;
  export function getRailHole(side: 'top' | 'bottom', polarity: '+' | '-', n: number): Hole;
  export function holeById(id: string): Hole;
  export function allHoles(): Hole[];
  export function snapToHole(x: number, y: number, maxDist?: number): Hole | null;
  export function snapPartToBreadboard(meta: PartMeta, origin: { x: number; y: number }, scale?: number, tol?: number): {
    x: number;
    y: number;
    connections: { pin: string; hole: Hole }[];
  } | null;

  export function pinPosition(meta: PartMeta, pinName: string, origin?: { x: number; y: number }, scale?: number): { x: number; y: number };
  export function placeByPin(meta: PartMeta, pinName: string, target: { x: number; y: number }, scale?: number): { x: number; y: number };

  export const breadboardMeta: PartMeta;
  export const ledMeta: PartMeta;
  export const resistorMeta: PartMeta;
  export const pushButtonMeta: PartMeta;
  export const oledMeta: PartMeta;
  export const dht22Meta: PartMeta;
  export const potModuleMeta: PartMeta;
  export const picoWMeta: PartMeta;

  export const Breadboard: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    highlight?: string[];
    [key: string]: any;
  }>;

  export const Led: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    color?: 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'white';
    lit?: boolean;
    brightness?: number;
    [key: string]: any;
  }>;

  export const Resistor: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    ohms?: number;
    tolerance?: 'gold' | 'silver';
    [key: string]: any;
  }>;

  export const PushButton: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    color?: 'green' | 'red' | 'blue' | 'yellow' | 'white' | 'black';
    pressed?: boolean;
    [key: string]: any;
  }>;

  export const Oled: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    children?: React.ReactNode;
    [key: string]: any;
  }>;

  export const Dht22: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    [key: string]: any;
  }>;

  export const PotModule: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    value?: number;
    [key: string]: any;
  }>;

  export const PicoW: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    [key: string]: any;
  }>;

  export const PartHover: React.FC<{
    meta: PartMeta;
    x?: number | string;
    y?: number | string;
    scale?: number;
    onPinClick?: (pin: Pin) => void;
    onPinHover?: (pin: Pin | null) => void;
    showLabels?: boolean;
    defaultHover?: string | null;
    specs?: string[];
  }>;

  export const BreadboardHover: React.FC<{
    x?: number | string;
    y?: number | string;
    scale?: number;
    onHoleClick?: (hole: Hole) => void;
    onHoleHover?: (hole: Hole | null) => void;
    defaultHole?: Hole | null;
  }>;

  export const PART_SPECS: Record<string, string[]>;
}
