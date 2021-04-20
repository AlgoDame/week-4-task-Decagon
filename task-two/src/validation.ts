/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from "fs";
import dns from "dns";
import neatCsv from "neat-csv";



function validateEmailAddresses(inputPath: string[], outputFile: string) {
  //console.log('Complete the implementation in src/validation.ts');

  for (let input of inputPath) {
    fs.readFile(input, async (err, data) => {
      //error handling
      if (err) {
        console.error(err);
        return
      }
      const emails = await neatCsv(data);
      //emails
      // Extract emails into an array
      let emailsArray: string[] = [];
      for (let email of emails) {
        let currentEmail = email.Emails;
        emailsArray.push(currentEmail);
      }
      //console.log(emailsArray)
      // Getting the valid emails in an array
      let validEmails: string[] = [];
      let regex: RegExp = /^[a-zA-Z]\S+@\S+\.\S+[a-z]$/;
      emailsArray.forEach((email) => {
        if (regex.test(email)) {
          validEmails.push(email);
        }
      })

      // Getting the domain of all valid emails
      let domainsArray: string[] = [];
      validEmails.forEach((email) => {
        let index: number = email.indexOf("@") + 1;
        let domain: string = email.slice(index);
        domainsArray.push(domain);
      })

      //let uniqueDomains: string[] = [...new Set(domainsArray)];
      //uniqueDomains

      // Check if domains has valid dnsMX and write the email to file
      let checkedDomains: string[] = [];
      validEmails.forEach((email) => {
        let index: number = email.indexOf("@") + 1;
        let domain: string = email.slice(index);
        if (!checkedDomains.includes(domain)) {
          dns.resolveMx(domain, (err, addresses) => {
            if (err) {
              console.error(err);
              return;
            }
            checkedDomains.push(domain);
            let correctEmail: string = `${email}\n\n`;
            fs.appendFile(outputFile, correctEmail, (err) => {
              if (err) {
                console.error(err);
                return;
              }

            })


          })
        }
      })
    })
  }
}


export default validateEmailAddresses;
