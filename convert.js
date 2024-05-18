const fs = require('fs');
const path = require('path');

// Function to read JSON data from a file and convert it to a CSV format string
function jsonToCsvString(jsonData) {
    const csvData = [];

    for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            const amountHex = jsonData[key].amount;
            const amountDecimal = parseInt(amountHex, 16) / 1e18;
            csvData.push(`${key},${amountDecimal}`);
        }
    }

    return csvData.join('\n');
}

// Function to read a JSON file and convert its content to CSV format
function processJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading the JSON file: ${filePath} - ${err}`);
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                const csvString = jsonToCsvString(jsonData);
                resolve(csvString);
            } catch (err) {
                reject(`Error processing the JSON data: ${filePath} - ${err}`);
            }
        });
    });
}

// Function to read all JSON files in a folder, process them, and combine the results into a single CSV
function processJsonFolder(folderPath, outputCsvFilePath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error reading the folder: ${folderPath} - ${err}`);
            return;
        }

        const jsonFiles = files.filter(file => path.extname(file) === '.json');
        const csvPromises = jsonFiles.map(file => processJsonFile(path.join(folderPath, file)));

        Promise.all(csvPromises)
            .then(csvStrings => {
                const combinedCsv = csvStrings.join('\n');
                fs.writeFile(outputCsvFilePath, combinedCsv, 'utf8', (err) => {
                    if (err) {
                        console.error(`Error writing the CSV file: ${outputCsvFilePath} - ${err}`);
                    } else {
                        console.log('Combined CSV file has been saved.');
                    }
                });
            })
            .catch(error => console.error(`Error processing JSON files: ${error}`));
    });
}

// Usage example
const folderPath = 'path/to/your/json/folder'; // Replace with the path to your folder containing JSON files
const outputCsvFilePath = 'combined_output.csv'; // Replace with the desired output CSV file path
processJsonFolder(folderPath, outputCsvFilePath);
