import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Pilcrow, Trash2 } from "lucide-react";

export default function Editor(props) {
   
    const {callBack,defaultValue} = props;
    const ref = useRef(null);
    const [html, setHtml] = useState("");

    useEffect(() => {
        if (defaultValue) {
            setHtml(defaultValue);
        }
    }, [defaultValue]);

    const exec = (command) => {
        document.execCommand(command);
        ref.current.focus();
    };

    const handleInput = () => {
        callBack("description",ref.current.innerHTML)
        setHtml(ref.current.innerHTML);
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === "b") {
            e.preventDefault();
            exec("bold");
        }

        if (e.ctrlKey && e.key.toLowerCase() === "i") {
            e.preventDefault();
            exec("italic");
        }
    };

    // 🔥 CLEAR FUNCTION
    const clearEditor = () => {
        if (ref.current) {
            ref.current.innerHTML = "";
            setHtml("");
            callBack("description","")
            ref.current.focus();
        }
    };

    return (
        <div>

            {/* Toolbar */}
            {/** */}
            <div className="flex border border-gray-700 bg-gray-800 mb-3">
                {/* BOLD */}
                <button
                    onClick={() => exec("bold")}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        text-gray-200
                        hover:bg-gray-700
                        transition
                        border-r border-gray-700
                    "
                >
                    <Bold size={14} />
                </button>

                {/* ITALIC */}
                <button
                    onClick={() => exec("italic")}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        text-gray-200
                        hover:bg-gray-700
                        transition
                        border-r border-gray-700
                    "
                >
                    <Italic size={14} />
                </button>

                {/* PARAGRAPH */}
                <button
                    onClick={() => exec("insertParagraph")}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        text-gray-200
                        hover:bg-gray-700
                        transition
                        border-r border-gray-700
                    "
                >
                    <Pilcrow size={14} />
                </button>

                {/* CLEAR */}
                <button
                    onClick={clearEditor}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        text-gray-200
                        hover:bg-red-600
                        transition
                    "
                >
                    <Trash2 size={14} />
                </button>

            </div>    
            {/** */}
            <div style={{ display: "none", gap: 8, marginBottom: 10 }}>

                <button onClick={() => exec("bold")} style={btnStyle}>
                    <Bold size={18} />
                </button>

                <button onClick={() => exec("italic")} style={btnStyle}>
                    <Italic size={18} />
                </button>

                <button onClick={() => exec("insertParagraph")} style={btnStyle}>
                    <Pilcrow size={18} />
                </button>

                {/* CLEAR */}
                <button onClick={clearEditor} style={btnStyle}>
                    <Trash2 size={18} />
                </button>

            </div>

            {/* Editor */}
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{ __html: html }}
                className="
                    min-h-[60px]
                    border border-gray-700
                    bg-gray-800
                    text-white
                    p-2
                    outline-none
                    leading-relaxed
                "

                
            />
        </div>
    );
}

const btnStyle = {
    border: "1px solid #ddd",
    background: "white",
    padding: 2,
    borderRadius: 2,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:"#000",
};