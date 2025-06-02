const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { client_email, private_key } = require('./config.json');

let global_doc = null;
let global_sheet_forces = null;
let global_sheet_summary = null;
let global_sheet_growth = null;
let global_sheet_costs = null;

module.exports = {
    init: async function() {
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
        global_sheet_growth = doc.sheetsByTitle['Growth'];
        global_sheet_costs = doc.sheetsByTitle['Costs'];
        console.log("Init finished");
    },
    getForces: async function() {
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
    },
    getForceNames: async function() {
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
    },
    getResourceNames: async function() {
        const sheet = global_sheet_summary;
        await sheet.loadCells('B2:2');
        let resources = [];
        for(let i = 1; i < sheet.columnCount; ++i) {
            let cell = sheet.getCell(1,i);
            resources.push(cell.formattedValue);
        }
        return resources
    },
    getCurrentStores: async function() {
        const sheet = global_sheet_growth;
        await sheet.loadCells('B5:5');
        let names = await module.exports.getResourceNames();
        let stores = {};
        for(let i = 1; i < sheet.columnCount; ++i) {
            let cell = sheet.getCell(4,i);
            console.log(cell);
            stores[names[i-1]] = cell.formattedValue;
        }
        return stores;
    },
    getCurrentStoresNumeric: async function() {
        const sheet = global_sheet_growth;
        await sheet.loadCells('B5:5');
        let names = await module.exports.getResourceNames();
        let stores = {};
        stores[names[0]] = +sheet.getCell(4,1).formattedValue.slice(1);
        for(let i = 2; i < sheet.columnCount; ++i) {
            let cell = sheet.getCell(4,i);
            stores[names[i-1]] = +cell.formattedValue;
        }
        return stores;
    },
    getBuildingCosts: async function() {

    }
}
