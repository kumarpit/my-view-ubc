import Image from "next/image"

export default function View({ building, unit, description, data }: { building: string, unit: string, description: string, data: string }) {
    return (
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div>
                    <Image 
                        src={data}
                        alt="Placeholder Blur"
                        // placeholder="blur"
                        // blurDataURL={data.base64}
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
                    <div className="font-bold text-xl mb-2">{building}</div>
                    <p className="text-gray-700 text-base">{unit}</p>
                    <p className="text-gray-700 text-base">{description}</p>
                </div>
            </div>
    )
}