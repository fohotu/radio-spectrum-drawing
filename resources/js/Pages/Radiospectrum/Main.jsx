import React,{useEffect, useState} from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Sidebar from './Sidebar';
import Header from './Header';
import SpectrumGroup from './SpectrumGroup';
import { element } from './Default';
import Modal from '@/Components/Modal';
import RangeForm from './RangeForm';
import UpdateGroup from './UpdateGroup';
import TextForm from './TextForm';
function Main({defaultPage=null,defaultGroups=null}) {


   const [page, setPage] = useState({
        title:"",
        format: "A4",
        orientation: "portrait",
        zoom: 1,
        isPrinting:false,
    });

  const [addElementModal,setAddElementModal] = useState(false);
  const [activeGroup,setActiveGroup] = useState(false);
  const [selectedRange,setSelectedRange] = useState(false);
  const [textFormActive,setTextFormActive] = useState(false);

  const addElement = (groupId) => {
    const newElement = element;

    setFrGroups((prev) =>
        prev.map((group) =>
            group.id === groupId
                ? {
                      ...group,
                      elements: [...group.elements, newElement],
                  }
                : group
        )
    );
};



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

    const [frGroups,setFrGroups] = useState([]);
    const [dirty, setDirty] = useState(false);

    const updateField = (key, value) => {
        setDirty(true);
        setFrGroups((prev) =>
            prev.map((group) => ({
                ...group,
                elements: group.elements.map((item) =>
                    item.id === selectedRange.id
                        ? {
                            ...item,
                            [key]: value,
                        }
                        : item
                ),
            }))
        );
    };


    const copyElement = (item) => {

        const newElement = {
            ...item,

            id:
                Date.now().toString() +
                Math.random().toString(36),

            x: item.x + 10,
            y: item.y + 10,
        };

        setFrGroups((prev) =>
            prev.map((group) =>
                group.id === item.group_id
                    ? {
                        ...group,

                        elements: [
                            ...group.elements,
                            newElement,
                        ],
                    }
                    : group
            )
        );
    };

    const deleteElement = (item) => {
        setDirty(true);
        setFrGroups((prev) =>
            prev.map((group) =>
                group.id === item.group_id
                    ? {
                        ...group,

                        elements:
                            group.elements.filter(
                                (e) =>
                                    e.id !== item.id
                            ),
                    }
                    : group
            )
        );
    };
/*
  const [frGroups,setFrGroups] = useState([
      {
          id: Date.now().toString(),
          fr_begin: 0,
          fr_end: 0,
          scale: 0.5,
          elements: [
              {
                  id: (Date.now() + Math.random()).toString(),
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                  label: "Empty",
                  label_left_position: 40,
                  label_top_position: 40,
                  bold: false,
                  italic: false,
                  bgColor: "#0081fa",
                  textColor: "#000000",
                  fontSize: 14,
                  rotate: 0,
                  fr_begin: 40,
                  fr_end: 50,
                  fr_text_rotate: 0,
                  fr_text_top: 0,
                  fr_text_left: 0,
                  fr_text_size: 14,
                  fr_text_color: "#000000",
                  fr_text_position: "top",
                  type: "Title",
                  borderBox: 1,
                  borderBoxColor: "#000000",
                  visible_begin: true,
                  visible_end: true,
                  fr_distinction: true,
                  measure: "kHz",
              },
          ],
      },
  ]);
*/


  

  /*
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
                  bold:false,
                  italic:false,
                  bgColor: "#0081fa",
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
                  type:"Title",
                  borderBox:1,
                  borderBoxColor:"#000000",
                  visible_begin:true,
                  visible_end:true,
                  fr_distinction:true,
                  measure:'kHz',
              }
          ]
    })

    */


   useEffect(()=>{
        console.log(defaultGroups,defaultPage,'DEFAULT');
        if (defaultGroups) {

            setFrGroups((prev) => [
                ...prev,
                ...defaultGroups
            ]);
        }

        if (defaultPage) {

            setPage((prev) => ({
                ...prev,
                ...defaultPage
            }));
        }
   },[]) 


  return (
    <AuthenticatedLayout
      sidebar={
      <Sidebar 
        page={page} 
        setPage={setPage} 
        setAddElementModal = {setAddElementModal}
        selectedRange={selectedRange}
        updateField={updateField}
        copyElement={copyElement}
        deleteElement={deleteElement}
        frGroups={frGroups}
        setDirty={setDirty}
        dirty={dirty}
      />
      }
      header={<Header />}
    >
        <Modal show={addElementModal} 
       // onClose={()=>setAddElementModal(false)} 
        maxWidth="7xl"
        closeable={false}
        >
            <RangeForm 
                setFrGroups={setFrGroups} 
                frGroups={frGroups} 
                pageWidth={width} 
                closeCallback={() =>
                    setAddElementModal(false)
                }
            />
        </Modal>

          <Modal show={activeGroup} onClose={()=>setActiveGroup(false)}>
            <UpdateGroup 
                activeGroup={activeGroup}  
                setFrGroups={setFrGroups} 
                frGroups={frGroups} 
                pageWidth={width} 
            />
        </Modal>

        <Modal show={textFormActive} onClose={()=>setTextFormActive(false)}>
                <TextForm  group_id={textFormActive}  setFrGroups={setFrGroups} frGroups={frGroups}/>
        </Modal>

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
                                

                                ...(page.isPrinting ? {} : {
                                    backgroundImage: `
                                        linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
                                    `,
                                    backgroundSize: "25px 25px",
                                })
                            }}

                         
                        >
                            {/* Контент внутри листа */}
                            <div className="text-black">
                                {
                                 
                                    <SpectrumGroup key={`group-${1}`} 
                                        frGroups={frGroups}
                                        setFrGroups={setFrGroups}
                                        activeGroup={activeGroup}
                                        setActiveGroup={setActiveGroup}
                                        selectedRange={selectedRange}
                                        setSelectedRange={setSelectedRange}
                                        page={page}
                                        setTextFormActive={setTextFormActive}
                                        setDirty={setDirty}
                                    />
                               
                                }
                            </div>
                        </div>
        
                    </div>

    </AuthenticatedLayout>
  )
}

export default Main