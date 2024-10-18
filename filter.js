const fs = require('fs');
const path = require('path');
const http=require('http')
const axios = require('axios');

// Configure the HTTP agent to reuse the socket
const agent = new http.Agent({
  keepAlive: true, // Keep the connection alive for reuse
  maxSockets: 1,   // Limit to one socket if you want to reuse the same socket
  maxFreeSockets: 1,
});

// Axios instance with the custom HTTP agent
const axiosInstance = axios.create({
  httpAgent: agent
});


// Funzione per caricare il file JSON
function loadJSONFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.log('File non valido')
    return undefined
  }

}

// Funzione per scrivere il file JSON
function writeJSONFile(filePath, data) {
  const fullPath = path.resolve(filePath);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Funzione per rimuovere una chiave se soddisfa una condizione
function removeKeyIfCondition(jsonData, keysToRemove, conditionKey, conditionValue) {
  keysToRemove.forEach((targetKey) => {
    if (jsonData['assets'].hasOwnProperty(targetKey)) {
      if (jsonData['assets'][targetKey][conditionKey] === conditionValue) {
        delete jsonData['assets'][targetKey];
        let array = jsonData['virtual:assets']['RGB']['href'].filter((href) => href !== '#' + targetKey)
        jsonData['virtual:assets']['RGB']['href'] = array
      } else {
        jsonData['virtual:assets']['RGB']['href'].push('#' + targetKey)
      }
    }
  })

}


//const jsonFilePath = './sentinel-2/2024/06/stac_EL.json';
//let jsonData = loadJSONFile(jsonFilePath);
//const keysToRemove = ['B02', 'B03', 'B04', 'B08', 'B11', 'B12', 'B8A', 'VV', 'VH'];
//removeKeyIfCondition(jsonData, keysToRemove, 'href', '');
//writeJSONFile(jsonFilePath, jsonData);


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const folderPath = './sentinel-2/2024/'
function processAllFilesInFolderRecursively() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Errore durante la lettura della cartella:', err);
      return;
    }
    files.forEach((folder) => {
      let _jsonFilePath = folderPath + folder
      console.log(_jsonFilePath)
      fs.readdir(_jsonFilePath, (err, files) => {
        if (err) {
          console.error('Errore durante la lettura della cartella:', err);
          return;
        }
        files.forEach(async (file, index) => {
          jsonFilePath = _jsonFilePath + '/' + file;
          //let jsonData = loadJSONFile(jsonFilePath);
          //if (jsonData) {
          /*let keysToRemove = ['B02', 'B03', 'B04', 'B08', 'B11', 'B12', 'B8A', 'VV', 'VH'];
          jsonData['virtual:assets']['RGB']['href']=[]
          removeKeyIfCondition(jsonData, keysToRemove, 'href', '');
          writeJSONFile(jsonFilePath, jsonData);*/

          /*if (jsonData['id'].split('_')[5]) {
            let STARTDATE = jsonData['id'].split('_')[5].substr(0, 4) + '-' + jsonData['id'].split('_')[5].substr(4, 2) + '-' + jsonData['id'].split('_')[5].substr(6, 2) + "T00:00:00+00:00"
            let DATETIME = jsonData['id'].split('_')[5].substr(0, 4) + '-' + jsonData['id'].split('_')[5].substr(4, 2) + '-' + jsonData['id'].split('_')[5].substr(6, 2) + "T00:00:00Z"
            let ENDDATE = jsonData['id'].split('_')[6].substr(0, 4) + '-' + jsonData['id'].split('_')[6].substr(4, 2) + '-' + jsonData['id'].split('_')[6].substr(6, 2) + "T00:00:00+00:00"

            jsonData['properties']['datetime'] = DATETIME
            jsonData['properties']['start_datetime'] = STARTDATE
            jsonData['properties']['end_datetime'] = ENDDATE
            writeJSONFile(jsonFilePath, jsonData);
          }*/
          //}


        let url='http://51.91.136.207:8000/stac/info?url=https://nupsi.alia-space.com:3943/stacserver/catalogs/sentinel-2/2024/' + folder + '/' + file
        try {
          const response = await axiosInstance.get(url);
          console.log('OK: ', url );
        } catch (error) {
          console.error('KO: ', url);
        }
        //await delay(5000);   

        });
      });
    });
  });
}

processAllFilesInFolderRecursively()