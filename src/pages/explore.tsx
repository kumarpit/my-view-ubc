import { useEffect, useState } from "react";
import S3 from "aws-sdk/clients/s3";
import Image from "next/image";

export default function Explore() {
    const [image, setImage] = useState<string>("");
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        getViews();
    }, [])

    const getViews = async () => {
        const res = await fetch(`api/get-image`)
        const data = await res.json();
        setData(data);
    }

    return (
        <div>
            <h1>Explore</h1>
            <form action="">
                <label htmlFor="residences">Residence:</label>
                <select id="residences" name="residences">
                    <option value="walter gage">Walter Gage</option>
                </select>
                <input name="buildingnumber" type="text" placeholder="building" />
                <input name="unitnumber" type="text" placeholder="unit number" />
            </form>
            { 
                data.map((val, _) => {
                    return (
                        <Image src={val.data} alt="preview of uploaded image" width={500} height={500} key={val._id} />
                    )
                })
            }
        </div>
    )
}