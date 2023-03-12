import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';

export const parseCsv = () => {
  const directoryPath = env.downloadsPath;

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const calculatedExpenses = files
      .filter(file => file.includes('_Expenses') && path.extname(file) === '.csv')
      .reduce((acc, file) => {
        const filePath = path.join(directoryPath, file);
        const headers = ['description', 'amount', 'category'];
        const csvStream = fs.createReadStream(filePath).pipe(csvParser({ headers }));

        csvStream
          .on('data', ({ description, amount, category }) => {
            if(description !== 'Description') {
              acc.concat({description, amount, category})
            }
          })
          .on('end', () => {
            console.error(`Finished parsing ${file}`)
          })
          .on('error', () => {
            console.error(err)
          });
      }, [])
    return calculatedExpenses;
  });
}

