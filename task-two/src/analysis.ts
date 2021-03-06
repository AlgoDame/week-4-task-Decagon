/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
import neatCsv from 'neat-csv';
import fs from 'fs';
function analyseFiles(inputPaths: string[], outputPath: string) {
  for (const input of inputPaths) {
    fs.readFile(input, async (err, data) => {
      // error handling
      if (err) {
        console.error(err);
        return;
      }
      const emails = await neatCsv(data);

      // Getting all emails into an array
      const emailsArray: string[] = [];
      for (const email of emails) {
        const currentEmail = email.Emails;
        emailsArray.push(currentEmail);
      }

      // Validating the emails with a regex
      const validEmails: string[] = [];
      const regex = /^[a-zA-Z]\S+@\S+\.\S+[a-z]$/;
      emailsArray.forEach((email) => {
        if (regex.test(email)) {
          validEmails.push(email);
        }
      });

      // Getting all domains
      const emailDomains: string[] = [];
      validEmails.forEach((email) => {
        const index: number = email.indexOf('@') + 1;
        const domainName: string = email.slice(index);
        emailDomains.push(domainName);
      });

      // Getting only the unique domains in an array
      const uniqueDomains: string[] = [...new Set(emailDomains)];
      //console.log(uniqueDomains)
      // Getting count for each domain name
      const domainCount: Record<string, number> = {};
      emailDomains.forEach((domain) => {
        if (!domainCount[domain]) {
          domainCount[domain] = 1;
        } else {
          domainCount[domain]++;
        }
      });

      // Creating an interface Type to format my result
      // interface Format {
      //   'valid-domains': string[];
      //   totalEmailsParsed: number;
      //   totalValidEmails: number;
      //   categories: Record<string, number>;
      // }
      // Creating my result using inteface Type
      const result: Record<string, unknown> = {};
      result['valid-domains'] = uniqueDomains;
      result.totalEmailsParsed = emailsArray.length;
      result.totalValidEmails = validEmails.length;
      result.categories = domainCount;

      const jsonResult: string = JSON.stringify(result, null, 2);

      // Writing to a file
      fs.writeFile(outputPath, jsonResult, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  }
}

export default analyseFiles;
