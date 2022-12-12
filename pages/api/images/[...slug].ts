import { NextApiHandler, NextApiRequest } from "next";
import formidable from 'formidable';
import path from "path";
import fs from "fs/promises";
import axios from "axios";


const uploadFile = (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
 // console.log('inside readFile')
  options.uploadDir = path.join(process.cwd(), "/public/images");
  options.filename = (name, ext, path, form) => {
    return path.originalFilename + '';
  };
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
  const { slug } = req.query  
  // const data = fs.readFile(`https://ik.imagekit.io/0hwmvu8lk/22/1.PNG?ik-sdk-version=javascript-1.4.3&updatedAt=1668715088863`);
  // fs.writeFile(`./public/uploads/22/1`, await data);
  if (slug) {
   // console.log(slug)
    var externalURL = `https://ik.imagekit.io/0hwmvu8lk/22/` + slug[1] + `.PNG?ik-sdk-version=javascript-1.4.3&updatedAt=1668715088863`;
    // var externalURL = req.query.external;   
   // console.log(externalURL)
    const { data: stream } = await axios.get(externalURL, {
      responseType: 'stream',
    })
    await fs.writeFile(path.join(process.cwd() + "/public", "/images/"+slug[1]+".PNG"), stream);
  }
  res.json({ done: "ok" });
};

export default handler;