import Link from "next/link";
import { useEffect, useState } from "react";
import View from "./components/View";
import { Nullable } from "../../lib/types";

export default function Home() {
    const [data, setData] = useState<any[]>([]);
    const [residence, setResidence] = useState<Nullable<string>>();
    const [status, setStatus] = useState<string>("");
    useEffect(() => {
        getViews();
    }, [])

    const getViews = async () => {
        const res = await fetch(`api/views`)
        const data = await res.json();
        setData(data);
        if (data.length == 0) setStatus("nothing to see here...")
        else setStatus("");
    }

    const getViewsByRes = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!residence) return;
        const res = await fetch(`api/views-by-id?res=${encodeURIComponent(residence)}`);
        const data = await res.json();
        setData(data);
        if (data.length == 0) setStatus("nothing to see here...")
        else setStatus("");
    }

    return (
        <div className="mx-4 my-8">
            <div className="py-8 max-w-5xl lg:py-8 mx-auto">
            <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">MyViewUBC</h1>
            <form action="#">
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="flex flex-col justify-center sm:col-span-1">
                        <select id="residence" defaultValue="SR" onChange={ e => setResidence(e.target.selectedOptions[0].innerHTML)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                              <option disabled value="SR">Select residence</option>
                              <option value="WG">Walter Gage</option>
                              <option value="CP">tə šxʷhəleləm̓s tə k̓ʷaƛ̓kʷəʔaʔɬ</option>
                              <option value="EX">Exchange</option>
                              <option value="BC">Brock Commons</option>
                              <option value="OC">Orchard Commons</option>
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
                      <div className="flex flex-col items-start justify-end">
                        <div className="">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={getViewsByRes}>Search</button>
                        </div>
                      </div>
                    </div>
                </form>
                <div className="my-4">
                    <Link href="/upload">
                        <button className="bg-transparent hover:bg-blue-700 text-blue-700 font-medium hover:text-white py-2 px-4 border border-blue-700 hover:border-transparent rounded-lg text-sm px-5 py-2.5 text-center">
                            Upload your view
                        </button>
                    </Link>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6 max-w-5xl mx-auto">
            { 
                data.map((val, _) => {
                    return (
                        <div key={`${_}`}>
                            <View key={`${_}+1`} {...val} />
                        </div>
                    )
                })
            }
            <h3 className="mb-4 text-xl text-gray-900 dark:text-white">{status}</h3> 
            </div>
        </div>
    )
}