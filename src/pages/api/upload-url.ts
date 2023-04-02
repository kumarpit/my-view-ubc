import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // TODO
  res.status(200).json({})
}