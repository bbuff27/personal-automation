const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');

module.exports = function parseCsv() {
  const directoryPath = process.env.DOWNLOADS_PATH;

  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const results = [];
      const promises = files
        .filter(file => file.includes('_Expenses') && path.extname(file) === '.csv')
        .map(file => {
          const filePath = path.join(directoryPath, file);
          const headers = ['description', 'amount', 'category'];

          return new Promise((resolve, reject) => {
            fs.createReadStream(filePath).pipe(csvParser({ headers }))
              .on('data', ({ description, amount, category }) => {
                if(description !== 'Description') {
                  results.push({
                    description,
                    amount: amount.replace('$', ''),
                    category
                  })
                }
              })
              .on('error', (err) => {
                console.error(err)
                reject(err);
              })
              .on('end', () => {
                resolve();
              });
          })
        });

      Promise.all(promises).then(() => {
        resolve(results);
      }).catch((err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}
