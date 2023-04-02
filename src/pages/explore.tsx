import { useEffect, useState } from "react";
import View from "./components/View";

export default function Explore() {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        getViews();
    }, [])

    const getViews = async () => {
        // TODO
    }

    return (
        <div className="">
            <div className="py-8 max-w-5xl lg:py-8 mx-auto">
            <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">MyViewUBC</h1>
            <form action="#">
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="flex flex-col justify-center sm:col-span-1">
                          <select id="residence" defaultValue="Select residence" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                              <option>Select residence</option>
                              <option value="TV">Walter Gage</option>
                              <option value="PC">tə šxʷhəleləm̓s tə k̓ʷaƛ̓kʷəʔaʔɬ</option>
                              <option value="GA">Exchange</option>
                              <option value="PH">Brock Commons</option>
                              <option value="PH">Iona House</option>
                              <option value="PH">Place Vanier</option>
                              <option value="PH">Totem Park</option>
                              <option value="PH">Ritsumeikan-UBC House</option>
                              <option value="PH">Fairview Crescent</option>
                              <option value="PH">Marine Drive</option>
                              <option value="PH">Fraser Hall</option>
                              <option value="PH">Ponderosa Commons</option>
                              <option value="PH">Thunderbird</option>
                              <option value="PH">Acadia Park</option>
                          </select>
                      </div>
                      <div className="flex flex-col items-start justify-end">
                        <div className="">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>
                      </div>
                    </div>
                </form>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6 max-w-5xl mx-auto">
            { 
                data.map((val, _) => {
                    return (
                        <div>
                            <View {...val} />
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}