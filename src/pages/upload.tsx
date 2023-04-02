import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react";
import { Nullable } from "../../lib/types";
import short from 'short-uuid';

const translator = short();

export default function Upload() {
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
      if (!image) throw new Error("Please upload an image");
      const _filename = `${translator.new()}-${image.name}` 
      const filename = encodeURIComponent(_filename)
      const fileType = encodeURIComponent(image.type)

      setStatus("Uploading...")

      // validate form
      const formDataDb = new FormData();
      if (!residence && !building) throw new Error("Residence and Building are required fields")
      formDataDb.append("residence", residence!);
      formDataDb.append("building", building!);
      if (unit) formDataDb.append("unit", unit);
      if (description) formDataDb.append("description", description);
      formDataDb.append("filename", _filename);
      formDataDb.append("filetype", image.type);

      // upload to s3
      const res = await fetch(
        `/api/upload-url?file=${filename}&fileType=${fileType}`
      )
      const { url, fields } = await res.json()
      const formDataS3 = new FormData()

      Object.entries({ ...(fields as { [key: string]: string }), file: (image as File) }).forEach(([key, value]) => {
        formDataS3.append(key, value)
      })

      const uploadS3 = await fetch(url, {
        method: 'POST',
        body: formDataS3
      })

      if (!uploadS3.ok) throw new Error("Error uploading file to S3");

      // update mongodb
      const uploadMongo = await fetch(`/api/upload-db`, {
        method: 'POST',
        body: formDataDb
      })

      if (!uploadMongo.ok) throw new Error("Error updating MonogoDB");

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

      <div>
        {/* <h1><Link href="/explore">Explore</Link></h1> */}
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
              <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">MyViewUBC</h1>
              <form action="#">
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="sm:col-span-2">
                          <label htmlFor="residence" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Residence</label>
                          <select id="residence" defaultValue="SR" onChange={ e => setResidence(e.target.selectedOptions[0].innerHTML)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                              <option disabled value="SR">Select residence</option>
                              <option value="WG">Walter Gage</option>
                              <option value="CP">tə šxʷhəleləm̓s tə k̓ʷaƛ̓kʷəʔaʔɬ</option>
                              <option value="EX">Exchange</option>
                              <option value="BC">Brock Commons</option>
                              <option value="IH">Iona House</option>
                              <option value="PV">Place Vanier</option>
                              <option value="TP">Totem Park</option>
                              <option value="RH">Ritsumeikan-UBC House</option>
                              <option value="FC">Fairview Crescent</option>
                              <option value="MD">Marine Drive</option>
                              <option value="FH">Fraser Hall</option>
                              <option value="PC">Ponderosa Commons</option>
                              <option value="TH">Thunderbird</option>
                              <option value="AP">Acadia Park</option>
                          </select>
                      </div>
                      <div className="w-full">
                          <label htmlFor="building" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Building</label>

                          <input type="text" name="building" id="building" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Building#" required={true} onChange={e => setBuilding(e.target.value)} />
                      </div>
                      <div className="w-full">
                          <label htmlFor="unit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unit</label>
                          <input type="text" name="unit" id="unit" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Unit# or any identifier (eg. west facing)" required={true} onChange={(e) => setUnit(e.target.value)} />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload your view</label>
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 12MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept="image/*" 
                            onChange={uploadToClient}  />
                          </label>
                        </div> 
                      </div>
                      <div className=" w-full">
                          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                          <textarea id="description" rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Any comments..." onChange={e => setDescription(e.target.value)}></textarea>
                      </div>
                      <div>
                        {image && <Image src={createObjectURL} alt="preview of uploaded image" width={500} height={500} />}
                        <div className="py-4">
                          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={uploadToServer}>Upload</button>
                        </div>
                      </div>
                  </div>
              </form>
              <div>
                <h2>{status}</h2>
              </div>
          </div>
        </section>
      </div>

      <footer>
        {/* <p>Contribute</p> */}
      </footer>
    </div>
  )
}
