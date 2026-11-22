/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wokwi-led': any;
      'wokwi-resistor': any;
      'wokwi-pushbutton': any;
      'wokwi-ssd1306': any;
      'wokwi-buzzer': any;
      'wokwi-dht22': any;
      'wokwi-potentiometer': any;
      'wokwi-neopixel': any;
    }
  }

  namespace React.JSX {
    interface IntrinsicElements {
      'wokwi-led': any;
      'wokwi-resistor': any;
      'wokwi-pushbutton': any;
      'wokwi-ssd1306': any;
      'wokwi-buzzer': any;
      'wokwi-dht22': any;
      'wokwi-potentiometer': any;
      'wokwi-neopixel': any;
    }
  }
}
