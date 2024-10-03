import csv from "csv-parser";
import fs from "fs";

function mapHeaders(args: {header: string, index: number}) {
    return args.header.toLowerCase().trim();
}


function mapValues(args: {header: string, index: number, value: string}) {
    args.value = args.value.replace(" ", "");
    args.value = args.value.trim().toLowerCase();
    console.log("value: ", args.value);
    return args.value;
}

// async function removeSpaceOfText() {
//     const file = await fs.promises.readFile("./PERSONAL INFORMATION - Sheet1.csv", "utf-8");
//     const parsedFile = file.replace(" ", "1");
//     // console.log("parsed", parsedFile)
//     await fs.promises.writeFile("./test.csv", parsedFile);
// }

// removeSpaceOfText();
const results = [];
const readStream = fs.createReadStream("./PERSONAL INFORMATION - Sheet1.csv", "utf-8");
readStream.pipe(csv({mapHeaders, mapValues}))
    .on("data", (chunk) => {
        results.push(chunk);
    })
    .on("end", () => {
        for (let i = 0; i < results.length; ++i) {
            console.log(results[i]);
        }
    })





