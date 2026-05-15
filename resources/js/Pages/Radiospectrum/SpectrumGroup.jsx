import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import SpectrumRange from "./SpectrumRange";
import { CircleArrowOutUpLeft, Trash2, Type,SquarePen,Copy } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import HeadLine from "./HeadLine";


export default function SpectrumGroup(props) {
    const {
        frGroups,
        setFrGroups,
        width,
        height,
        selectedRange,
        setSelectedRange,
        activeGroup,
        setActiveGroup,
        page,
        setTextFormActive,
        setDirty,
    } = props;

    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = (el) => {
        setSelectedIds((prev) =>
            prev.includes(el.id)
                ? prev.filter((id) => id !== el.id)
                : [...prev, el.id]
        );
    };

    // 🔥 FLATTEN ALL ELEMENTS FOR RENDER
    const allElements = frGroups.flatMap((group) =>
        group.elements.map((el) => ({
            ...el,
            group_id: group.id,
        }))
    );

    const sortedElements = [...allElements].sort(
        (a, b) => Number(b.order || 0) - Number(a.order || 0)
    );


    const handleResize = (
    groupId,
    id,
    newWidth,
    newHeight
) => {

    const MIN_WIDTH = 30;
    const ROW_GAP = 3;

    setFrGroups((prev) =>
        prev.map((group) => {

            if (group.id !== groupId) return group;

            let elements = [...group.elements];

            // текущий элемент
            const current = elements.find(
                (el) => el.id === id
            );

            if (!current) return group;

            // вся строка
            let rowElements = elements
                .filter(
                    (el) =>
                        Math.abs(el.y - current.y) <= ROW_GAP
                )
                .sort((a, b) => a.x - b.x);

            const currentIndex = rowElements.findIndex(
                (el) => el.id === current.id
            );

            // правый сосед
            const rightElement =
                rowElements[currentIndex + 1];

            // если последний элемент
            if (!rightElement) {

                elements = elements.map((el) => {

                    if (el.id === current.id) {

                        return {
                            ...el,
                            width: Math.max(
                                MIN_WIDTH,
                                newWidth
                            ),
                            height: newHeight,
                        };
                    }

                    return el;
                });

                return {
                    ...group,
                    elements,
                };
            }

            const diff = newWidth - current.width;

            let rightWidth =
                rightElement.width - diff;

            // ограничения
            if (rightWidth < MIN_WIDTH) {

                rightWidth = MIN_WIDTH;

                newWidth =
                    current.width +
                    (rightElement.width - MIN_WIDTH);
            }

            // обновляем widths
            rowElements = rowElements.map((el) => {

                // текущий
                if (el.id === current.id) {

                    return {
                        ...el,
                        width: newWidth,
                        height: newHeight,
                    };
                }

                // правый сосед
                if (el.id === rightElement.id) {

                    return {
                        ...el,
                        width: rightWidth,
                    };
                }

                return el;
            });

            // ПОЛНЫЙ пересчет X
            let currentX = rowElements[0].x;

            rowElements = rowElements.map((el, index) => {

                if (index === 0) {

                    currentX = el.x;

                    return el;
                }

                const updated = {
                    ...el,
                    x: currentX,
                };

                currentX += el.width;

                return updated;
            });

            // фикс для первого элемента
            currentX = rowElements[0].x;

            rowElements = rowElements.map((el) => {

                const updated = {
                    ...el,
                    x: currentX,
                };

                currentX += el.width;

                return updated;
            });

            // заменяем элементы строки
            elements = elements.map((el) => {

                const updatedRowEl = rowElements.find(
                    (r) => r.id === el.id
                );

                return updatedRowEl || el;
            });

            return {
                ...group,
                elements,
            };
        })
    );
};


   

    // 🔥 DELETE GROUP
    const deleteGroup = (group_id) => {
        setFrGroups((prev) =>
            prev.filter((g) => g.id !== group_id)
        );
    };

    const addTextElement = (group_id) => {
        setTextFormActive(true)  
    }

    const copyGroup = (group_id) => {
        setFrGroups((prev) => {

            const targetGroup = prev.find(
                (g) => g.id === group_id
            );

            if (!targetGroup) return prev;

            const newGroup = {
                ...targetGroup,
                id: Date.now().toString(),
                elements: targetGroup.elements.map((el) => ({
                    ...el,
                    id: Date.now().toString() + Math.random(),
                    x: el.x + 20, // небольшой сдвиг
                    y: el.y + 20,
                })),
            };

            return [...prev, newGroup];
        });
    };

    // 🔥 UPDATE SELECTED ELEMENT
    React.useEffect(() => {
        if (!selectedRange) return;

        const found = allElements.find(
            (el) => el.id === selectedRange.id
        );

        if (found && found !== selectedRange) {
            setSelectedRange(found);
        }
    }, [frGroups]);

    // 🔥 GROUP BUTTON
    function GroupButton({ group_id }) {
        const { attributes, listeners, setNodeRef } = useDraggable({
            id: "group_" + group_id,
        });

        return (
            <button
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className="w-6 h-6 flex items-center justify-center border rounded hover:bg-red-100"
            >
                <CircleArrowOutUpLeft size={16} />
            </button>
        );
    }

    return (
        <DndContext
            onDragEnd={( event ) => {
                const {active,delta} = event;
                setDirty(true);
                setFrGroups((prev) =>
                    prev.map((group) => {

                        // MOVE HEADLINE
                       
                        if (active.id === "headline_" + group.id) {
                            return {
                                ...group,
                                headLineX: (group.headLineX || 0) + delta.x,
                                headLineY: (group.headLineY || 0) + delta.y,
                            };
                        }
                     



                        const isGroup =
                            active.id === "group_" + group.id;

                        if (isGroup) {
                            return {
                                ...group,

                                headLineX: group.headLineX + delta.x,
                                headLineY: group.headLineY + delta.y,

                                elements: group.elements.map((el) => ({
                                    ...el,
                                    x: el.x + delta.x,
                                    y: el.y + delta.y,
                                })),
                            };
                        }

                        return {
                            ...group,
                            elements: group.elements.map((el) =>
                                el.id === active.id
                                    ? {
                                          ...el,
                                          x: el.x + delta.x,
                                          y: el.y + delta.y,
                                      }
                                    : el
                            ),
                        };
                    })
                );
            }}
        >
            <div
                className="relative border-2 bg-white"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                }}
            >
                {/* GROUP TOOLBAR */}
                {frGroups.map((group) => {
                    console.log(group,'GROUP');
                    const firstEl = group.elements[0];
                    if (!firstEl) return null;

                 

                    return (
                        <>
                           

                            {firstEl.type === "group_denomination" && (
                                <div
                                    key={group.id}
                                    style={{
                                        position: "absolute",
                                        left: firstEl.x,
                                        top: firstEl.y - 36,
                                        zIndex: 999,
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 bg-white border rounded shadow disable-on-pdf"
                                >
                                    <GroupButton group_id={group.id} />

                                    <button
                                        onClick={() => deleteGroup(group.id)}
                                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveGroup(group)
                                        }
                                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-green-100"
                                    >
                                
                                        <SquarePen  size={16} />

                                    </button>
                                    <button  
                                    onClick={() =>copyGroup(group.id)}
                                    className="w-6 h-6 flex items-center justify-center border rounded hover:bg-green-100">
                                            <Copy size={16}/>
                                    </button>
                                    
                                     <button
                                        onClick={() => setTextFormActive(group.id)}
                                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-green-100">
                                   
                                       <Type />
                                    </button>
                                </div>
                            )}
                        </>
                        
                    );
                })}

                {/* ELEMENTS */}
                {sortedElements.map((el) => (
                    <>
                   
                        <SpectrumRange
                        key={el.id}
                        el={el}
                        selectedIds={selectedIds}
                        selectedRange={selectedRange}
                        clickHandler={() => {
                            setSelectedRange(el);
                            toggleSelect(el);
                        }}
                        onResize={(id, w, h) =>
                            handleResize(el.group_id, id, w, h)
                        }
                        range = {el}
                        page = {page}

                    />
                    </>
                    
                    
                ))}
            </div>
        </DndContext>
    );
}