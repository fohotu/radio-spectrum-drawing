import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function ElementItem({ el,clickHandler }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: el.id,
    });

    const style = {
        position: "absolute",
        left: el.x,
        top: el.y,
        transform: CSS.Translate.toString(transform),
        background: "#60a5fa",
        color: "#fff",
        padding: "10px",
        borderRadius: "6px",
        cursor: "grab",
    };

    return (
        <div  ref={setNodeRef} style={style} {...listeners} {...attributes} onPointerUp={() => clickHandler()}  >
            {el.label}
        </div>
    );
}