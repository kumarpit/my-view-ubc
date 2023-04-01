import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react";
import { Nullable } from "./types";

export default function Home() {
  const [residence, setResidence] = useState<Nullable<string>>(null);
  const [building, setBuilding] = useState<Nullable<string>>(null);
  const [unit, setUnit] = useState<Nullable<string>>(null);
  const [description, setDescription] = useState<Nullable<string>>(null);
  const [image, setImage] = useState<Nullable<File>>(null);
  const [createObjectURL, setCreateObjectURL] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const uploadToClient = (event: React.FormEvent<HTMLInputElement>) => {
    let target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const i = target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event: React.MouseEvent) => {
    try {
      event.preventDefault();
      if (!image) throw new Error("Need an image");
      const filename = encodeURIComponent(image.name)
      const fileType = encodeURIComponent(image.type)

      setStatus("Uploading...")

      // update mongodb
      const formDataDb = new FormData();
      if (residence) formDataDb.append("residence", residence);
      if (building) formDataDb.append("building", building);
      if (unit) formDataDb.append("unit", unit);
      if (description) formDataDb.append("description", description);

      formDataDb.append("filename", image.name);
      formDataDb.append("filetype", image.type);

      const uploadMongo = await fetch(`/api/upload-db`, {
        method: 'POST',
        body: formDataDb
      })

      if (!uploadMongo.ok) throw new Error("Error updating MonogoDB");

      // upload to s3
      const res = await fetch(
        `/api/upload-url?file=${filename}&fileType=${fileType}`
      )
      const { url, fields } = await res.json()
      const formDataS3 = new FormData()

      Object.entries({ ...(fields as { [key: string]: string }), file: (image as File) }).forEach(([key, value]) => {
        formDataS3.append(key, value)
      })

      // upload to s3
      const uploadS3 = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': image.type
        },
        body: formDataS3
      })

      if (!uploadS3.ok) throw new Error("Error uploading file to S3");

      setStatus("Uploaded!")
    } catch (err) {
      setStatus((err as any).message)
    }
  };

  return (
    <div>
      <Head>
        <title>MyViewUbc</title>
        <meta name="description" content="My View UBC" />
      </Head>

      <main>
        <h1><Link href="/explore">Explore</Link></h1>
        <h1>Upload your view</h1>
        <form action="" id="form">
          <label htmlFor="residences">Your Residence:</label>
          <select id="residences" name="residences" onChange={(e) => setResidence(e.target.value)}>
            <option value="walter gage">Walter Gage</option>
          </select>
          <input 
            name="buildingnumber" 
            type="text" placeholder="building" 
            onChange={e => setBuilding(e.target.value)} 
          />
          <input 
            name="unitnumber" 
            type="text" 
            placeholder="unit number or any other identifier (eg. west facing)" 
            onChange={e => setUnit(e.target.value)} 
          />
          <input 
            name="description" 
            type="text" 
            placeholder="description" 
            onChange={e => setDescription(e.target.value)} 
          />
          <input 
            name="file" 
            type="file" 
            accept="image/*" 
            onChange={uploadToClient} 
          />
        </form>
        <button type="submit" form="form" onClick={uploadToServer}>Submit</button>
        <Image src={createObjectURL} alt="preview of uploaded image" width={500} height={500} />
        <h2>{status}</h2>
      </main>

      <footer>
        <p>Contribute</p>
      </footer>
    </div>
  )
}
