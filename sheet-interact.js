const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { client_email, private_key } = require('./config.json');

let global_doc = null;
let global_sheet_forces = null;
let global_sheet_summary = null;

async function init() {
    
    const serviceAccountAuth = new JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet("1BllJIUvA_228RwY2ElphbXdNs1CAKrrXDFRACZekG-0", serviceAccountAuth);
    
    await doc.loadInfo();

    global_doc = doc;
    global_sheet_forces = doc.sheetsByTitle['Forces'];
    global_sheet_summary = doc.sheetsByTitle['Summary'];
    console.log("Init finished");
}

async function getForces() {
    const sheet = global_sheet_forces;
    await sheet.loadCells('A4:J17');
    let forces = [];
    for(let row = 3; row < 16; ++row) { //0 indexed
        let name = sheet.getCell(row,0).formattedValue;
        let type = sheet.getCell(row,1).formattedValue;

        let fight = sheet.getCell(row, 6).formattedValue;
        let move = sheet.getCell(row, 7).formattedValue;
        let watch = sheet.getCell(row, 8).formattedValue;
        let channel = sheet.getCell(row, 9).formattedValue;

        if (name !== null) {
            forces.push({
                "name":name,
                "type":type, 
                "idx":row, 
                "fight":+fight, 
                "move":+move,
                "watch":+watch,
                "channel":+channel
            });
        }
    }

    return forces
}

async function getForceNames() {
    const sheet = global_sheet_forces;
    await sheet.loadCells('A4:A17');
    let forces = [];
    for(let row = 3; row < 16; ++row) { //0 indexed
        let name = sheet.getCell(row,0).formattedValue;
        if (name !== null) {
            forces.push({"name":name});
        }
    }
    return forces
}

async function getResourceNames() {
    const sheet = global_sheet_summary;
    await sheet.loadCells('B2:2');
    let amount = sheet.cellStats.loaded;
    let resources = [];
    for(let i = 0; i < amount; ++i) {
        let cell = sheet.getCell(1,i+1);
        resources.push(cell.formattedValue);
    }

    return resources
}

module.exports = {
    init: init,
    getForces: getForces,
    getForceNames: getForceNames,
    getResourceNames: getResourceNames
}
