import { useEffect, useRef } from "react";
import { Bold, Italic, Pilcrow, Trash2 } from "lucide-react";

export default function Editor(props) {

    const { callBack, defaultValue } = props;

    const ref = useRef(null);
    const initialized = useRef(false);

    // Устанавливаем defaultValue только один раз
    useEffect(() => {
        if (!initialized.current && ref.current) {
            ref.current.innerHTML = defaultValue || "";
            initialized.current = true;
        }
    }, []);

    const exec = (command) => {
        document.execCommand(command);
        ref.current.focus();
    };

    const handleInput = () => {
        callBack("description", ref.current.innerHTML);
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

    const clearEditor = () => {

        if (ref.current) {
            ref.current.innerHTML = "";
            callBack("description", "");
            ref.current.focus();
        }
    };

    return (
        <div>

            {/* Toolbar */}
            <div className="flex border border-gray-700 bg-gray-800 mb-3">

                {/* Bold */}
                <button
                    type="button"
                    onClick={() => exec("bold")}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        text-gray-200
                        hover:bg-gray-700
                        border-r border-gray-700
                        transition
                    "
                >
                    <Bold size={14} />
                </button>

                {/* Italic */}
                <button
                    type="button"
                    onClick={() => exec("italic")}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        text-gray-200
                        hover:bg-gray-700
                        border-r border-gray-700
                        transition
                    "
                >
                    <Italic size={14} />
                </button>

                {/* Paragraph */}
                <button
                    type="button"
                    onClick={() => exec("insertParagraph")}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        text-gray-200
                        hover:bg-gray-700
                        border-r border-gray-700
                        transition
                    "
                >
                    <Pilcrow size={14} />
                </button>

                {/* Clear */}
                <button
                    type="button"
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

            {/* Editor */}
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
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