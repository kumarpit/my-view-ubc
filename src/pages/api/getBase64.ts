import { NextApiRequest, NextApiResponse } from "next";
import { getPlaiceholder } from "plaiceholder";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { url } = JSON.parse(body);

  const { base64 } = await getPlaiceholder(url);

  res.status(200).json(base64);
};