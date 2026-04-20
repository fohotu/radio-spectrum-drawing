import React,{useState} from 'react';
import { DndContext } from "@dnd-kit/core";
import ElementItem from "./ElementItem";


export default function ElementBox(props) {

    const {elements, setElements,width, height,setSelectedElement } = props;

    return (
        <DndContext
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
        >
            {/* Canvas внутри A4 */}
            <div className="relative border-2 bg-gray-200"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    transformOrigin: "center",
                }}
            >
                {elements.map((el) => (
                    <ElementItem key={el.id} el={el} clickHandler={() => setSelectedElement(el)} />
                ))}
            </div>
        </DndContext>
    );
}