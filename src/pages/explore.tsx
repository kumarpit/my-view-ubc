import { useEffect, useState } from "react";
import S3 from "aws-sdk/clients/s3";
import Image from "next/image";

export default function Explore() {
    const [image, setImage] = useState<string>("");
    useEffect(() => {
        getViews();
    }, [])

    const getViews = async () => {
        const data = await fetch(`api/get-image`)
        setImage(await data.json())
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
            <Image src={image} alt="preview of uploaded image" width={500} height={500} />
        </div>
    )
}