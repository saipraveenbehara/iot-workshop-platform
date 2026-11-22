# NXplorers IoT Workshop Platform 🚀

A real-time, gamified web platform for the **NXplorers 3-Hour Hands-On IoT Workshop** featuring Raspberry Pi Pico WH, MicroPython, sensors, actuators, and simulated cloud IoT telemetry.

---

## ⚡ Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
This command runs both the Express + Socket.io backend (`http://localhost:3001`) and the Vite React frontend (`http://localhost:5173`) concurrently.

- **Student Interface:** `http://localhost:5173` (or `http://<LAN_IP>:5173` for student laptops on the same Wi-Fi/hotspot)
- **Facilitator Dashboard:** Click the **Facilitator** button in the top header or toggle Admin mode.
- **Simulated ThingSpeak Telemetry Feed:** `http://localhost:3001/api/feed`
- **Health Check:** `http://localhost:3001/api/health`

---

## 🧭 Redesigned Pedagogical Flow (Linear & Focused)

Each mission stage follows a strict, distraction-free 3-phase progression:

```
[ Phase 1: 💡 Concept Byte ] ──► [ Phase 2: 🛠️ Build & Code Guide ] ──► [ Phase 3: 🧠 Challenge Quiz ] ──► Next Mission!
```

1. **Phase 1: Concept Byte (Consumes View)**
   - The entire page is dedicated to a 60-second concept with real-world metaphors (e.g. *The Two-Door Security Air-lock*, *The Water Pipe Valve*).
   - Rich 2D visual anatomy diagrams illustrate electrical physics and digital logic.
   - Core takeaways and engineering safety rules.
   - **Forward Action:** A prominent `Next: Step into Build Guide ➔` button.
   - *Note:* Students cannot access or see the quiz at this stage.

2. **Phase 2: Build & Code Guide**
   - **Circuit Visualizer Toggle:** Switch between:
     - **Tactile Breadboard:** Top-down orthographic view with step-by-step navigation, green pulsing target holes, and color-coded wire paths.
     - **Wokwi Interactive Hardware Simulator:** Powered by `@wokwi/elements` with live interactive LEDs, push buttons, 220Ω resistors, OLED screens, and buzzers!
   - **Chunked MicroPython Code Viewer:** Digestible code chunks with line explanations and one-click copy buttons.
   - **Hands-On Verification Test:** Clear checklist for running the code in Thonny and observing physical hardware behavior.
   - **Forward Action:** `Next: Verify Understanding (Quiz) ➔`.

3. **Phase 3: Challenge Quiz & Mastery Gate**
   - In-page quiz container (no popups).
   - Instant verification for multiple-choice questions.
   - **Wrong Answer Workflow (Note 1):** If an incorrect option is chosen, an alert displays the helpful hint, and a prominent **`↺ Try Again (Select Another Option)`** button enables immediate re-selection without being locked out.
   - **Mastery Celebration:** Correct completion triggers confetti, awards +100 XP to the team, syncs with the live classroom leaderboard via WebSockets, and unlocks the next Mission Stage!

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Zustand (state management + `localStorage` persistence), Lucide Icons, Canvas-Confetti.
- **Hardware Simulation:** `@wokwi/elements` custom web components (`<wokwi-led>`, `<wokwi-pushbutton>`, `<wokwi-resistor>`, `<wokwi-ssd1306>`, `<wokwi-buzzer>`) + live circuit visualizers.
- **Backend / Real-Time Sync:** Node.js, Express, Socket.io, TypeScript execution via `tsx`.
- **Zero-Internet / Offline Fallback:** Includes a built-in mock telemetry feed generator and facilitator alert injector so the workshop can run 100% offline if venue Wi-Fi drops.

---

## 📌 Locked Hardware Pinout

| Peripheral | Pico WH Pin | Physical Pin # | Note / Circuit Details |
| :--- | :--- | :--- | :--- |
| **Green LED** | GP15 | Pin 20 | Anode to 220Ω resistor to GP15; Cathode to Blue GND Rail |
| **Orange LED** | GP16 | Pin 21 | Anode to 220Ω resistor to GP16; Cathode to Blue GND Rail |
| **Red LED** | GP17 | Pin 22 | Anode to 220Ω resistor to GP17; Cathode to Blue GND Rail |
| **Push Button** | GP14 | Pin 19 | One leg to GP14, diagonal leg to GND (`Pin.PULL_UP`) |
| **OLED Display SDA** | GP4 | Pin 6 | I2C0 Data (SSD1306 128x64) |
| **OLED Display SCL** | GP5 | Pin 7 | I2C0 Clock |
| **Active Buzzer** | GP18 | Pin 24 | Positive leg to GP18, negative leg to GND |
| **Breadboard 3.3V Rail** | 3V3 OUT | Pin 36 | Red Rail (+) |
| **Breadboard GND Rail** | GND | Pin 38 | Blue Rail (-) |

---

## 👥 Authorized Team Roster (10 Teams)

1. `Team 1 — CyberKnights`
2. `Team 2 — QuantumCoders`
3. `Team 3 — SensorSquad`
4. `Team 4 — ByteBandits`
5. `Team 5 — PicoPioneers`
6. `Team 6 — CircuitChamps`
7. `Team 7 — LogicLegends`
8. `Team 8 — RoboRangers`
9. `Team 9 — TechTitans`
10. `Team 10 — WireWizards`

---

## 📄 Master Documents

- **Procurement Google Sheet:** [Open Sheet](https://docs.google.com/spreadsheets/d/1DfJr1uqqtA6uyMO3ztJcRt0pDJaFrt_R9JfqH4-fYiE/edit)
- **Master Curriculum & Build Plan Google Doc:** [Open Doc](https://docs.google.com/document/d/188k2SXQJXH-Az-DT6Lp-zZSZ7UqULWtze4tW4or0udg/edit)
