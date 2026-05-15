import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function ElementItem({ el, clickHandler, onResize,selecttedElement,selectedIds }) {
    
    const { attributes, listeners, setNodeRef, transform,isDragging} = useDraggable({
        id: el.id,
    });

    // ✅ SAFE VALUES (анти NaN)
    const x = Number.isFinite(el.x) ? el.x : 0;
    const y = Number.isFinite(el.y) ? el.y : 0;
    const width = Number.isFinite(el.width) ? el.width : 100;
    const height = Number.isFinite(el.height) ? el.height : 100;

 


     const style = {
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        background: el.bgColor || "#60a5fa",
        color: "#fff",
        borderRadius: "2px",
        cursor: "grab",
        boxSizing: "border-box",
        userSelect: "none",
        zIndex: isDragging ? 100 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       // border:(selecttedElement?.id == el?.id) ? "2px solid #01d235":"2px solid #353535",
        
        border:(el.type=="title" && el.isPrinting) ? "0" :el.isPrinting ? "1px solid #353535" : selectedIds?.includes(el?.id) ? "2px solid #01d235":"2px solid #353535",
        
        
       
        fontSize: el.fontSize || 14,
        color: el.textColor || "#000000",
    };


    // 🔧 RESIZE (через pointer events)
    const handleResizeMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startW = width;
        const startH = height;

        

        const onMove = (ev) => {

            let newW = startW + (ev.clientX - startX);
            let newH = startH + (ev.clientY - startY);

            // ✅ защита
            newW = Math.max(10, Number.isFinite(newW) ? newW : 100);
            newH = Math.max(10, Number.isFinite(newH) ? newH : 100);

            onResize(el.id, newW, newH);
        };

        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    };


    const handleResizeMouseDown1 = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startW = width;
        const startH = height;

        const groupId = el.group_id; // 👈 добавили

        const onMove = (ev) => {
            let newW = startW + (ev.clientX - startX);
            let newH = startH + (ev.clientY - startY);

            newW = Math.max(10, Number.isFinite(newW) ? newW : 100);
            newH = Math.max(10, Number.isFinite(newH) ? newH : 100);

            onResize(el.id, groupId, newW, newH); // 👈 передаём
        };

        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    };

    return (
        <div
            
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onPointerUp={() => clickHandler()}
        >
        {
        /*
            <p
            style={{ 
                transform: `rotate(${el.rotate}deg)`,
                fontWeight: el.bold ? "bold" : "normal",
                fontStyle: el.italic ? "italic" : "normal",
                
                display: "flex",
                alignItems: "center",     // вертикально
                justifyContent: "center", // горизонтально
                width: "100%",
                height: "100%",
                margin: 0
            }}
            >
                {el.label}
            </p>
            */
        }

            <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: el.width,
                height: el.height
            }}
            >
                <span style={{ 
                    display:"none",
                    margin: 0,
                    transform: `rotate(${el.rotate}deg)`,
                    fontWeight: el.bold ? "bold" : "normal",
                    fontStyle: el.italic ? "italic" : "normal",
                    }}>{el.label}
                </span>

                <span
                    style={{
                        position: "absolute",
                        left: el.label_left_position ? `${el.label_left_position}%` : "40%",
                        top: el.label_top_position ? `${el.label_top_position}%` : "40%",
                        display: "inline-block",
                        transform: `translate(-50%, -50%) rotate(${el.rotate}deg)`,
                        transformOrigin: "center",
                        fontSize: el.fontSize || 14,
                        fontWeight: el.bold ? "bold" : "normal",
                        fontStyle: el.italic ? "italic" : "normal",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    {el.label}
                </span>
            </div>
            

            {/* 🔻 Resize handle */}
            <div
              
                onPointerDown={handleResizeMouseDown}

                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 10,
                    height: 10,
                    background: "#fff",
                    cursor: "nwse-resize",
                    zIndex: 200,
                }}
                className="disable-on-pdf"
            />

            {/* 🔢 УГЛЫ С ТЕКСТОМ */}
            
            {
                (el.fr_distinction) ? 
                    <span
                    style={{
                    position: "absolute",
                    top: -22,
                    fontSize: el?.fr_text_size ??  12,
                    color: el?.fr_text_color ??  "#000000",
                }}
                    >
                        {el.fr_end - el.fr_begin} {el.measure}
                    </span>
                : ""
            }
            {
                (el.fr_text_position=="top") ?
            <span>
                <span style={{
                    position: "absolute",
                   //top: -22,
                   //left: -15,
                    top:el?.fr_text_top ?? -22,
                    left:el?.fr_text_left ?? -15,
                    fontSize: el?.fr_text_size ??  12,
                    color: el?.fr_text_color ??  "#000000",
                    transform: `rotate(${el.fr_text_rotate}deg)`
                }}>
               
                {
                    (el.fr_begin === 0 || el.fr_begin === null || el.fr_begin === undefined)
                    ? ""
                    : el.visible_begin ?  el.fr_begin : ""
                }
                   
                </span>

            
                <span style={{
                    position: "absolute",
                   // top: -22,
                   // right: -15,
                    top:el?.fr_text_top ?? -22,
                    right:el?.fr_text_left ?? -15,
                    fontSize: el?.fr_text_size ??  12,
                    color: el?.fr_text_color ??  "#000000",
                    transform: `rotate(${el.fr_text_rotate}deg)`
                }}>
                    {
                       (el.fr_end === 0 || el.fr_end === null || el.fr_end === undefined)
                        ? ""
                        : el.visible_end ?  el.fr_end : ""
                    }
                </span>
            </span>
            :

            <span>
                <span style={{
                    position: "absolute",
                   // bottom: -22,
                  //  left: -15,

                    bottom:el?.fr_text_top ?? -22,
                    left:el?.fr_text_left ?? -15,
                    fontSize: el?.fr_text_size ??  12,
                    color: el?.fr_text_color ??  "#000000",
                    transform: `rotate(${el.fr_text_rotate}deg)`
                }}>
                    {
                        (el.fr_begin === 0 || el.fr_begin === null || el.fr_begin === undefined)
                        ? ""
                        :el.visible_begin ?  el.fr_begin : ""
                    }
                </span>
                <span style={{
                    position: "absolute",
                   //bottom: -22,
                   //right: -15,
                    bottom:el?.fr_text_top ?? -22,
                    right:el?.fr_text_left ?? -15,
                    fontSize: el?.fr_text_size ??  12,
                    color: el?.fr_text_color ??  "#000000",
                    transform: `rotate(${el.fr_text_rotate}deg)`
                }}>
                    {
                       (el.fr_end === 0 || el.fr_end === null || el.fr_end === undefined)
                        ? ""
                        : el.visible_end ?  el.fr_end : ""
                    }
                </span>  
            </span>
             
            }
        </div>
    );
}