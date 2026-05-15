import React from 'react';
import { Plus, Save, FileUp,Trash2, Copy } from "lucide-react";
import Editor from './Editor';

function SelectedRangeForm(props) {
    const {selectedRange,updateField,deleteElement,copyElement} = props;
  return (
    <div>
        {
                        selectedRange ?
                             <div className="border-t border-gray-700 pt-4">
                                    <div style={{"display":"none"}} className="flex justify-end gap-2 pb-5">
                                        <button  onClick={()=>deleteElement(selectedRange)} className="flex flex-col items-center1 justify-center gap-1 bg-gray-700 hover:bg-red-600 rounded-lg p-3 transition">
                                            <Trash2 size={18} />
                                            
                                        </button>

                                        <button onClick={()=>copyElement(selectedRange)} className="flex flex-col items-center justify-center1 gap-1 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition">
                                            <Copy size={18} />
                                          
                                        </button>
                                    </div>

                                    <div className="flex justify-end  bg-gray-800">

                                            {/* DELETE */}
                                            <button
                                                onClick={() => deleteElement(selectedRange)}
                                                className="
                                                    w-12 h-12
                                                    flex items-center justify-center
                                                    text-gray-200
                                                    hover:bg-red-600
                                                    transition
                                                    border border-gray-700
                                                    my-5
                                                "
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            {/* COPY */}
                                            <button
                                                onClick={() => copyElement(selectedRange)}
                                                className="
                                                    w-12 h-12
                                                    flex items-center justify-center
                                                    text-gray-200
                                                    hover:bg-gray-700
                                                    transition
                                                    border border-gray-700
                                                    my-5
                                                "
                                            >
                                                <Copy size={18} />
                                            </button>

                                        </div>
                                    {/* Label */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className="text-sm text-gray-400">Label</label>
                                        <input
                                            value={selectedRange?.label ?? ""}
                                            onChange={(e) => updateField("label", e.target.value)}
                                             className="
                                            w-full h-10
                                            bg-gray-800
                                            text-white
                                            text-sm
                                            px-3
                                            border border-gray-700
                                            outline-none
                                            transition
                                            focus:border-gray-500
                                            hover:bg-gray-750
                                        "
                                        />
                                    </div>

                                     <div className="grid grid-cols-1 gap-2">
                                        <label className="text-sm text-gray-400">Description</label>
                                        <Editor callBack={updateField} defaultValue={selectedRange?.description ?? ""} />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Label Left Position</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={selectedRange?.label_left_position ?? ""}
                                            onChange={(e) => updateField("label_left_position", Number(e.target.value))}
                                            className="w-full"
                                            style={{"display":"none"}}
                                        />
                                       <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={selectedRange?.label_left_position ?? ""}
                                        onChange={(e) =>
                                            updateField("label_left_position", Number(e.target.value))
                                        }
                                        className="
                                            w-full h-10
                                            bg-gray-800
                                            text-white
                                            text-sm
                                            px-3
                                            border border-gray-700
                                            outline-none
                                            transition
                                            focus:border-gray-500
                                            hover:bg-gray-750
                                        "
                                    />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Label Top Position</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={selectedRange?.label_top_position ?? ""}
                                            onChange={(e) => updateField("label_top_position", Number(e.target.value))}
                                            className="w-full"
                                            style={{"display":"none"}}
                                        />

                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={selectedRange?.label_top_position ?? ""}
                                            onChange={(e) =>
                                                updateField("label_top_position", Number(e.target.value))
                                            }
                                            className="
                                                w-full h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                        />
                                    </div>

                                    {/* Rotate */}
                                    <div>
                                        <label className="text-sm text-gray-400">Rotate Label {selectedRange?.rotate ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selectedRange?.rotate ?? ""}
                                            onChange={(e) => updateField("rotate", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mt-5">
                                        <label className="text-sm text-gray-400">Bold</label>
                                        <input
                                            type="checkbox"
                                            value={selectedRange?.bold ?? ""}
                                            onChange={(e) =>{ updateField("bold", e.target.checked) } }
                                            className="p-2 bg-gray-700 rounded"
                                        />
                                        <label className="text-sm text-gray-400">Cursor {selectedRange?.italic ?? "1"}</label>
                                        <input
                                            type="checkbox"
                                            value={selectedRange?.italic ?? ""}
                                            onChange={(e) => updateField("italic", e.target.checked)}
                                            className="p-2 bg-gray-700 rounded"
                                        />
                                    </div>
                                    
                                
                                    {/* Position */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Position X</label>
                                        <input
                                            type="number"
                                            value={Number(parseInt(selectedRange?.x || 0))}
                                            onChange={(e) => updateField("x", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                            placeholder="X"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-4">   
                                        <label className="text-sm text-gray-400 ">Position Y</label>
                                        <input
                                            type="number"
                                            value={Number(parseInt(selectedRange?.y || 0))}
                                            onChange={(e) => updateField("y", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                            placeholder="Y"
                                        />
                                    </div>

                                    {/* Size */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Width</label>
                                        <input
                                            type="number"
                                            value={Number(parseInt(selectedRange?.width || 0))}
                                            onChange={(e) => {
                                                    updateField("width", Number(e.target.value))
                                            }}
                                        // onChange={elements.find(el => el.id === selecttedRange?.id)?.w ?? ""}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                            placeholder="Width"
                                        />
                                        <label className="text-sm text-gray-400">Height</label>
                                        <input
                                            type="number"
                                            value={Number(parseInt(selectedRange?.height || 0))}
                                            onChange={(e) => updateField("height", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                            placeholder="Height"
                                        />
                                    </div>


                                     {/* Frame text */}
                                     <p>Border</p>
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">
                                            
                                            <input type="checkbox"  
                                            checked={selectedRange?.visible_border_top ?? false}
                                            onChange={(e) =>{ updateField("visible_border_top", e.target.checked) } }
                                            className="mr-2 p-2 bg-gray-700 rounded"

                                            />
                                           Top
                                        </label>
                                        <input
                                            type="number"
                                             min="1"
                                            max="5"
                                            value={selectedRange?.border_top_value ?? ""}
                                            onChange={(e) => updateField("border_top_value", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                           
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">
                                            
                                            <input type="checkbox"  
                                            checked={selectedRange?.visible_border_right ?? false}
                                            onChange={(e) =>{ updateField("visible_border_right", e.target.checked) } }
                                            className="mr-2  p-2 bg-gray-700 rounded"

                                            />
                                           Right
                                        </label>
                                        <input
                                            type="number"
                                             min="1"
                                            max="5"
                                            value={selectedRange?.border_right_value ?? ""}
                                            onChange={(e) => updateField("border_right_value", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                          
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">
                                            
                                            <input type="checkbox"  
                                            checked={selectedRange?.visible_border_bottom ?? false}
                                            onChange={(e) =>{ updateField("visible_border_bottom", e.target.checked) } }
                                            className="mr-2  p-2 bg-gray-700 rounded"

                                            />
                                           Bottom
                                        </label>
                                        <input
                                            type="number"
                                             min="1"
                                            max="5"
                                            value={selectedRange?.border_bottom_value ?? ""}
                                            onChange={(e) => updateField("border_bottom_value", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                           
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">
                                            
                                            <input type="checkbox"  
                                            checked={selectedRange?.visible_border_left ?? false}
                                            onChange={(e) =>{ updateField("visible_border_left", e.target.checked) } }
                                            className="mr-2  p-2 bg-gray-700 rounded"

                                            />
                                            Left
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={selectedRange?.border_left_value ?? ""}
                                            onChange={(e) => updateField("border_left_value", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                          
                                        />
                                    </div>
                                     {/* Colors */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Border Color</label>
                                        <input
                                            type="color"
                                            value={selectedRange?.borderColor ?? ""}
                                            onChange={(e) => updateField("borderColor", e.target.value)}
                                            className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        />
                                    </div>

                                    {/* Colors */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Background Color</label>
                                        <input
                                            type="color"
                                            value={selectedRange?.bgColor ?? ""}
                                            onChange={(e) => updateField("bgColor", e.target.value)}
                                            className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Text Color</label>
                                        <input
                                            type="color"
                                            value={selectedRange?.textColor ?? ""}
                                            onChange={(e) => updateField("textColor", e.target.value)}
                                            className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        />
                                    </div>

                                    {/* Font size */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">Font Size</label>
                                        
                                        <input
                                            type="number"
                                            value={selectedRange?.fontSize ?? ""}
                                            onChange={(e) => updateField("fontSize", Number(e.target.value))}
                                            className="w-full h-10 bg-gray-800 text-white text-sm px-3 border border-gray-700 outline-none transition focus:border-gray-500 hover:bg-gray-750"
                                            placeholder="Font Size"
                                        />
                                    </div>

                                    

                                    {/* Frame text */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <label className="text-sm text-gray-400">
                                            RF Begin
                                            <input type="checkbox"  
                                            checked={selectedRange?.visible_begin ?? false}
                                            onChange={(e) =>{ updateField("visible_begin", e.target.checked) } }
                                            className="ml-2 p-2 bg-gray-700 rounded"

                                            />
                                        </label>
                                        <input
                                            type="number"
                                            value={selectedRange?.fr_begin ?? ""}
                                            onChange={(e) => updateField("fr_begin", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                            placeholder="fr_begin"
                                        />
                                        <label className="text-sm text-gray-400">RF End
                                            <input type="checkbox"  
                                            checked={selectedRange?.visible_end ?? false}
                                            onChange={(e) =>{ updateField("visible_end", e.target.checked) } }
                                            className="ml-5 p-2 bg-gray-700 rounded"

                                            />
                                        </label>
                                        <input
                                            type="number"
                                            value={selectedRange?.fr_end ?? ""}
                                            onChange={(e) => updateField("fr_end", Number(e.target.value))}
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                            placeholder="fr_end"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        {/* Frame text size */}
                                        <label className="text-sm text-gray-400">RF Font Size</label>
                                        <input
                                            type="number"
                                            value={selectedRange?.fr_text_size ?? ""}
                                            onChange={(e) =>
                                                updateField("fr_text_size", Number(e.target.value))
                                            }
                                            className="w-full
                                                h-10
                                                bg-gray-800
                                                text-white
                                                text-sm
                                                px-3
                                                border border-gray-700
                                                outline-none
                                                transition
                                                focus:border-gray-500
                                                hover:bg-gray-750
                                            "
                                            placeholder="Text Size"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        {/* Frame text color */}
                                        <label className="text-sm text-gray-400">RF Text Color</label>
                                        <input
                                            type="color"
                                            value={selectedRange?.fr_text_color ?? ""}
                                            onChange={(e) =>
                                                updateField("fr_text_color", e.target.value)
                                            }
                                            className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        {/* Frame text color */}
                                        <label className="text-sm text-gray-400">RF Text Position</label>
                                        <select 
                                        className="w-full h-10 border-0 p-0 bg-transparent cursor-pointer"
                                        onChange={(e) =>
                                                updateField("fr_text_position", e.target.value)
                                        }
                                        value={selectedRange?.fr_text_position ?? ""}>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                        </select>
                                    
                                    </div>

                                     <div>
                                     

                                        <label className="text-sm text-gray-400">Show Fr Distinction
                                            <input type="checkbox"  
                                            checked={selectedRange?.fr_distinction ?? false}
                                            onChange={(e) =>{ updateField("fr_distinction", e.target.checked) } }
                                            className="ml-5 p-2 bg-gray-700 rounded"

                                            />
                                        </label>
                                    </div>
                                    {/* Rotate */}
                                    <div>
                                        <label className="text-sm text-gray-400">Fr Text Rotate {selectedRange?.fr_text_rotate ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selectedRange?.fr_text_rotate ?? ""}
                                            onChange={(e) => updateField("fr_text_rotate", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Fr Text left {selectedRange?.fr_text_left ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selectedRange?.fr_text_left ?? ""}
                                            onChange={(e) => updateField("fr_text_left", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Fr Text Top {selectedRange?.fr_text_top ?? 0}</label>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            value={selectedRange?.fr_text_top ?? ""}
                                            onChange={(e) => updateField("fr_text_top", Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                   
                                

                                
                            </div>
                        :<></>
                    }   
    </div>
  )
}

export default SelectedRangeForm