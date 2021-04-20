/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
import neatCsv from "neat-csv";
import fs from "fs";
function analyseFiles(inputPaths: string[], outputPath: string) {
  //console.log('Complete the implementation in src/analysis.ts');
  for (let input of inputPaths) {
    fs.readFile(input, async (err, data) => {
      // error handling
      if (err) {
        console.error(err);
        return;
      }
      const emails = await neatCsv(data);
      //emails
      // Getting all emails into an array
      let emailsArray: string[] = [];
      for (let email of emails) {
        let currentEmail = email.Emails;
        emailsArray.push(currentEmail);
      }
      //console.log(emailsArray)
      // Validating the emails with a regex
      let validEmails: string[] = [];
      let regex: RegExp = /^[a-zA-Z]\S+@\S+\.\S+[a-z]$/;
      emailsArray.forEach((email) => {
        if (regex.test(email)) {
          validEmails.push(email);
        }
      })
      //console.log(validEmails)
      // Getting all domains
      let emailDomains: string[] = [];
      validEmails.forEach((email) => {
        let index: number = email.indexOf("@") + 1;
        let domainName: string = email.slice(index);
        emailDomains.push(domainName);
      })
      //console.log(emailDomains)
      // Getting only the unique domains in an array
      let uniqueDomains: string[] = [...new Set(emailDomains)];
      //console.log(uniqueDomains)
      // Getting count for each domain name
      let domainCount: Record<string, number> = {};
      emailDomains.forEach((domain) => {
        if (!domainCount[domain]) {
          domainCount[domain] = 1;
        } else {
          domainCount[domain]++;
        }
      })

      //console.log(domainCount)
      // Creating an interface Type to format my result
      interface Format{
        "valid-domains": string[];
        totalEmailsParsed: number;
        totalValidEmails: number;
        categories: Record<string, number>
      }
      // Creating my result using inteface Type
      let result: Format = {};
      result["valid-domains"] = uniqueDomains;
      result.totalEmailsParsed = emailsArray.length;
      result.totalValidEmails = validEmails.length;
      result.categories = domainCount;
      //console.log(result)
      let jsonResult: string = JSON.stringify(result, null, 2);
      //console.log(jsonResult)

      // Writing to a file
      fs.writeFile(outputPath, jsonResult, err => {
        if (err) {
          console.error(err);
          return;
        }
      })









    })
  }
}




export default analyseFiles;
