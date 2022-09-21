import axios from "axios";

const heatzyURL = "https://euapi.gizwits.com";

export class Heatzy {
  heatzyURL: string;
  heatzyHeader: any;

  constructor() {
    this.heatzyURL = "https://euapi.gizwits.com";
    this.heatzyHeader = {};
  }

  async getPilote(heatzyDevice: string): Promise<any> {
    await this.refreshToken();
    const res = await axios.get(
      `${this.heatzyURL}/app/devdata/${heatzyDevice}/latest`,
      {
        headers: this.heatzyHeader,
      }
    )
    return new Promise((resolve: any) => {
      resolve(res.data);
    });
  }

  async switchDeviceVacancyMode(
    heatzyDevice: string,
    mode: boolean
  ): Promise<void> {
    await this.refreshToken();
    await axios.post(
      `${this.heatzyURL}/app/control/${heatzyDevice}`,
      {
        attrs: {
          timer_switch: mode ? 1 : 0,
        },
      },
      {
        headers: this.heatzyHeader,
      }
    );
    return new Promise((resolve: any) => {
      resolve();
    });
  }

  async switchDeviceHeatMode(
    heatzyDevice: string,
    mode: number
  ): Promise<void> {
    await this.refreshToken();
    await axios.post(
      `${this.heatzyURL}/app/control/${heatzyDevice}`,
      {
        attrs: {
          mode: mode,
        },
      },
      {
        headers: this.heatzyHeader,
      }
    );
    return new Promise((resolve: any) => {
      resolve();
    });
  }

  async getHeader(): Promise<any> {
    await this.refreshToken();
    return new Promise((resolve: any) => {
      resolve(this.heatzyHeader);
    });
  }

  async refreshToken(): Promise<any> {
    const res: any = await axios.post(
      `${heatzyURL}/app/login`,
      {
        username: process.env.HEATZY_USERNAME,
        password: process.env.HEATZY_PASSWORD,
      },
      {
        headers: {
          "X-Gizwits-Application-Id": "c70a66ff039d41b4a220e198b0fcc8b3",
        },
      }
    );
    this.heatzyHeader = {
      "X-Gizwits-Application-Id": "c70a66ff039d41b4a220e198b0fcc8b3",
      "X-Gizwits-User-token": res.data.token,
    };

    return new Promise((resolve: any) => {
      resolve("resolved");
    });
  }
}
