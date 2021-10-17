import { config } from "dotenv";
import axios, { AxiosResponse } from "axios";
import moment from "moment-timezone";
import { SwitchbotSalonConfig } from "./SwitchbotSalonConfig.type";
config();
moment.tz.setDefault(process.env.TIMEZONE);

const heatzyDevice = "OkmPW3ZesMbgBkA9KHNOGc";
const heatzyURL = "https://euapi.gizwits.com"
let HeatzyHeader = {}
const switchbotUrl = 'https://api.switch-bot.com'
const switchbotDevice = 'EC759E8DEF20'

const switchbotKey = process.env.SWITCHBOT_KEY

const switchbotSalonConfig: SwitchbotSalonConfig = {
  "weekday": {
    "00": 17,
    "09": 21,
    "23": 21,
  },
  "weekend": {
    "00": 17,
    "08": 21,
    "23": 21,
  },
}

console.log(typeof switchbotSalonConfig)

function findBetweenTime () {
  const currentTime = moment()
  console.log(`Current Weekday ${currentTime.isoWeekday()}`)
  console.log(`Current Hour ${currentTime.hour()}`)
  let weekSelector: string
  if (currentTime.isoWeekday() <= 5) {
    weekSelector = "weekday"
  } else {
    weekSelector = "weekend"
  }
  let currentTemp
  console.log(`Selected weekday ${weekSelector}`);
    console.log(`Selected temps and time \n ${JSON.stringify(switchbotSalonConfig[weekSelector] ,null, ' ')}`);

    const times = Object.keys(switchbotSalonConfig[weekSelector])
    times.sort()
    times.forEach((time, index) => {
      if (Number(time) <= currentTime.hour()) {
        currentTemp = switchbotSalonConfig[weekSelector][time]
      }
    })
    return currentTemp

}

function main () {
  axios
    // POST: Get Heatzy API Token
    .post(
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
    )
    // GET: Get Heatzy Device infos
    .then(function(response: any) {
      console.log(response.data.token);

      HeatzyHeader = {
        "X-Gizwits-Application-Id": "c70a66ff039d41b4a220e198b0fcc8b3",
        "X-Gizwits-User-token": response.data.token,
      }

      return axios.get(
        `${heatzyURL}/app/devdata/${heatzyDevice}/latest`,
        {
          headers: HeatzyHeader,
        }
      );
    })
    .then(async function(response: any) {
      // If Heatzy Vacancy mode activated stop
      if (Number(response.data.attr.derog_mode) === 1) {
        throw new Error("vacancy mode activated");
      }
      // If Heatzy Planning mode activated disable it
      if (Number(response.data.attr.timer_switch) === 1) {
        console.log("heatzy disable planning mode");
        await axios
          // POST: Disable Planning Mode
          .post(
            `${heatzyURL}/app/control/${heatzyDevice}`,
            {
              attrs: {
                timer_switch: 0,
              },
            },
            {
              headers: HeatzyHeader,
            }
          );
      }
      if (!switchbotKey) {
        throw new Error('Switchbot Key is Undefined')
      }
      // Switch bot Get meter temperature
      return axios
        .get(
          `${switchbotUrl}/v1.0/devices/${switchbotDevice}/status`,
          {
            headers: {
              'Authorization': switchbotKey
            },
          })
    })
    // Look for configured temperature
    .then(function(response: AxiosResponse<any>) {
      const targetTemp = findBetweenTime()
      console.log(`Current Temperature ${response.data.body.temperature}`)
      console.log(`Target Temperature ${targetTemp}`)

      if (!targetTemp) {
        throw new Error("targetTemp undefined")
      }

      if (response.data.body.temperature >= targetTemp) {
        console.log(`Stop heater`)
        return axios
          .post(
            `${heatzyURL}/app/control/${heatzyDevice}`,
            {
              "attrs": {
                "mode": 3
              }
            },
            {
              headers: HeatzyHeader
            }
          )
      } else if (response.data.body.temperature < targetTemp) {
        console.log(`Start heater`)
        return axios
          .post(
            `${heatzyURL}/app/control/${heatzyDevice}`,
            {
              "attrs": {
                "mode": 0
              }
            },
            {
              headers: HeatzyHeader
            }
          )
      }
    }).then(function() {
    setTimeout(main, 100);
  })
    .catch(function(error: Error) {
      console.log(error);
      setTimeout(main, 100);
    });
}

main()
