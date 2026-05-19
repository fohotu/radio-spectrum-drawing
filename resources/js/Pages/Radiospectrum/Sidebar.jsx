import React,{useRef,useState,useEffect} from 'react'
import { Plus, Save, FileUp,Trash2, Copy } from "lucide-react";
import SelectedRangeForm from "./SelectedRangeForm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { router,usePage } from "@inertiajs/react";

function Sidebar(props) {

  const {
    page,setPage,
    setAddElementModal,
    selectedRange,
    updateField,
    deleteElement,
    copyElement,
    frGroups,
    setDirty,
    dirty,
  } = props;

  const {translations} = usePage().props;

  const [openAdd, setOpenAdd] = useState(false);  
  const[category,setCategory] = useState([
          {code: "title", label: "Заголовок"},
          {code: "range", label: "Диапазон"},
          {code: "denomination", label: "Номиналь"},
      ]);  
    const add_ref = useRef(null);

    const [saving, setSaving] = useState(false);


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

                pdf.save(`${page.title || "document"}.pdf`);

                print_finished();
            });

        }, 100); // 
    }
    
    const saveDocument = async () => {
       
    try {
        setSaving(true);

        const csrf = document.querySelector(
            'meta[name="csrf-token"]'
        )?.content;

       const response = await axios.post(`/radiospectrum/save`, {
            group: JSON.stringify(frGroups),
            page: JSON.stringify(page),
        }, {
            headers: {
                "X-CSRF-TOKEN": csrf,
                "Content-Type": "application/json",
            },
        });

        setDirty(false);

         if (response.data.document_id) {
                router.visit(`/radiospectrum/${response.data.document_id}/edit`);
                /*
                window.location.href =
                `/radiospectrum/${response.data.document_id}/edit`;
                */

        }



    } catch (error) {
        console.error(error);
    } finally {
        setSaving(false);
    }
};

    const saveDocument1 = () => {
    

        const form = document.createElement("form");

        form.method = "POST";
        form.action = "/radiospectrum/save";

        

     //   form.target = "_blank";

        // CSRF
        const csrf = document.createElement("input");

        csrf.type = "hidden";
        csrf.name = "_token";

        /*
        csrf.value = document
            .querySelector('meta[name="csrf-token"]')
            .content;
            */

        csrf.value = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content || "";

        form.appendChild(csrf);




        // GROUP OBJECT
        const groupInput = document.createElement("input");

        groupInput.type = "hidden";
        groupInput.name = "group";

        groupInput.value = JSON.stringify(frGroups);

        form.appendChild(groupInput);

        //Page Object 

        const pageInput = document.createElement("input");

        pageInput.type = "hidden";
        pageInput.name = "page";

        pageInput.value = JSON.stringify(page);

        form.appendChild(pageInput);
        
        document.body.appendChild(form);

        form.submit();

        document.body.removeChild(form);
    }

    const openDocumentCopy = () => {

        const form = document.createElement("form");

        form.method = "POST";
        form.action = "/radiospectrum/copy";
        form.target = "_blank";

        // CSRF
        const csrf = document.createElement("input");

        csrf.type = "hidden";
        csrf.name = "_token";

        /*
        csrf.value = document
            .querySelector('meta[name="csrf-token"]')
            .content;
            */

        csrf.value = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content || "";

        form.appendChild(csrf);




        // GROUP OBJECT
        const groupInput = document.createElement("input");

        groupInput.type = "hidden";
        groupInput.name = "group";

        groupInput.value = JSON.stringify(frGroups);

        form.appendChild(groupInput);

        //Page Object 

        const pageInput = document.createElement("input");

        pageInput.type = "hidden";
        pageInput.name = "page";

        pageInput.value = JSON.stringify(page);

        form.appendChild(pageInput);
        
        document.body.appendChild(form);

        form.submit();

        document.body.removeChild(form);
    };

    function print_started(){
        visible("disable-on-pdf");
        setPage({...page,isPrinting:true})
    }

    function print_finished(){
        setPage({...page,isPrinting:false})
        visible("disable-on-pdf",true);
    }


    function visible(el_class = "", cond = false) {
        const elements = document.querySelectorAll(`.${el_class}`);

        elements.forEach(el => {
            el.style.display = cond ? "" : "none";
        });
    }  

  return (
    <div>
        <div>
                <div className="border border-gray-700 bg-gray-800 my-5">
    <div className="grid grid-cols-1">
         <label
            className="
                flex items-center gap-3
                h-12 px-4
                border-r border-gray-700
                text-sm text-gray-200
            "
        >

            <input
                type="checkbox"
                checked={page.grid}
                onChange={(e) =>
                    setPage({...page,grid:e.target.checked})
                }
                className="
                    w-4 h-4
                    accent-yellow-500
                "
            />

            {translations.system.include_grid}

        </label>
    </div>
</div>
              <div className="grid grid-cols-4 border border-gray-700 bg-gray-800">
                        
                          
                            {/* BUTTON 2 */}
                            <button
                                onClick={() => setAddElementModal(true)}
                                className="
                                    h-12
                                    flex items-center justify-center
                                    text-gray-200
                                    hover:bg-gray-700
                                    border-r border-gray-700
                                    transition
                                "
                            >
                                <Plus size={18} />
                            </button>
                        
                            {/* SAVE */}
                            <button
                                style={{"display":"none"}}
                                onClick={() => saveDocument()}
                                className="
                                    h-12
                                    flex items-center justify-center
                                    text-gray-200
                                    hover:bg-gray-700
                                    border-r border-gray-700
                                    transition
                                "
                            >
                                <Save size={18} />
                            </button>


                              <button
                                onClick={saveDocument}
                                disabled={saving}
                                className={`
                                    h-12 w-12
                                    flex items-center justify-center
                                    border-r border-gray-700
                                    transition-colors
                            
                                    ${
                                        dirty
                                            ? "bg-yellow-500 text-white hover:bg-yellow-400"
                                            : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                                    }
                            
                                    ${
                                        saving
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }
                                `}
                            >
                                {saving ? (
                                    <div
                                        className="
                                            w-4 h-4
                                            border-2 border-gray-300
                                            border-t-transparent
                                            rounded-full
                                            animate-spin
                                        "
                                    />
                                ) : (
                                    <Save size={18} />
                                )}
                            </button>
                        
                            {/* EXPORT */}
                            <button
                                onClick={() => exportPDF()}
                                className="
                                    h-12
                                    flex items-center justify-center
                                    text-gray-200
                                    hover:bg-gray-700
                                    border-r border-gray-700
                                    transition
                                "
                            >
                                <FileUp size={18} />
                            </button>
                        
                            {/* COPY */}
                            <button
                                onClick={() => openDocumentCopy()}
                                className="
                                    h-12
                                    flex items-center justify-center
                                    text-gray-200
                                    hover:bg-gray-700
                                    transition
                                "
                            >
                                <Copy size={18} />
                            </button>
                        
                        </div>

            <div style={{"display":"none"}} className="grid grid-cols-5 gap-3">
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
                <div className="">
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      onClick={()=>setAddElementModal(true)}>
                        <Plus />
                    </button>
                </div>
                <div className="">
                    <button className="bg-green-500 text-white p-2 rounded hover:bg-blue-600"
                      onClick={()=>saveDocument()}>
                        <Save />
                    </button>
                </div>
                <div className="">
                     <button className="bg-yellow-500 text-white p-2 rounded hover:bg-blue-600"
                      onClick={()=>exportPDF()}>
                        <FileUp />
                    </button>
                </div>
                <div className="">
                    
                    <button className="bg-sky-500 text-white p-2 rounded hover:bg-blue-600"
                      onClick={()=>openDocumentCopy()}>
                        <Copy />
                    </button>
                </div>
            </div>




            <div className="my-5">
                        <div className="space-y-2">
                           <input
                                value={page.title || ""}
                                onChange={(e) =>{
                                        setDirty(true);
                                        setPage(prev => ({ ...prev, title: e.target.value }))
                                    } 
                                }
                                 className="
                                            w-full h-10
                                            bg-gray-800
                                            text-white
                                            text-sm
                                            px-3
                                            border border-gray-700
                                            outline-none
                                            transition
                                            focus:border-gray-500
                                            hover:bg-gray-750
                                        "
                                placeholder="Document Title"
                            />
                        </div>
                    </div>
                    {/* 1. Формат */}
                    <div>
                        <h3 className="text-sm mb-2 text-gray-400">{translations.system.format}</h3>

                        <div className="space-y-2">
                            <select
                                value={page.format}
                                onChange={(e) =>{
                                    setDirty(true);
                                    setPage(prev => ({ ...prev, format: e.target.value }))

                                }
                                }
                                 className="
                                            w-full h-10
                                            bg-gray-800
                                            text-white
                                            text-sm
                                            px-3
                                            border border-gray-700
                                            outline-none
                                            transition
                                            focus:border-gray-500
                                            hover:bg-gray-750
                                        "
                            
                            >
                                <option value="A4">A4</option>
                                <option value="A3">A3</option>
                            </select>
                            
                        </div>
                    </div>

                    {/* 2. Ориентация */}
                    <div>
                        <h3 className="text-sm mb-2 text-gray-400">{translations.system.orientation}</h3>

                        <div className="space-y-2">
                            <select
                                value={page.orientation}
                                onChange={(e) =>{
                                        setDirty(true);
                                        setPage(prev => ({ ...prev, orientation: e.target.value }))

                                    }
                                }
                                className="
                                            w-full h-10
                                            bg-gray-800
                                            text-white
                                            text-sm
                                            px-3
                                            border border-gray-700
                                            outline-none
                                            transition
                                            focus:border-gray-500
                                            hover:bg-gray-750
                                        "
                            >
                                <option value="portrait">{translations.system.format_portrait}</option>
                                <option value="landscape">{translations.system.format_landscape}</option>
                            </select>
                        </div>
                    </div>

                    {/* 3. Zoom */}
                    <div>
                        <h3 className="text-sm mb-2 text-gray-400">
                            {translations.system.zoom} ({Math.round(page.zoom * 100)}%)
                        </h3>

                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={page.zoom}
                            onChange={(e) =>{
                                setDirty(true);
                                setPage(prev => ({
                                    ...prev,
                                    zoom: Number(e.target.value)
                                }))
                            }
                                
                            }
                            className="w-full"
                        />
                    </div>
        </div>

        <div>

            <SelectedRangeForm 
                selectedRange={selectedRange}
                updateField={updateField}
                deleteElement={deleteElement}
                copyElement={copyElement}
            />              

        </div>


    </div>
  )
}


export default Sidebar;
