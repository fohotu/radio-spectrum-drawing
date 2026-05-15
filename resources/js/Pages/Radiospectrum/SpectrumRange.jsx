import React from 'react'
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function SpectrumRange(props) {
    console.log(props,'RANGE');

  const {range,clickHandler,onResize,selecttedElement,page} = props;

  //el, clickHandler, onResize,selecttedElement,selectedIds
  const selectedIds = [];
  
    console.log(range);
  const { attributes, listeners, setNodeRef, transform,isDragging} = useDraggable({
          id: range.id,
      });
  
      // ✅ SAFE VALUES (анти NaN)
      const x = Number.isFinite(Number(range.x)) ? Number(range.x) : 0;
      const y = Number.isFinite(Number(range.y)) ? Number(range.y) : 0;
      const width = Number.isFinite(Number(range.width)) ? Number(range.width) : 100;
      const height = Number.isFinite(Number(range.height)) ? Number(range.height) : 100;
  
   
  
  
       const style = {
          position: "absolute",
          left: range.x,
          top: range.y,
          width,
          height,
         
         // transform: transform ? CSS.Translate.toString(transform) : undefined,
         transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,

          background: range.bgColor || "#60a5fa",
          color: "#fff",
          cursor: "grab",
          boxSizing: "border-box",
          userSelect: "none",
          zIndex: isDragging ? 100 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          
       // border:(range.type=="title" && page.isPrinting) ? "0" :page.isPrinting ? "1px solid #353535" : selectedIds?.includes(range?.id) ? "2px solid #01d235":"2px solid #353535",
          
            
         
          fontSize: range.fontSize || 14,
          color: range.textColor || "#000000",
      };
      if(range.type=="title" && page.isPrinting) 
        style.border=0;
      else{
        style.borderTop=range.visible_border_top ? `${range.border_top_value}px solid ${range.borderColor}`:"0";
        style.borderRight=range.visible_border_right ? `${range.border_right_value}px solid ${range.borderColor}`:"0";
        style.borderBottom=range.visible_border_bottom ? `${range.border_bottom_value}px solid ${range.borderColor}`:"0";
        style.borderLeft=range.visible_border_left ? `${range.border_left_value}px solid ${range.borderColor}`:"0";
        style.borderColor=range.borderColor ?? "#000";
      }
     

  
  
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
  
              onResize(range.id, newW, newH);
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


            <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: range.width,
                height: range.height
            }}
            >
                <span style={{ 
                    display:"none",
                    margin: 0,
                    transform: `rotate(${range.rotate}deg)`,
                    fontWeight: range.bold ? "bold" : "normal",
                    fontStyle: range.italic ? "italic" : "normal",
                    }}>{range.label}
                </span>

                <span
                    style={{
                        position: "absolute",
                        left: range.label_left_position ? `${range.label_left_position}%` : "40%",
                        top: range.label_top_position ? `${range.label_top_position}%` : "40%",
                        display: "inline-block",
                        transform: `translate(-50%, -50%) rotate(${range.rotate}deg)`,
                        transformOrigin: "center",
                        fontSize: range.fontSize || 14,
                        fontWeight: range.bold ? "bold" : "normal",
                        fontStyle: range.italic ? "italic" : "normal",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        textAlign:"center",
                    }}
                >
                    {range.label}
                    <p
                        className="mt-1"
                        dangerouslySetInnerHTML={{
                            __html: range.description
                        }}
                    ></p>
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
                (range.fr_distinction) ? 
                    <span
                    style={{
                    position: "absolute",
                    top: -22,
                    fontSize: range?.fr_text_size ??  12,
                    color: range?.fr_text_color ??  "#000000",
                }}
                    >
                        {range.fr_end - range.fr_begin} {range.measure}
                    </span>
                : ""
            }
       
            {
                (range.fr_text_position=="top") ?
            <span>
                <span style={{
                    position: "absolute",
                   //top: -22,
                   //left: -15,
                    top:range?.fr_text_top ?? -22,
                    left:range?.fr_text_left ?? -15,
                    fontSize: range?.fr_text_size ??  12,
                    color: range?.fr_text_color ??  "#000000",
                    transform: `rotate(${range.fr_text_rotate}deg)`
                }}>
               
                {
                    (range.fr_begin === 0 || range.fr_begin === null || range.fr_begin === undefined)
                    ? ""
                    : range.visible_begin ?  range.fr_begin : ""
                }
                   
                </span>

            
                <span style={{
                    position: "absolute",
                   // top: -22,
                   // right: -15,
                    top:range?.fr_text_top ?? -22,
                    right:range?.fr_text_left ?? -15,
                    fontSize: range?.fr_text_size ??  12,
                    color: range?.fr_text_color ??  "#000000",
                    transform: `rotate(${range.fr_text_rotate}deg)`
                }}>
                    {
                       (range.fr_end === 0 || range.fr_end === null || range.fr_end === undefined)
                        ? ""
                        : range.visible_end ?  range.fr_end : ""
                    }
                </span>
            </span>
            :
            <span>
                <span style={{
                    position: "absolute",
                   //bottom: -22,
                  //left: -15,
                    bottom:range?.fr_text_top ?? -22,
                    left:range?.fr_text_left ?? -15,
                    fontSize: range?.fr_text_size ??  12,
                    color: range?.fr_text_color ??  "#000000",
                    transform: `rotate(${range.fr_text_rotate}deg)`
                }}>
                    {
                        (range.fr_begin === 0 || range.fr_begin === null || range.fr_begin === undefined)
                        ? ""
                        :range.visible_begin ?  range.fr_begin : ""
                    }
                </span>
                <span style={{
                    position: "absolute",
                   //bottom: -22,
                   //right: -15,
                    bottom:range?.fr_text_top ?? -22,
                    right:range?.fr_text_left ?? -15,
                    fontSize: range?.fr_text_size ??  12,
                    color: range?.fr_text_color ??  "#000000",
                    transform: `rotate(${range.fr_text_rotate}deg)`
                }}>
                    {
                       (range.fr_end === 0 || range.fr_end === null || range.fr_end === undefined)
                        ? ""
                        : range.visible_end ?  range.fr_end : ""
                    }
                </span>  
            </span>
             
            }
        </div>
  )
}

export default SpectrumRange