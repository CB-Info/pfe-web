import { useState } from "react";

export default function HomePage() {
    const [value, setValue] = useState("")

    return (
        <div className="h-screen w-full bg-color bg-opacity-30">
            <span>{value}</span>
            <div className="w-[300px]">
            </div>
        </div>
    )
}