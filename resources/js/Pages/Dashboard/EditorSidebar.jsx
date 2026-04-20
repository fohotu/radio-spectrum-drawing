import React,{ useState, useRef, useEffect  } from 'react';
import { Plus, Save, FileUp } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function EditorSidebar(props) {

    const { title, setTitle, page, setPage, element, updateField,addElement } = props;
    const [openAdd, setOpenAdd] = useState(false);    
    const add_ref = useRef(null);
    const[category,setCategory] = useState([
        {code: "title", label: "Заголовок"},
        {code: "range", label: "Диапазон"},
        {code: "denomination", label: "Номиналь"},
    ]);
    
    
         // 🔥 закрытие при клике вне
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (add_ref.current && !add_ref.current.contains(event.target)) {
                    setOpenAdd(false);
                }
            };
    
          //  document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("click", handleClickOutside);

            return () => {
               // document.removeEventListener("mousedown", handleClickOutside);
                 document.removeEventListener("click", handleClickOutside);
            };
        }, []);


         function exportPDF() {
        const element = document.getElementById("editor");
        const sizes = {
            A4: { w: 210, h: 297 },
            A3: { w: 297, h: 420 },
        };

        const current = sizes[page.format];

        const widthMM =
            page.orientation === "portrait"
                ? current.w
                : current.h;

        const heightMM =
            page.orientation === "portrait"
                ? current.h
                : current.w;

        html2canvas(element, {
            scale: 2 * page.zoom,
            useCORS: true,
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: page.orientation === "portrait" ? "p" : "l",
                unit: "mm",
                format: [widthMM, heightMM],
            });

            const pageWidth = widthMM;
            const pageHeight = heightMM;

            // 🔥 ВАЖНО: FIT INTO PAGE (НЕ stretch)
            let imgWidth = pageWidth;
            let imgHeight = (canvas.height * pageWidth) / canvas.width;

            // 🔥 если высота больше страницы — ограничиваем
            if (imgHeight > pageHeight) {
                imgHeight = pageHeight;
                imgWidth = (canvas.width * pageHeight) / canvas.height;
            }

            // ✅ всегда ОДНА страница
            pdf.addImage(
                imgData,
                "PNG",
                (pageWidth - imgWidth) / 2,
                (pageHeight - imgHeight) / 2,
                imgWidth,
                imgHeight
            );

            pdf.save(`${title || "document"}.pdf`);
        });
    }

    return (
            <>
               <div className="space-y-6 text-gray-200">
                    {/* Кнопки */}
                    <div className="grid grid-cols-3 gap-3 pt-4">
                         <div  className="relative inline-block">
                            {/* Add Element */}
                            <button ref={add_ref} onClick={()=>setOpenAdd((prev) => !prev)} className="flex flex-col items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition">
                                <Plus size={18} />
                                <span className="text-xs">Add</span>
                            </button>


                            {/* Dropdown */}
                            {openAdd && (
                                <div className="absolute left-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"  onClick={(e) => e.stopPropagation()}>

                                    {
                                        category.map((cat) => (
                                            <button onClick={() => addElement(cat.code)} key={cat.code} className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm">
                                                {cat.label}
                                            </button>
                                        ))
                                    }
                                 

                                </div>
                            )}
                         </div>
                        

                        {/* Save */}
                        <button className="flex flex-col items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition">
                            <Save size={18} />
                            <span className="text-xs">Save</span>
                        </button>

                        {/* Import PDF */}
                        <button onClick={exportPDF} className="flex flex-col items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition">
                            <FileUp size={18} />
                            <span className="text-xs">Export PDF</span>
                        </button>

                    </div>
                    <div>
                        <h3 className="text-sm mb-2 text-gray-400">Title</h3>

                        <div className="space-y-2">
                           <input
                                value={title || ""}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                    //setPage({...page, title: e.target.value })
                                    //setPage(prev => ({ ...prev, title: e.target.value }))
                                }
                                className="w-full p-2 rounded bg-gray-700 text-gray-200"
                                placeholder="Document Title"
                            />
                        </div>
                    </div>
                    {/* 1. Формат */}
                    <div>
                        <h3 className="text-sm mb-2 text-gray-400">Format</h3>

                        <div className="space-y-2">
                            <select
                                value={page.format}
                                onChange={(e) =>
                                    setPage(prev => ({ ...prev, format: e.target.value }))
                                }
                                className="w-full p-2 rounded bg-gray-700 text-gray-200"
                            >
                                <option value="A4">A4</option>
                                <option value="A3">A3</option>
                            </select>
                            
                        </div>
                    </div>

                    {/* 2. Ориентация */}
                    <div>
                        <h3 className="text-sm mb-2 text-gray-400">Orientation</h3>

                        <div className="space-y-2">
                            <select
                                value={page.orientation}
                                onChange={(e) =>
                                    setPage(prev => ({ ...prev, orientation: e.target.value }))
                                }
                                className="w-full p-2 rounded bg-gray-700 text-gray-200"
                            >
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                    </div>

                    {/* 3. Zoom */}
                    <div>
                        <h3 className="text-sm mb-2 text-gray-400">
                            Zoom ({Math.round(page.zoom * 100)}%)
                        </h3>

                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={page.zoom}
                            onChange={(e) =>
                                setPage(prev => ({
                                    ...prev,
                                    zoom: Number(e.target.value)
                                }))
                            }
                            className="w-full"
                        />
                    </div>

                     {/* 2. Элемент */}
                    <div className="border-t border-gray-700 pt-4">
                            {/* Label */}
                            <div className="grid grid-cols-2 gap-2">
                                <label className="text-sm text-gray-400">Label</label>
                                <input
                                    value={element.label}
                                    onChange={(e) => updateField("label", e.target.value)}
                                    className="w-full p-2 bg-gray-700 rounded"
                                />
                            </div>
                            

                            {/* Position */}
                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <label className="text-sm text-gray-400">Position X</label>
                                <input
                                    type="number"
                                    value={element.x}
                                    onChange={(e) => updateField("x", Number(e.target.value))}
                                    className="p-2 bg-gray-700 rounded"
                                    placeholder="X"
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-2 pt-4">   
                                <label className="text-sm text-gray-400 ">Position Y</label>
                                <input
                                    type="number"
                                    value={element.y}
                                    onChange={(e) => updateField("y", Number(e.target.value))}
                                    className="p-2 bg-gray-700 rounded"
                                    placeholder="Y"
                                />
                            </div>

                            {/* Size */}
                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <label className="text-sm text-gray-400">Width</label>
                                <input
                                    type="number"
                                    value={element.w}
                                    onChange={(e) => updateField("w", Number(e.target.value))}
                                    className="p-2 bg-gray-700 rounded"
                                    placeholder="Width"
                                />
                                <label className="text-sm text-gray-400">Height</label>
                                <input
                                    type="number"
                                    value={element.h}
                                    onChange={(e) => updateField("h", Number(e.target.value))}
                                    className="p-2 bg-gray-700 rounded"
                                    placeholder="Height"
                                />
                            </div>

                            {/* Colors */}
                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <label className="text-sm text-gray-400">Background Color</label>
                                <input
                                    type="color"
                                    value={element.bgColor}
                                    onChange={(e) => updateField("bgColor", e.target.value)}
                                    className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <label className="text-sm text-gray-400">Text Color</label>
                                <input
                                    type="color"
                                    value={element.textColor}
                                    onChange={(e) => updateField("textColor", e.target.value)}
                                    className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                />
                            </div>

                            {/* Font size */}
                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <label className="text-sm text-gray-400">Font Size</label>
                                
                                <input
                                    type="number"
                                    value={element.fontSize}
                                    onChange={(e) => updateField("fontSize", Number(e.target.value))}
                                    className="p-2 bg-gray-700 rounded"
                                    placeholder="Font Size"
                                />
                            </div>

                            {/* Rotate */}
                            <div>
                                <label className="text-sm text-gray-400">Rotate</label>
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={element.rotate}
                                    onChange={(e) => updateField("rotate", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Frame text */}
                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <label className="text-sm text-gray-400">RF Begin</label>
                                <input
                                    type="number"
                                    value={element.fr_begin}
                                    onChange={(e) => updateField("fr_begin", Number(e.target.value))}
                                    className="p-2 bg-gray-700 rounded"
                                    placeholder="fr_begin"
                                />
                                <label className="text-sm text-gray-400">RF End</label>
                                <input
                                    type="number"
                                    value={element.fr_end}
                                    onChange={(e) => updateField("fr_end", Number(e.target.value))}
                                    className="p-2 bg-gray-700 rounded"
                                    placeholder="fr_end"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-4">
                                 {/* Frame text size */}
                                <label className="text-sm text-gray-400">RF Font Size</label>
                                <input
                                    type="number"
                                    value={element.fr_text_size}
                                    onChange={(e) =>
                                        updateField("fr_text_size", Number(e.target.value))
                                    }
                                    className="w-full p-2 bg-gray-700 rounded"
                                    placeholder="Text Size"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-4">
                                 {/* Frame text color */}
                                <label className="text-sm text-gray-400">RF Text Color</label>
                                <input
                                    type="color"
                                    value={element.fr_text_color}
                                    onChange={(e) =>
                                        updateField("fr_text_color", e.target.value)
                                    }
                                    className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                />
                            </div>
                           

                           
                    </div>

                </div>
               
            </>
        );
}