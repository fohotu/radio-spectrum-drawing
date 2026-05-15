import React,{ useState, useRef, useEffect  } from 'react';
import { Plus, Save, FileUp,Trash2, Copy } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function EditorSidebar(props) {

    const { title, setTitle,
         page, setPage, 
         element, updateField,
         addElement,selecttedElement,
         allElements,setElements,deleteElement,copyElement } = props;


    
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


    function visible(el_class = "", cond = false) {
        const elements = document.querySelectorAll(`.${el_class}`);

        elements.forEach(el => {
            el.style.display = cond ? "" : "none";
        });
    }  

// render pdf 

function renderCell1(pdf, el, scaleX, scaleY) {
    const x = el.x * scaleX;
    const y = el.y * scaleY;
    const w = el.width * scaleX;
    const h = el.height * scaleY;

    // =========================
    // 🎨 BACKGROUND
    // =========================
    if (el.bgColor) {
        pdf.setFillColor(el.bgColor);
        pdf.rect(x, y, w, h, "F");
    }

    // =========================
    // 🔲 BORDER
    // =========================
    if (el.borderBox) {
        pdf.setDrawColor(el.borderBoxColor || "#000000");
        pdf.setLineWidth(0.3);
        pdf.rect(x, y, w, h, "S");
    }

    // =========================
    // 📦 TEXT
    // =========================
    pdf.setFontSize(el.fontSize || 14);
    pdf.setTextColor(el.textColor || "#000");

    let fontStyle = "normal";
    if (el.bold && el.italic) fontStyle = "bolditalic";
    else if (el.bold) fontStyle = "bold";
    else if (el.italic) fontStyle = "italic";

    pdf.setFont("helvetica", fontStyle);

    const cx = x + w / 2;
    const cy = y + h / 2;

    pdf.text(el.label || "", cx, cy, {
        align: "center",
        baseline: "middle",
    });
}

function renderCelltest(pdf, el, scale) {
    const x = el.x * scale;
    const y = el.y * scale;
    const w = el.width * scale;
    const h = el.height * scale;

    // =========================
    // 🎨 BACKGROUND
    // =========================
    if (el.bgColor) {
        pdf.setFillColor(el.bgColor);
        pdf.rect(x, y, w, h, "F");
    }

    // =========================
    // 🔲 BORDER (СТАБИЛЬНЫЙ)
    // =========================
    if (el.borderBox) {
        pdf.setDrawColor(el.borderBoxColor || "#000000");
        pdf.setLineWidth(0.5);      // 👈 важно
        pdf.setLineJoin("miter");   // 👈 углы норм

        pdf.rect(x, y, w, h, "S");
    }

    // =========================
    // 📦 TEXT STYLE
    // =========================
    pdf.setFontSize(el.fontSize || 10);
    pdf.setTextColor(el.textColor || "#000000");

    let fontStyle = "normal";
    if (el.bold && el.italic) fontStyle = "bolditalic";
    else if (el.bold) fontStyle = "bold";
    else if (el.italic) fontStyle = "italic";

    // ⚠️ ВАЖНО: потом заменишь на Roboto для кириллицы
    pdf.setFont("Roboto", fontStyle);

    // =========================
    // 📍 CENTER TEXT
    // =========================
    const cx = x + w / 2;
    const cy = y + h / 2;

    pdf.text(el.label || "", cx, cy, {
        align: "center",
        baseline: "middle",
    });


    // =========================
    // 📊 FR TEXT (begin / end)
    // =========================
    const offsetX = el.fr_text_left || 0;
    const offsetY = el.fr_text_top || -5;

    pdf.setFontSize(el.fr_text_size || 12);
    pdf.setTextColor(el.fr_text_color || "#000");

    if (el.fr_text_position === "top") {
        if (el.visible_begin) {
            pdf.text(
                String(el.fr_begin ?? ""),
                x + offsetX,
                y + offsetY
            );
        }

        if (el.visible_end) {
            pdf.text(
                String(el.fr_end ?? ""),
                x + w + offsetX,
                y + offsetY
            );
        }
    } else {
        if (el.visible_begin) {
            pdf.text(
                String(el.fr_begin ?? ""),
                x + offsetX,
                y + h + Math.abs(offsetY)
            );
        }

        if (el.visible_end) {
            pdf.text(
                String(el.fr_end ?? ""),
                x + w + offsetX,
                y + h + Math.abs(offsetY)
            );
        }
    }
}

function renderCell(pdf, el, scale) {
    const x = el.x * scale;
    const y = el.y * scale;
    const w = el.width * scale;
    const h = el.height * scale;

    const cx = x + w / 2;
    const cy = y + h / 2;

    pdf.setFont("Roboto");
    pdf.setFontSize(el.fontSize || 14);

    const angle = el.rotate || 0;

    if (angle === 0) {
        pdf.text(el.label, cx, cy, {
            align: "center",
            baseline: "middle",
        });
        return;
    }

    // 🔥 jsPDF SAFE rotate mode
    pdf.text(el.label, cx, cy, {
        align: "center",
        baseline: "middle",
        angle: -angle,
    });
}

async function loadFontBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1];
            resolve(base64);
        };
        reader.readAsDataURL(blob);
    });
}


async function exportPDFtest() {
    const doc = new jsPDF();

    const robotoBase64 = await loadFontBase64(
        "/fonts/google/roboto/static/Roboto-Regular.ttf"
    );

    doc.addFileToVFS("Roboto.ttf", robotoBase64);
    doc.addFont("Roboto.ttf", "Roboto", "normal", "Identity-H");

    // 🔥 ВАЖНО: используем ИМЯ "Roboto"
    doc.setFont("Roboto");
    doc.setFontSize(14);

    doc.text("Привет мир!", 10, 10);

    doc.save("document.pdf");
}

async function exportPDF2() {
    print_started();

    const robotoBase64 = await loadFontBase64(
        "/fonts/google/roboto/static/Roboto-Regular.ttf"
    );

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

    const editor = document.getElementById("editor");

    const scale = widthMM / editor.offsetWidth;

    const pdf = new jsPDF({
        orientation: page.orientation === "portrait" ? "p" : "l",
        unit: "mm",
        format: [widthMM, heightMM],
    });

    pdf.addFileToVFS("Roboto.ttf", robotoBase64);
    pdf.addFont("Roboto.ttf", "Roboto", "normal", "Identity-H");

    pdf.setFont("Roboto");

    allElements.forEach((el) => {
        renderCell(pdf, el, scale);
    });

    pdf.save(`${title || "document"}.pdf`);

    print_finished();

}

    function exportPDF() {
        
        print_started();

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

        setTimeout(() => {
            print_started();
            const element = document.getElementById("editor");

            html2canvas(element, {
                scale: window.devicePixelRatio * page.zoom,
                useCORS: true,
                backgroundColor: "#fff",
                letterRendering:false,
            }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");

                const pdf = new jsPDF({
                    orientation: page.orientation === "portrait" ? "p" : "l",
                    unit: "mm",
                    format: [widthMM, heightMM],
                });

                let imgWidth = widthMM;
                let imgHeight = (canvas.height * widthMM) / canvas.width;

                if (imgHeight > heightMM) {
                    imgHeight = heightMM;
                    imgWidth = (canvas.width * heightMM) / canvas.height;
                }


                pdf.addImage(
                    imgData,
                    "PNG",
                    (widthMM - imgWidth) / 2,
                    (heightMM - imgHeight) / 2,
                    imgWidth,
                    imgHeight
                );

                pdf.save(`${title || "document"}.pdf`);

                print_finished();
            });

        }, 100); // 
    }
 

    function exportPDF1() {
        
        print_started();
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

        /*        
        html2canvas(element, {
            scale: 2 * page.zoom,
            useCORS: true,
        })
        */
        
        html2canvas(element, {
            scale: window.devicePixelRatio * page.zoom,
            useCORS: true,
            backgroundColor: "#fff"
        })
        .then((canvas) => {
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
            print_finished();
        });

        

    }

    function print_started(){
        visible("disable-on-pdf");
        setElements(prev =>
                prev.map(el => ({
                    ...el,
                    isPrinting: true
                }))
            );
    }

    function print_finished(){
        
        setElements(prev =>
            prev.map(el => ({
                ...el,
                isPrinting: false
            }))
        );

        visible("disable-on-pdf",true);
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

                    {
                        selecttedElement ?
                             <div className="border-t border-gray-700 pt-4">
                                <div className="flex justify-end gap-2 pb-5">
                                        <button onClick={()=>deleteElement(selecttedElement)} className="flex flex-col items-center1 justify-center gap-1 bg-gray-700 hover:bg-red-600 rounded-lg p-3 transition">
                                            <Trash2 size={18} />
                                            <span className="text-xs">Delete</span>
                                        </button>

                                        <button onClick={()=>copyElement(selecttedElement)} className="flex flex-col items-center justify-center1 gap-1 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition">
                                            <Copy size={18} />
                                            <span className="text-xs">Copy</span>
                                        </button>
                                    </div>
                                    {/* Label */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className="text-sm text-gray-400">Label</label>
                                        <input
                                            value={selecttedElement?.label ?? ""}
                                            onChange={(e) => updateField("label", e.target.value)}
                                            className="w-full p-2 bg-gray-700 rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Label Left Position</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={selecttedElement?.label_left_position ?? ""}
                                            onChange={(e) => updateField("label_left_position", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Label Top Position</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={selecttedElement?.label_top_position ?? ""}
                                            onChange={(e) => updateField("label_top_position", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Rotate */}
                                    <div>
                                        <label className="text-sm text-gray-400">Rotate Label {selecttedElement?.rotate ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selecttedElement?.rotate ?? ""}
                                            onChange={(e) => updateField("rotate", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mt-5">
                                        <label className="text-sm text-gray-400">Bold</label>
                                        <input
                                            type="checkbox"
                                            value={selecttedElement?.bold ?? ""}
                                            onChange={(e) =>{ updateField("bold", e.target.checked) } }
                                            className="p-2 bg-gray-700 rounded"
                                        />
                                        <label className="text-sm text-gray-400">Cursor {selecttedElement?.italic ?? "1"}</label>
                                        <input
                                            type="checkbox"
                                            value={selecttedElement?.italic ?? ""}
                                            onChange={(e) => updateField("italic", e.target.checked)}
                                            className="p-2 bg-gray-700 rounded"
                                        />
                                    </div>
                                    

                                    {/* Position */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Position X</label>
                                        <input
                                            type="number"
                                            value={Number(parseInt(selecttedElement?.x || 0))}
                                            onChange={(e) => updateField("x", Number(e.target.value))}
                                            className="p-2 bg-gray-700 rounded"
                                            placeholder="X"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-4">   
                                        <label className="text-sm text-gray-400 ">Position Y</label>
                                        <input
                                            type="number"
                                            value={Number(parseInt(selecttedElement?.y || 0))}
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
                                            value={Number(parseInt(selecttedElement?.width || 0))}
                                            onChange={(e) => {
                                                    updateField("width", Number(e.target.value))
                                            }}
                                        // onChange={elements.find(el => el.id === selecttedElement?.id)?.w ?? ""}
                                            className="p-2 bg-gray-700 rounded"
                                            placeholder="Width"
                                        />
                                        <label className="text-sm text-gray-400">Height</label>
                                        <input
                                            type="number"
                                            value={Number(parseInt(selecttedElement?.height || 0))}
                                            onChange={(e) => updateField("height", Number(e.target.value))}
                                            className="p-2 bg-gray-700 rounded"
                                            placeholder="Height"
                                        />
                                    </div>

                                    {/* Colors */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Background Color</label>
                                        <input
                                            type="color"
                                            value={selecttedElement?.bgColor ?? ""}
                                            onChange={(e) => updateField("bgColor", e.target.value)}
                                            className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Text Color</label>
                                        <input
                                            type="color"
                                            value={selecttedElement?.textColor ?? ""}
                                            onChange={(e) => updateField("textColor", e.target.value)}
                                            className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        />
                                    </div>

                                    {/* Font size */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Font Size</label>
                                        
                                        <input
                                            type="number"
                                            value={selecttedElement?.fontSize ?? ""}
                                            onChange={(e) => updateField("fontSize", Number(e.target.value))}
                                            className="p-2 bg-gray-700 rounded"
                                            placeholder="Font Size"
                                        />
                                    </div>

                                    

                                    {/* Frame text */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">
                                            RF Begin
                                            <input type="checkbox"  
                                            checked={selecttedElement?.visible_begin ?? false}
                                            onChange={(e) =>{ updateField("visible_begin", e.target.checked) } }
                                            className="ml-2 p-2 bg-gray-700 rounded"

                                            />
                                        </label>
                                        <input
                                            type="number"
                                            value={selecttedElement?.fr_begin ?? ""}
                                            onChange={(e) => updateField("fr_begin", Number(e.target.value))}
                                            className="p-2 bg-gray-700 rounded"
                                            placeholder="fr_begin"
                                        />
                                        <label className="text-sm text-gray-400">RF End
                                            <input type="checkbox"  
                                            checked={selecttedElement?.visible_end ?? false}
                                            onChange={(e) =>{ updateField("visible_end", e.target.checked) } }
                                            className="ml-5 p-2 bg-gray-700 rounded"

                                            />
                                        </label>
                                        <input
                                            type="number"
                                            value={selecttedElement?.fr_end ?? ""}
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
                                            value={selecttedElement?.fr_text_size ?? ""}
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
                                            value={selecttedElement?.fr_text_color ?? ""}
                                            onChange={(e) =>
                                                updateField("fr_text_color", e.target.value)
                                            }
                                            className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        {/* Frame text color */}
                                        <label className="text-sm text-gray-400">RF Text Position</label>
                                        <select 
                                        className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        onChange={(e) =>
                                                updateField("fr_text_position", e.target.value)
                                        }
                                        value={selecttedElement?.fr_text_position ?? ""}>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                        </select>
                                    
                                    </div>

                                     <div>
                                     

                                        <label className="text-sm text-gray-400">Show Fr Distinction
                                            <input type="checkbox"  
                                            checked={selecttedElement?.fr_distinction ?? false}
                                            onChange={(e) =>{ updateField("fr_distinction", e.target.checked) } }
                                            className="ml-5 p-2 bg-gray-700 rounded"

                                            />
                                        </label>
                                    </div>
                                    {/* Rotate */}
                                    <div>
                                        <label className="text-sm text-gray-400">Fr Text Rotate {selecttedElement?.fr_text_rotate ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selecttedElement?.fr_text_rotate ?? ""}
                                            onChange={(e) => updateField("fr_text_rotate", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Fr Text left {selecttedElement?.fr_text_left ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selecttedElement?.fr_text_left ?? ""}
                                            onChange={(e) => updateField("fr_text_left", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Fr Text Top {selecttedElement?.fr_text_top ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selecttedElement?.fr_text_top ?? ""}
                                            onChange={(e) => updateField("fr_text_top", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                   
                                

                                
                            </div>
                        :<></>
                    }        

                   

                </div>
               
            </>
        );
}