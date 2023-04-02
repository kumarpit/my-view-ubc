import Image from "next/image"

export default function View({ residence, building, unit, description, data, base64 }: { residence: string, building: string, unit: string, description: string, data: string, base64: string }) {
    return (
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div>
                    <Image 
                        src={data}
                        alt="Placeholder Blur"
                        placeholder="blur"
                        blurDataURL={base64}
                        width={700}
                        height={550}
                        sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </div>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{residence}</div>
                    {building && <p className="text-gray-700 text-base">Building {building}</p>}
                    <p className="text-gray-700 text-base">{unit}</p>
                    <p className="text-gray-700 text-base">{description}</p>
                </div>
            </div>
    )
}