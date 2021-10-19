import { config } from "dotenv";
import axios, { AxiosResponse } from "axios";
import moment from "moment-timezone";
import * as _ from "lodash";
import {Heatzy} from "./heatzy/Heatzy";
import { SwitchbotSalonConfig } from "./SwitchbotSalonConfig.type";
config();
moment.tz.setDefault(process.env.TIMEZONE);

const switchbotUrl = 'https://api.switch-bot.com'
const switchbotDevice = 'EC759E8DEF20'

const switchbotKey = process.env.SWITCHBOT_KEY

const switchbotSalonConfig: SwitchbotSalonConfig[] = [
  {
    "room": "salon",
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
  },
  {
    "room": "cuisine",
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
  },
  {
    "room": "salle de bain",
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
  },
  {
    "room": "chambre",
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
  ]

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

  const selectedRoom = _.find(switchbotSalonConfig, {"room": "salon"})

  const selectedRoomConfig = _.get(selectedRoom, weekSelector)

  console.log(`Selected temps and time \n ${JSON.stringify(selectedRoomConfig ,null, ' ')}`);

    const times = Object.keys(selectedRoomConfig)
    times.sort()
    times.forEach((time, index) => {
      if (Number(time) <= currentTime.hour()) {
        currentTemp = _.get(selectedRoomConfig, time)
      }
    })

    return currentTemp

}

const heatzyURL = "https://euapi.gizwits.com"
const heatzyDevice = "OkmPW3ZesMbgBkA9KHNOGc";

const heatzy = new Heatzy()

function main () {
    heatzy.getDevice()
      .then(async function(response: any) {
      // If Heatzy Vacancy mode activated stop
      if (Number(response.data.attr.derog_mode) === 1) {
        throw new Error("vacancy mode activated");
      }
      // If Heatzy Planning mode activated disable it
      if (Number(response.data.attr.timer_switch) === 1) {
        await heatzy.switchDeviceVacancyMode(false)
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
    .then(async function(response: AxiosResponse<any>) {
      const targetTemp = findBetweenTime()
      console.log(`Current Temperature ${response.data.body.temperature}`)
      console.log(`Target Temperature ${targetTemp}`)

      if (!targetTemp) {
        throw new Error("targetTemp undefined")
      }

      if (response.data.body.temperature >= targetTemp) {
        console.log(`Stop heater`)
        return heatzy.switchDeviceHeatMode(3)
      } else if (response.data.body.temperature < targetTemp) {
        console.log(`Start heater`)
        return await heatzy.switchDeviceHeatMode(0)
      }
    }).then(function() {
    setTimeout(main, 600000);
  })
    .catch(function(error: Error) {
      console.log(error);
      setTimeout(main, 600000);
    });
}

main()
