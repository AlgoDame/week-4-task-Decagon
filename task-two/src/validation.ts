/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs';
import dns from 'dns';
import neatCsv from 'neat-csv';

function validateEmailAddresses(inputPath: string[], outputFile: string) {
  //console.log('Complete the implementation in src/validation.ts');

  for (const input of inputPath) {
    fs.readFile(input, async (err, data) => {
      //error handling
      if (err) {
        console.error(err);
        return;
      }
      const emails = await neatCsv(data);
      //emails
      // Extract emails into an array
      const emailsArray: string[] = [];
      for (const email of emails) {
        const currentEmail = email.Emails;
        emailsArray.push(currentEmail);
      }
      //console.log(emailsArray)
      // Getting the valid emails in an array
      const validEmails: string[] = [];
      const regex = /^[a-zA-Z]\S+@\S+\.\S+[a-z]$/;
      emailsArray.forEach((email) => {
        if (regex.test(email)) {
          validEmails.push(email);
        }
      });

      // Getting the domain of all valid emails
      const domainsArray: string[] = [];
      validEmails.forEach((email) => {
        const index: number = email.indexOf('@') + 1;
        const domain: string = email.slice(index);
        domainsArray.push(domain);
      });

      //let uniqueDomains: string[] = [...new Set(domainsArray)];
      //uniqueDomains

      // Check if domains has valid dnsMX and write the email to file
      const checkedDomains: string[] = [];
      validEmails.forEach((email) => {
        const index: number = email.indexOf('@') + 1;
        const domain: string = email.slice(index);
        if (!checkedDomains.includes(domain)) {
          dns.resolveMx(domain, (err, addresses) => {
            if (err) {
              console.error(err);
              return;
            }
            checkedDomains.push(domain);
            const correctEmail = `${email}\n\n`;
            fs.appendFile(outputFile, correctEmail, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
          });
        }
      });
    });
  }
}

export default validateEmailAddresses;
