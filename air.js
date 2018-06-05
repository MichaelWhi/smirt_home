const miio = require('miio');
const Rx = require('rxjs/Rx');

// CONFIG START
const PURIFIER_IP = "192.168.178.43"; // IP to your purifier. run `miio discover` to discover device.
const THRESHOLD = 100; // PM 2.5 threshold. see https://www.health.ny.gov/environmental/indoors/air/pmq_a.htm
// CONFIG END

const listenForPm25 = (device) => {
    return Rx.Observable.fromEvent(device, 'pm2.5Changed');
};

const turnUp = async (device) => {
    if((await device.mode()) !== "favorite") {
        console.log("Setting user mode");
        return device.setMode("favorite");
    }
};

const turnDown = async (device) => {
    if((await device.mode()) !== "auto") {
        console.log("Setting auto mode");
        return device.setMode("auto");
    }
};

exports.managePollution = async function() {
    const device = await miio.device({ address: PURIFIER_IP });
    console.log("connected to", device);
    const pm25$ = listenForPm25(device);
    pm25$.subscribe(pval => {
        if(pval[0] > THRESHOLD) {
            turnUp(device);
        } else {
            turnDown(device)
        }
    });
    pm25$.subscribe(pval => {
        console.log((new Date()).toString(), "PM2.5:", pval[0]);
    })
};

