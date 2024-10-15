const fs = require('fs');
const path = require('path');

// Funzione per caricare il file JSON
function loadJSONFile(filePath) {
  const fullPath = path.resolve(filePath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(data);
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
          //delete jsonData['virtual:assets']['RGD']['href']['#'+targetKey]
	}
    }
  })
  
}

// Percorso del file JSON
const jsonFilePath = './sentinel-2/2024/06/stac_FR.json';

// Carica il file JSON
let jsonData = loadJSONFile(jsonFilePath);

// Array delle chiavi da rimuovere
const keysToRemove = ['VV', 'VH'];

// Condizione: rimuovi 'targetKey' se 'conditionKey' è uguale a 'someValue'
removeKeyIfCondition(jsonData, keysToRemove, 'href', '');

// Scrive di nuovo il file JSON aggiornato
writeJSONFile(jsonFilePath, jsonData);

console.log('Chiave rimossa (se la condizione era soddisfatta) e file aggiornato.');

