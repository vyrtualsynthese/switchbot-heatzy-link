export type SwitchbotSalonConfig = {
  room: string;
  weekday: Schedule;
  weekend: Schedule;
};

type Schedule = {
  "00"?: number;
  "01"?: number;
  "02"?: number;
  "03"?: number;
  "04"?: number;
  "05"?: number;
  "06"?: number;
  "07"?: number;
  "08"?: number;
  "09"?: number;
  "10"?: number;
  "11"?: number;
  "12"?: number;
  "13"?: number;
  "14"?: number;
  "15"?: number;
  "16"?: number;
  "17"?: number;
  "18"?: number;
  "19"?: number;
  "20"?: number;
  "21"?: number;
  "22"?: number;
  "23"?: number;
};
