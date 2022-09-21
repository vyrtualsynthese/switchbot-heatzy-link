import axios from "axios";

export class Switchbot {
  switchbotUrl: string;
  switchbotDevice: string;
  // should check all env at startup
  switchbotKey?: string;

  constructor() {
    this.switchbotUrl = "https://api.switch-bot.com";
    this.switchbotDevice = "EC759E8DEF20";
    this.switchbotKey = process.env.SWITCHBOT_KEY;
  }
  async getSwitchbotDevices(): Promise<any[]> {
    if (!this.switchbotKey) {
      throw new Error("Switchbot Key is Undefined");
    }
    const res: any = await axios.get(
      `${this.switchbotUrl}/v1.0/devices`,
      {
        headers: {
          Authorization: this.switchbotKey,
        },
      }
    )
    return new Promise((resolve: any) => {
      resolve(res.data.body.deviceList);
    });
  }

  async getSwitchbotDeviceStatus(device: string): Promise<any> {
    if (!this.switchbotKey) {
      throw new Error("Switchbot Key is Undefined");
    }
    const res: any = await axios.get(
      `${this.switchbotUrl}/v1.0/devices/${device}/status`,
      {
        headers: {
          Authorization: this.switchbotKey,
        },
      }
    )
    return new Promise((resolve: any) => {
      resolve(res.data.body);
    });
  }
}
