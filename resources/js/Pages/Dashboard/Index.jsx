import React,{ useState, useRef, useEffect  } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EditorSidebar from './EditorSidebar';
import ElementBox from './ElementBox';

export default function Index({ }) {

   

   const [page, setPage] = useState({
        format: "A4",
        orientation: "portrait",
        zoom: 1,
    });

    const [title, setTitle] = useState("Untitled Document");
    const [elements, setElements] = useState([]);


 

    const [defaultElement, setDefaultElement] = useState({
        id: Date.now().toString(),
        x: 0,
        y: 0,
        w: 20,
        h: 80,
        label: "Empty",
        bgColor: "#c1c1c1",
        textColor: "#000000",
        fontSize: 14,
        rotate: 0,
        fr_begin: 40,
        fr_end: 50,
        fr_text_rotate: 0,
        fr_text_size: 14,
        fr_text_color: "#000000",
        fr_text_position: "top",
    });

      const addElement = (type) => {
        const newElement = {...defaultElement,id: Date.now().toString()};
        switch (type){        
            case "title":
                newElement.label = "Title";break;
            case "range":
                newElement.label = "Range";break;
            case "denomination":
                newElement.label = "Denomination";break;
            default:                
                newElement.label = "Empty";
        }
        setElements([...elements, newElement]);
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
        setElement(prev => ({
            ...prev,
            [key]: value,
        }));
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Index
                </h2>
            }
            sidebar={
                <EditorSidebar 
                    title={title}
                    setTitle={setTitle}
                    page={page}
                    setPage={setPage}
                    element={element}
                    updateField={updateField}
                    selecttedElement={selecttedElement}
                    setSelectedElement={setSelectedElement}
                    addElement={addElement}
                />
            }

        >
            <Head title="Dashboard Index" />
            

            {/* Контейнер листа */}
            <div className="flex items-center justify-center min-h-full p-10">
                {selecttedElement && selecttedElement.id}
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
                            setSelectedElement={setSelectedElement}
                        />
                    </div>
                </div>

            </div>

        </AuthenticatedLayout>
    );
}
