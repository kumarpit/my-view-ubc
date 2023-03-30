export default function Explore() {
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
        </div>
    )
}