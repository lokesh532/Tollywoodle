import { NextApiHandler, NextApiRequest } from "next";
import formidable from 'formidable';
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  console.log('inside readFile')

  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path, form) => {
      return path.originalFilename+'';
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

// const downloadFile = (
//   req: NextApiRequest
// )=>{
//   return new Promise((resolve, reject) => {
//   client.get(url, (res) => {
//     if (res.statusCode === 200) {
//         res.pipe(fs.createWriteStream(path.join(process.cwd(), "/public/images")))
//             .on('error', reject)
//             .once('close', () => resolve(path.join(process.cwd(), "/public/images")));
//     } else {
//         // Consume response data to free up memory
//         res.resume();
//         reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

//     }
//   })
//  });
// }

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
//  await downloadFile(req);
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;