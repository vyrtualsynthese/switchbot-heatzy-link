import { config } from "dotenv";
config();

import moment from "moment-timezone";
import * as _ from "lodash";
import { Heatzy } from "./heatzy/Heatzy";
import { SwitchbotSalonConfig } from "./SwitchbotSalonConfig.type";
import { Switchbot } from "./switchbot/Switchbot";
moment.tz.setDefault(process.env.TIMEZONE);

const heatzyDevice = "OkmPW3ZesMbgBkA9KHNOGc";

const switchbotSalonConfig: SwitchbotSalonConfig[] = [
  {
    room: "salon",
    weekday: {
      "00": 17,
      "09": 21,
      "23": 21,
    },
    weekend: {
      "00": 17,
      "08": 21,
      "23": 21,
    },
  },
  {
    room: "cuisine",
    weekday: {
      "00": 17,
      "09": 21,
      "23": 21,
    },
    weekend: {
      "00": 17,
      "08": 21,
      "23": 21,
    },
  },
  {
    room: "salle de bain",
    weekday: {
      "00": 17,
      "09": 21,
      "23": 21,
    },
    weekend: {
      "00": 17,
      "08": 21,
      "23": 21,
    },
  },
  {
    room: "chambre",
    weekday: {
      "00": 17,
      "09": 21,
      "23": 21,
    },
    weekend: {
      "00": 17,
      "08": 21,
      "23": 21,
    },
  },
];

function findBetweenTime() {
  const currentTime = moment();
  console.log(`Current Weekday ${currentTime.isoWeekday()}`);
  console.log(`Current Hour ${currentTime.hour()}`);
  let weekSelector: string;
  if (currentTime.isoWeekday() <= 5) {
    weekSelector = "weekday";
  } else {
    weekSelector = "weekend";
  }
  let currentTemp;
  console.log(`Selected weekday ${weekSelector}`);

  const selectedRoom = _.find(switchbotSalonConfig, { room: "salon" });

  const selectedRoomConfig = _.get(selectedRoom, weekSelector);

  console.log(
    `Selected temps and time \n ${JSON.stringify(
      selectedRoomConfig,
      null,
      " "
    )}`
  );

  const times = Object.keys(selectedRoomConfig);
  times.sort();
  times.forEach((time) => {
    if (Number(time) <= currentTime.hour()) {
      currentTemp = _.get(selectedRoomConfig, time);
    }
  });

  return currentTemp;
}

function main() {
  const heatzy = new Heatzy();
  const switchbot = new Switchbot()

  heatzy
    // get all available pilotes
    // Refacto: New function getAllPilotes return object with all info
    .getPilote(heatzyDevice)
    .then(async function (response: any) {
      // If Heatzy Vacancy mode activated stop
      // Refacto: itterate over each pilotes to check if vacancy mode activated then remove it from object
      if (Number(response.attr.derog_mode) === 1) {
        throw new Error("vacancy mode activated");
      }
      // If Heatzy Planning mode activated disable it
      // Refacto: Itterate over each left Pilotes to check if planning mode need disable
      if (Number(response.attr.timer_switch) === 1) {
        await heatzy.switchDeviceVacancyMode(heatzyDevice, false);
      }

      // Switch bot Get meter temperature
      // Refacto: Get all devices status
      return switchbot.getSwitchbotDeviceStatus("EC759E8DEF20");
    })
    // Look for configured temperature
    .then(async function (response: any) {
      const targetTemp = findBetweenTime();
      console.log(`Current Temperature ${response.temperature}`);
      console.log(`Target Temperature ${targetTemp}`);

      if (!targetTemp) {
        throw new Error("targetTemp undefined");
      }

      if (response.temperature >= targetTemp) {
        console.log(`Stop heater`);
        return heatzy.switchDeviceHeatMode(heatzyDevice, 3);
      } else if (response.temperature < targetTemp) {
        console.log(`Start heater`);
        return await heatzy.switchDeviceHeatMode(heatzyDevice, 0);
      }
    })
    .then(function () {
      setTimeout(main, 600000);
    })
    .catch(function (error: Error) {
      console.log(error);
      setTimeout(main, 600000);
    });
}

main();

// const test = users.map(x => {
//   return {"test": x.user}
// });
//
// console.log(test)
// > Array [Object { test: "barney" }, Object { test: "fred" }]
