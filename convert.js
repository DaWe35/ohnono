const fs = require('fs');

function jsonToCsv(jsonFilePath, csvFilePath) {
    // Read the JSON file
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return;
        }

        try {
            // Parse the JSON data
            const jsonData = JSON.parse(data);
            
            // Initialize CSV data array
            const csvData = [];

            // Iterate over each key in the JSON data
            for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    // Convert the amount from hex to decimal and divide by 1e18
                    const amountHex = jsonData[key].amount;
                    const amountDecimal = parseInt(amountHex, 16) / 1e18;

                    // Format the data and add to csvData array
                    csvData.push(`${key},${amountDecimal}`);
                }
            }

            // Join the CSV data array with newlines
            const csvString = csvData.join('\n');

            // Write the CSV string to the output file
            fs.writeFile(csvFilePath, csvString, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the CSV file:', err);
                } else {
                    console.log('CSV file has been saved.');
                }
            });
        } catch (err) {
            console.error('Error processing the JSON data:', err);
        }
    });
}

// Usage example
const jsonFilePath = '00.json';
const csvFilePath = '00.csv';
jsonToCsv(jsonFilePath, csvFilePath);
