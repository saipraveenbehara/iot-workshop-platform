# Workshop Asset Drop Zone

Welcome! You can drop any images, SVGs, or custom graphics into this folder (or directly via the `assets_drop_zone` shortcut in the project root).

Files placed in this folder are served directly by Vite at `/assets/<path-to-file>`.

---

## 📁 Recommended Subfolders & Target Files

### 1. `hardware/` (Components & Board Visuals)
Drop your realistic components or Wokwi-style vector exports here:
- **`pico-wh.png` / `pico-wh.svg`** → Raspberry Pi Pico WH board
- **`breadboard.png` / `breadboard.svg`** → Full half-size 400-point breadboard
- **`led-green.png` / `led-red.png` / `led-orange.png`** → Authentic 5mm LEDs (showing long anode & short cathode flat edge)
- **`push-button.png` / `push-button.svg`** → 6×6 mm tactile momentary switch (showing legs straddling center divider)
- **`oled-display.png` / `oled-display.svg`** → 0.96" SSD1306 128×64 I2C OLED display (showing VCC, GND, SCL, SDA pins)
- **`resistor-220.png` / `resistor-220.svg`** → 220Ω resistor (Red-Red-Brown-Gold color bands)
- **`jumper-wires/`** → Dupont jumper wires (male-to-male)

### 2. `diagrams/` (Concept & Explanation Visuals)
Drop any conceptual graphics, infographic spreads, or magazine illustrations:
- **`computer-vs-microcontroller.png` / `.svg`** → Laptop vs Microcontroller side-by-side comparison
- **`api-waiter.png` / `.svg`** → Restaurant waiter analogy for Client-Server / REST API
- **`iot-tower.png` / `.svg`** → 4-layer IoT stack (Physical -> Firmware -> Network -> Cloud)
- **`oled-pixels.png` / `.svg`** → Graphic showing how pixels light up in an OLED display matrix

### 3. `icons/` (UI Badges & Icons)
- Custom team badges, kit badges, or brand marks.

---

## ⚡ How to use them once added:
Just drop your files here and tell me:
> *"I added `pico-wh.png` and `led-green.png`, please replace the current graphics with them."*

I will immediately update the React components to display your new images seamlessly!
