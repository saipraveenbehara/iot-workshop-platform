export interface ThingSpeakFeedItem {
  created_at: string;
  entry_id: number;
  field1: string; // Temperature (Celsius)
  field2: string; // Humidity (%)
  field3: string; // Light intensity (Raw 0-1024)
  field4: string; // Soil moisture (%)
}

export interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
  };
  feeds: ThingSpeakFeedItem[];
}

let entryCounter = 100;
let baseTemp = 26.5;
let baseHumidity = 55.0;
let baseLight = 620;
let baseSoil = 42.0;

export function getMockTelemetryFeed(): ThingSpeakResponse {
  entryCounter++;

  // Add realistic small random jitter
  const tempJitter = (Math.random() - 0.5) * 1.2;
  const humJitter = (Math.random() - 0.5) * 2.5;
  const lightJitter = (Math.random() - 0.5) * 30;
  const soilJitter = (Math.random() - 0.5) * 1.0;

  const currentTemp = (baseTemp + tempJitter).toFixed(1);
  const currentHumidity = Math.max(20, Math.min(95, baseHumidity + humJitter)).toFixed(1);
  const currentLight = Math.round(Math.max(100, Math.min(1000, baseLight + lightJitter))).toString();
  const currentSoil = Math.max(10, Math.min(90, baseSoil + soilJitter)).toFixed(1);

  return {
    channel: {
      id: 8892026,
      name: "NXplorers Facilitator Node (Simulated)",
      description: "Live classroom telemetry stream for Pico WH IoT Workshop",
      latitude: "13.0827",
      longitude: "80.2707",
      field1: "Temperature (°C)",
      field2: "Humidity (%)",
      field3: "Light Level (Lux/Raw)",
      field4: "Soil Moisture (%)"
    },
    feeds: [
      {
        created_at: new Date().toISOString(),
        entry_id: entryCounter,
        field1: currentTemp,
        field2: currentHumidity,
        field3: currentLight,
        field4: currentSoil
      }
    ]
  };
}

// Allows facilitator to trigger manual alert spikes for live demo
export function triggerAlertSpike(type: "heat" | "dry" | "reset"): void {
  if (type === "heat") {
    baseTemp = 33.8; // Trigger > 30°C alert!
  } else if (type === "dry") {
    baseSoil = 18.5; // Trigger < 25% alert!
  } else {
    baseTemp = 26.5;
    baseSoil = 42.0;
  }
}
