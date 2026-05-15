import React,{useState,useEffect} from 'react';
import { DndContext } from "@dnd-kit/core";
import ElementItem from "./ElementItem";
import { CircleArrowOutUpLeft,Trash2,Plus } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";



export default function ElementBox(props) {

    
    const {elements, 
        setElements,
        width, 
        height,
        selecttedElement,
        setSelectedElement,
        activeGroup,
        setActiveGroup
    } = props;
    const [selectedIds, setSelectedIds] = useState([]);
    const [startPositions, setStartPositions] = useState({});
    const toggleSelect = (el) => {
        setSelectedIds((prev) =>
            prev.includes(el.id)
            ? prev.filter((id) => id !== el.id)
            : [...prev, el.id]
        );
    };

    const [btnGroup,setBtnGroup] = useState([]);

    const uniqueGroups = [...new Set(elements.map(el => el.group_id))];

    /*
   const handleResize = (id, width, height) => {
        setElements((prev) =>
            prev.map((el) =>
                el.id === id ? { ...el, width,height } : el
            )
        );

       // console.log(id,width,height);

    };

    */

    const handleResize = (id, width, height) => {
        setElements((prev) =>
            prev.map((el) => {
                /*


                // если есть группа — ресайзим всех
                if (groupId && el.group_id === groupId) {
                    return { ...el, width, height };
                }

                */

                // если нет группы — только один элемент
                if (el.id === id) {
                    return { ...el, width, height };
                }

                return el;
            })
        );
    };

    useEffect(() => {
        if (!selecttedElement) return;
        const updated = elements.find(el => el.id === selecttedElement.id);
        if (updated && updated !== selecttedElement) {
            setSelectedElement(updated);
        }
        
       
    }, [elements]);

    const sortedElements = [...elements].sort(
        (a, b) => Number(b.order) - Number(a.order)
    );

    console.log(sortedElements,elements);

  function GroupButton({ group_id, x, y }) {
        
        const { attributes, listeners, setNodeRef } = useDraggable({
            id: "group_" + group_id,
        });

        return (
            <button
            key={'k_'+Date.now().toString()}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
          
            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-red-100 disable-on-pdf"
            onMouseDown={()=>{

            }}
            onMouseUp={()=>{

            }}
            onMouseLeave={()=>{

            }}
            >
            <CircleArrowOutUpLeft />
            </button>
        );
        }


    function getGroupPosition(elements, group_id) {
        const group = elements.filter(el => el.group_id === group_id);

        if (!group.length) return { x: 0, y: 0 };

        const minX = Math.min(...group.map(e => e.x));
        const minY = Math.min(...group.map(e => e.y));

        return { x: minX, y: minY };
    }

    const group_id = elements?.[0]?.group_id;
    const { x, y } = getGroupPosition(elements, group_id);

    const deleteGroup = (group_id) => {
        setElements((prev) =>
            prev.filter((el) => el.group_id !== group_id)
        );
    };

    return (
        <DndContext
         
            onDragEnd={({ active, delta }) => {
    setElements((prev) =>
        prev.map((el) => {
            // группа
            if (active.id.startsWith("group_")) {
                const group_id = active.id.replace("group_", "");

                if (el.group_id === group_id) {
                    return {
                        ...el,
                        x: el.x + delta.x,
                        y: el.y + delta.y,
                    };
                }
            }

            // одиночный
            if (el.id === active.id) {
                return {
                    ...el,
                    x: el.x + delta.x,
                    y: el.y + delta.y,
                };
            }

            return el;
        })
    );
}}
            /*
            onDragEnd={(event) => {
            const { active, delta } = event;
            setElements((prev) =>
                prev.map((el) => {
                // 👇 если двигаем группу
                if (active.id.startsWith("group_")) {
                    const group_id = active.id.replace("group_", "");
                    if (el.group_id === group_id) {
                        return {
                            ...el,
                            x: el.x + delta.x,
                            y: el.y + delta.y,
                        };
                    }
                }
                // 👇 обычный drag
                if (el.id === active.id) {
                    return {
                    ...el,
                    x: el.x + delta.x,
                    y: el.y + delta.y,
                    };
                }
                return el;
                })
            );
            }}
            */
            /*
            onDragEnd={(event) => {
            const { active, delta } = event;

            setElements((prev) =>
            prev.map((el) => {
                //const isGroup = selectedIds.includes(active.id) && selectedIds.includes(el.id);
                const isGroup = false;
                const shouldMove =
                el.id === active.id || isGroup;

                if (!shouldMove) return el;

                return {
                ...el,
                x: el.x + delta.x,
                y: el.y + delta.y,
                };
            })
            );
             }}   
             */ 

            /*
            onDragEnd={(event) => {
                const { active, delta } = event;

                setElements((prev) =>
                    prev.map((el) =>
                        el.id === active.id
                            ? {
                                  ...el,
                                  x: el.x + delta.x,
                                  y: el.y + delta.y,
                              }
                            : el
                    )
                );
            }}
            */
        >
            {/* Canvas внутри A4 */}
            <div className="relative border-2 bg-white"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    transformOrigin: "center",
                }}
            >
              
                 <>
                    {uniqueGroups.map(group_id => {
                        const el = elements.find(e => e.group_id === group_id);

                        return (
                            <>
                                {
                                    el.type == "group_denomination" ?
                                        <div
                                            style={{
                                                position: "absolute",
                                                left: el.x,
                                                top: el.y - 36,
                                                zIndex: 999,
                                            }}
                                            className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm disable-on-pdf"
                                            >
                                            <GroupButton
                                                group_id={el.group_id}
                                            />

                                            <button
                                                onClick={() => deleteGroup(el.group_id)}
                                                className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-red-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <button
                                                onClick={() => setActiveGroup(el.group_id)}
                                                className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-green-100"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    :""
                                }
                            </>
                            
                        );
                    })}
                </>
                
                {sortedElements.map((el,index) => {
                    return <>
                            <ElementItem 
                                key={el.id ?? Date.now().toString()}
                                el={el}
                                selectedIds={selectedIds}
                                onResize={handleResize} 
                                clickHandler={() => {
                                    setSelectedElement(el);  
                                    toggleSelect(el);
                                    console.log(selectedIds);
                                }}
                                selecttedElement = {selecttedElement}
                            />
                    </> 
                        
                    
                })}
               
            </div>
        </DndContext>
    );
}