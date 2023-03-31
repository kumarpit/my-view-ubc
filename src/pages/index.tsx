import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react";
import { Nullable } from "./types";

export default function Home() {
  const [image, setImage] = useState<Nullable<File>>(null);
  const [createObjectURL, setCreateObjectURL] = useState<string>("");

  const uploadToClient = (event: React.FormEvent<HTMLInputElement>) => {
    let target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const i = target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event: React.MouseEvent) => {
    event.preventDefault();
    const filename = encodeURIComponent((image as File).name)
    const fileType = encodeURIComponent((image as File).type)

    const res = await fetch(
      `/api/upload-url?file=${filename}&fileType=${fileType}`
    )
    const { url, fields } = await res.json()
    const formData = new FormData()

    Object.entries({ ...fields, image }).forEach(([key, value]) => {
      formData.append(key, value as string)
    })

    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (upload.ok) {
      console.log('Uploaded successfully!')
    } else {
      console.error('Upload failed.')
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
          <select id="residences" name="residences">
            <option value="walter gage">Walter Gage</option>
          </select>
          <input name="buildingnumber" type="text" placeholder="building" />
          <input name="unitnumber" type="text" placeholder="unit number" />
          <input name="file" type="file" accept="image/*" onChange={uploadToClient} />
        </form>
        <button type="submit" form="form" onClick={uploadToServer}>Submit</button>
        <Image src={createObjectURL} alt="preview of uploaded image" width={500} height={500} />
      </main>

      <footer>
        <p>Contribute</p>
      </footer>
    </div>
  )
}
