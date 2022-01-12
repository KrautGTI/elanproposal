import { FC } from "react";

const StaticRoofImage: FC<{ url: string | null}> = ({ url }) => {
    if (!url) return null
    
    return <img className="h-full w-full object-cover" alt="Top down view of solar design." src={url} />
}

export default StaticRoofImage;