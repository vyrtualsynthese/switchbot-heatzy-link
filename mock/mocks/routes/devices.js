// Use this file only as a guide for first steps using routes. Delete it when you have added your own route files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/usage/routes
const crypto = require('crypto');
// users data
const DEVICES = [
  {
    "id": "crypto.randomUUID()",
    "zone": "salon",
    "heaterName": "sdb",
    "captorName": "salon",
    "active": true,
    "status": "hg",
    "temp": -25,
    "targetTemp": 39,
    "targetStatus": "eco"
  }
];

const ALL_DEVICES = [
  ...DEVICES,
  {
    "id": crypto.randomUUID(),
    "zone": "salon",
    "heaterName": "sdb",
    "captorName": "salon",
    "active": true,
    "status": "hg",
    "temp": -25,
    "targetTemp": 39,
    "targetStatus": "eco"
  },
  {
    "id": crypto.randomUUID(),
    "zone": "salon",
    "heaterName": "salon",
    "captorName": "sdb",
    "active": false,
    "status": "confort",
    "temp": 27,
    "targetTemp": 34,
    "targetStatus": "hg"
  },
  {
    "id": crypto.randomUUID(),
    "zone": "cuisine",
    "heaterName": "sdb",
    "captorName": "sdb",
    "active": false,
    "status": "confort",
    "temp": 31,
    "targetTemp": 43,
    "targetStatus": "hg"
  },
  {
    "id": crypto.randomUUID(),
    "zone": "cuisine",
    "heaterName": "cuisine",
    "captorName": "salon",
    "active": true,
    "status": "eco",
    "temp": 11,
    "targetTemp": 29,
    "targetStatus": "confort"
  },
  {
    "id": crypto.randomUUID(),
    "zone": "sdb",
    "heaterName": "cuisine",
    "captorName": "cuisine",
    "active": true,
    "status": "hg",
    "temp": -38,
    "targetTemp": 25,
    "targetStatus": "confort"
  },
];

module.exports = [
  {
    id: "get-devices", // route id
    url: "/api/get-all", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "all", // variant id
        type: "json", // variant handler id
        options: {
          status: 200, // status to send
          body: ALL_DEVICES, // body to send
        },
      },
    ],
  },
];
