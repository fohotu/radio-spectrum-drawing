import React,{ useState, useRef, useEffect  } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EditorSidebar from './EditorSidebar';
import ElementBox from './ElementBox';
import Modal from '@/Components/Modal';
import AddElement from './AddElement';
import Test from './Test';
import UpdateGroup from './UpdateGroup';
export default function Index({ }) {

   

   const [page, setPage] = useState({
        format: "A4",
        orientation: "portrait",
        zoom: 1,
        isPrinting:false,
    });

    const [title, setTitle] = useState("Untitled Document");
    const [elements, setElements] = useState([]);

    const [addModal,setAddModal] = useState(false);
    const [activeGroup,setActiveGroup] = useState(false);

 
    const [frGroups,setFrGroups] = useState([]);
    const [defaultGroup,setDefaultGroup] = useState({
        id:Date.now().toString(),
        fr_begin:0,
        fr_end:0,
        scale:0.5,
        elements:[
            {
                id: Date.now().toString(),
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                label: "Empty",
                label_left_position:40,
                label_top_position:40,
                bold:null,
                italic:null,
                bgColor: "#c1c1c1",
                textColor: "#000000",
                fontSize: 14,
                rotate: 0,
                fr_begin: 40,
                fr_end: 50,
                fr_text_rotate: 0,
                fr_text_top:0,
                fr_text_left:0,
                fr_text_size: 14,
                fr_text_color: "#000000",
                fr_text_position: "top",
                type:"title",
                borderBox:1,
                borderBoxColor:"#000000",
                visible_begin:true,
                visible_end:true,
                fr_distinction:true,
                measure:'kHz',
                isPrinting:false,
            }
        ]
    })

    const [group,setGroup] = useState({
        id:null,
        fr_begin:0,
        fr_end:0,
        scale:0.5,

    });

    const [defaultElement, setDefaultElement] = useState({
        id: Date.now().toString(),
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        label: "Empty",
        label_left_position:40,
        label_top_position:40,
        bold:null,
        italic:null,
        bgColor: "#c1c1c1",
        textColor: "#000000",
        fontSize: 14,
        rotate: 0,
        fr_begin: 40,
        fr_end: 50,
        fr_text_rotate: 0,
        fr_text_top:0,
        fr_text_left:0,
        fr_text_size: 14,
        fr_text_color: "#000000",
        fr_text_position: "top",
        type:"title",
        borderBox:1,
        borderBoxColor:"#000000",
        visible_begin:true,
        visible_end:true,
        fr_distinction:true,
        measure:'kHz',
        isPrinting:false,
    });

      const addElement = (type) => {
        const newElement = {...defaultElement,id: Date.now().toString()};
        switch (type){        
            case "title":
                newElement.type = "title";
                newElement.label = "Title";
                newElement.fr_begin = 0;
                newElement.fr_end = 0;
                newElement.bgColor = "#ffffff";
                newElement.borderBox = 0;
                newElement.borderBoxColor = "#ffffff";
                newElement.width = 200;
                newElement.height = 50;
                newElement.fr_distinction = false;
                break;
            case "range":
                newElement.type = "range";
                newElement.label = "Range";
                newElement.width = 200;
                newElement.height = 5;
                newElement.bgColor = "#ffffff";
                break;
            case "denomination":
                newElement.type = "denomination";
                newElement.label = "Denomination";
                break;
            default:                
                newElement.label = "Empty";
        }
        setElements([...elements, newElement]);
    }

    const copyElement = (item) => {
        let newElement = {
            ...item,
            id: Date.now().toString(),
            x:item.x+10,
            y:item.y+10
        }
        setElements([...elements, newElement]);
    }

    const deleteElement = (item) => {
        let filtered = elements.filter((e)=>e.id !=item.id);
        setElements(filtered);
    }

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

    // mm → px + zoom
    const width = widthMM * 3.78 * page.zoom;
    const height = heightMM * 3.78 * page.zoom;

    const [selecttedElement, setSelectedElement] = useState(null);

    const [element, setElement] = useState({
        x: 350,
        y: 200,
        w: 20,
        h: 80,
        label: "Empty",
        bgColor: "#c1c1c1",
        textColor: "#000000",
        fontSize: 14,
        rotate: -90,
        fr_begin: 40,
        fr_end: 50,
        fr_text_rotate: 0,
        fr_text_size: 14,
        fr_text_color: "#000000",
        fr_text_position: "top",
    });

    const updateField = (key, value) => {
        setElements((prev) =>
            prev.map((item) =>
                item.id === selecttedElement.id
                    ? { ...item, [key]: value } // ✅ новый объект
                    : item
            )
        );
    };



    useEffect(() => {
        if (!selecttedElement) return;
        const updated = elements.find(el => el.id === selecttedElement.id);
        if (updated) {
            setSelectedElement(updated);
        }
    }, [elements]);


    {
        /*
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Dashboard Index
        </h2>
        */
                
    }

    return (
        

        <AuthenticatedLayout
            header={null}
            sidebar={
                <EditorSidebar 
                    title={title}
                    setTitle={setTitle}
                    page={page}
                    setPage={setPage}
                    element={element}
                    allElements = {elements}
                    setElements={setElements}
                    updateField={updateField}
                    selecttedElement={selecttedElement}
                   // setSelectedElement={setSelectedElement}
                    addElement={addElement}
                    copyElement={copyElement}
                    deleteElement={deleteElement}
                />
            }
        >
        {
            /*
            <Head title="Dashboard Index" />
            */
            }
            
            <Modal show={addModal} onClose={()=>setAddModal(false)}>
                {/*   
                <Test setElements={setElements} elements={elements} pageWidth={width} pageHeight={height}/>

                */}

                <AddElement 
                    group={group} 
                    setGroup={setGroup} 
                    setElements={setElements} 
                    elements={elements} 
                    pageWidth={width} 
                    pageHeight={height} 
                />

            </Modal>

            <Modal show={activeGroup} onClose={()=>setActiveGroup(false)}>
                <UpdateGroup 
                    setElements={setElements} 
                    elements={elements} 
                    group_id={activeGroup}  
                    pageWidth={width} 
                />
            </Modal>
             <button onClick={()=>setAddModal(true)}>+ Add Elements</button>
                       
            {/* Контейнер листа */}
            <div className="flex items-center justify-center min-h-full p-10">
                {/* Белый лист */}
                <div
                    id="editor"
                    className="bg-white shadow-2xl rounded-sm"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        transformOrigin: "center",
                    }}
                >
                    {/* Контент внутри листа */}
                    <div className="text-black">
                        <ElementBox 
                            elements={elements}
                            setElements={setElements} 
                            width={width} 
                            height={height}
                            selecttedElement={selecttedElement}
                            setActiveGroup = {setActiveGroup}
                            activeGroup = {activeGroup}
                            setSelectedElement={setSelectedElement}
                        />
                    </div>
                </div>

            </div>

        </AuthenticatedLayout>
    );
}
