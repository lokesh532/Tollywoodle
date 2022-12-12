import { NextApiHandler, NextApiRequest } from "next";
import path from "path";
import fs from "fs/promises";
const handler: NextApiHandler = async (req, res) => {
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images"));
      } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
      }
    const { pid } = req.query
    console.log(pid)
    res.json({ done: "ok" });
  };
  
  export default handler;