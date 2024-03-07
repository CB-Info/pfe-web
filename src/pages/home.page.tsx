import { useState } from "react";
import TextfieldList from "../components/textfields/textfield.list";

export default function HomePage() {
    const [value, setValue] = useState("")

    return (
        <div className="h-screen w-full bg-color bg-opacity-30">
            <span>{value}</span>
            <div className="w-[300px]">
                <TextfieldList valuesToDisplay={["heo", "hello", "health"]} onClicked={(value) => {setValue(value)}}/>
            </div>
        </div>
    )
}