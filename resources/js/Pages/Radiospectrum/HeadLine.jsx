import React from 'react';
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function HeadLine({el,clickHandler}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: el.id,
    });

   console.log(el);

    const style = {
        position: "absolute",
        left: el.x,
        top: el.y,
        transform: CSS.Translate.toString(transform),
        background: "#ffffff",
        color: "#000000",
        padding: "10px",
        border:el.isPrinting ? "0" : "1px solid #000",
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} 
        {...listeners} 
        {...attributes} 
        onPointerUp={() => clickHandler()}
        >
            {el.label}
        </div>
    );
}



export default HeadLine