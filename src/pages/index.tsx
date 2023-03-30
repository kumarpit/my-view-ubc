import Head from "next/head"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <Head>
        <title>MyViewUbc</title>
        <meta name="description" content="My View UBC" />
      </Head>

      <main>
        <h1><Link href="/explore">Explore</Link></h1>
        <h1>Upload your view</h1>
        <form action="">
          <label htmlFor="residences">Your Residence:</label>
          <select id="residences" name="residences">
            <option value="walter gage">Walter Gage</option>
          </select>
          <input name="buildingnumber" type="text" placeholder="building" />
          <input name="unitnumber" type="text" placeholder="unit number" />
          <input name="file" type="file" />
        </form>
      </main>

      <footer>
        <p>Contribute</p>
      </footer>
    </div>
  )
}
