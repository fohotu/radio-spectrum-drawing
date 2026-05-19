import { useState } from "react";
import { Trash2 } from "lucide-react";
import {element as DefaultElement} from "./Default";
import { usePage } from "@inertiajs/react";
export default function RangeForm(props) {

    const {setFrGroups,frGroups,pageWidth,closeCallback} = props;  

    const {translations} = usePage().props;

    const [rows, setRows] = useState([
       /* {
            id: Date.now().toString(),
            fr_begin: 0,
            fr_end: 0,
            label: "Empty",
            measure: "kHz",
            bgColor: "#0081fa",
            order: 1,
            heightRow: 100,
            visible_border_top:true,
            visible_border_right:true,
            visible_border_bottom:true,
            visible_border_left:false,
            border_top_value:1,
            border_right_value:1,
            border_bottom_value:1,
            border_left_value:1,
            borderColor:'#000000',
        },*/
        {
            ...DefaultElement
        }
        
    ]);
    
    const[scale,setScale] = useState(0.5);
    const [groupHeadLine1,setGroupHeadLine1] = useState({
        id: "title-"+(Date.now() + Math.random()).toString(),
        type:"title",
        label:"",
        x:10,
        y:-100,
        width:200,
        height:50,
        visible_begin:false,
        visible_end:false,
        bgColor: "#ffffff",
        visible_border_top:true,
        visible_border_right:true,
        visible_border_bottom:true,
        visible_border_left:true,
        border_top_value:1,
        border_right_value:1,
        border_bottom_value:1,
        border_left_value:1,
        borderColor:'#000000',
});
 const [groupHeadLine,setGroupHeadLine] = useState({
    ...DefaultElement,
    id: "title-"+(Date.now() + Math.random()).toString(),
    type:"title",
    label:"",
    visible_border_left:true,
    bgColor: "#ffffff",
    x:10,
    y:-100,
    width:200,
    height:50,
 })



    function getMinMax(ranges) {
        let min = Infinity;
        let max = -Infinity;

        ranges.forEach(r => {
            const begin = Number(r.fr_begin);
            const end = Number(r.fr_end);

            if (!isNaN(begin) && begin < min) {
            min = begin;
            }

            if (!isNaN(end) && end > max) {
            max = end;
            }
        });

        return {
            min: min === Infinity ? null : min,
            max: max === -Infinity ? null : max
        };
        }

    const cordinate = (data) => {
        const sorted = data.sort((a, b) => Number(a.order) - Number(b.order));

       
        const {min,max} = getMinMax(data);
        const total = max-min;
     

        let r = sorted.map((item) => {

           
            const start = (item.fr_begin - min) / total * pageWidth * scale;  
            const end = ((item.fr_end - min) / total) * pageWidth * scale;

   
            const width = end - start;

            //const height_diff = item.heightRow ?? 1;
            //const height = 100 / height_diff;

            const height = item.heightRow ?? 100;
       
            const y = (item.order-1) * height;
        
            return {
                ...item,
                type:"group_denomination",
                x:start,
                y,
                width,
                height,
                visible_begin:true,
                visible_end:true,


            }
        });
      
        return r;
    }

    function layoutIntervals(intervals) {
  
        // сортировка

        intervals.sort((a, b) => {
            const orderDiff = Number(a.order) - Number(b.order);
            if (orderDiff !== 0) return orderDiff;
            // fallback
            if (a.fr_begin === b.fr_begin) return b.fr_end - a.fr_end;
            return a.fr_begin - b.fr_begin;

        });  
    

        const levels = [];

        for (const interval of intervals) {
            let placed = false;

            for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
            const level = levels[levelIndex];

            // проверяем последний элемент в уровне
            const last = level[level.length - 1];

            // если НЕ пересекается → можно положить
            if (interval.fr_begin >= last.fr_end) {
                level.push(interval);
                interval.level = levelIndex;
                placed = true;
                break;
            }

            // если ВЛОЖЕН → кладем ниже
            if (interval.fr_begin >= last.fr_begin && interval.fr_end <= last.fr_end) {
                    continue;
                }
            }

            if (!placed) {
                levels.push([interval]);
                interval.level = levels.length - 1;
            }
        }


        return intervals;

    }

    const addRow = () => {
        setRows([
            ...rows,
            {
                ...DefaultElement,
                id: (Date.now() + Math.random()).toString(),
                fr_text_position:"bottom",
            }
            /*
            {
                id: (Date.now() + Math.random()).toString(),
                fr_begin: 0,
                fr_end: 0,
                label: "Empty",
                measure: "khz",
                bgColor: "#0081fa",
                order:  1,
                heightRow: 100,
                visible_border_top:true,
                visible_border_right:true,
                visible_border_bottom:true,
                visible_border_left:false,
                border_top_value:1,
                border_right_value:1,
                border_bottom_value:1,
                border_left_value:1,
                borderColor:'#000000',
            },*/
        ]);
    };

    const deleteRow = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleChange = (id, field, value) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          [field]: value,
                      }
                    : row
            )
        );
    };

 

    const cancelData = () => {
        setRows([]);
        setGroupHeadLine({
            ...groupHeadLine,
            label:"",
        });
        if(closeCallback){
            closeCallback();
        }
    };

    const saveData = () => {
        // пример данных
        
        const new_elements = layoutIntervals(rows);
        const cordinated = cordinate(new_elements);

       // console.log(rows,new_elements,'-------',cordinated)

         if(groupHeadLine.label){
            cordinated.push(groupHeadLine);
        }

       console.log(rows,new_elements,cordinated,'---------')
       // setElements([...elements,...cordinated]);

        setFrGroups((prev) => [
            ...prev,
            {

                id: Date.now().toString(),
              //  headLine:groupHeadLine,
                fr_begin: 0,
                fr_end: 0,
                scale:scale,
                elements: [...cordinated],
            },
        ]);

        if(closeCallback){
            closeCallback();
        }

       // console.log("GROUPS:",frGroups);
      //  console.log("ELEMENTS:",new_elements,cordinated,frGroups);
        //axios.post('/api/save', formatted)
    };


    return (
        <>
              <div style={{"display":"none"}} className="p-4 space-y-4">
            <div className="space-y-3">

                    <div className="grid grid-cols-[1fr_120px] gap-2">
                        <div>
                            <label>
                                Headline
                                <input
                                    value={groupHeadLine.label} 
                                    type="text" 
                                    className="border p-2 rounded w-full"
                                    onChange={(e)=>{setGroupHeadLine({...groupHeadLine,label:e.target.value});console.log(groupHeadLine,'HEADLINE')}}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Scale
                                <input type="number"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={scale}
                                onChange={(e)=>setScale(e.target.value)}
                                className="border p-2 rounded w-full"
                                />
                            </label>
                        </div>
                       
                        
                    </div>
            
                    {/* Header */}
                    <div className="grid grid-cols-8 gap-2 font-semibold">
                        <div>{translations.system.fr_begin}</div>
                        <div>{translations.system.fr_end}</div>
                        <div>{translations.system.label}</div>
                        <div>{translations.system.measure}</div>
                        <div>{translations.system.background_color}</div>
                        <div>{translations.system.order}</div>
                        <div>{translations.system.height_row}</div>
                        <div>#</div>
                    </div>

                    {/* Rows */}
                    {rows.map((row) => (
                        <div
                            key={row.id}
                            className="grid grid-cols-8 gap-2 items-center"
                        >
                            <input
                                type="text"
                                value={row.fr_begin}
                                onChange={(e) =>
                                    handleChange(row.id, "fr_begin", e.target.value)
                                }
                                className="border p-2 rounded w-full"
                            />

                            <input
                                type="text"
                                value={row.fr_end}
                                onChange={(e) =>
                                    handleChange(row.id, "fr_end", e.target.value)
                                }
                                className="border p-2 rounded w-full"
                            />

                            <input
                                type="text"
                                value={row.label}
                                onChange={(e) =>
                                    handleChange(row.id, "label", e.target.value)
                                }
                                className="border p-2 rounded w-full"
                            />

                            <select
                                value={row.measure}
                                onChange={(e) =>
                                    handleChange(row.id, "measure", e.target.value)
                                }
                                className="border p-2 rounded w-full"
                            >
                                <option value="kHz">kHz</option>
                                <option value="MHz">MHz</option>
                                <option value="GHz">GHz</option>
                            </select>

                            <input
                                type="color"
                                value={row.bgColor}
                                onChange={(e) =>
                                    handleChange(row.id, "bgColor", e.target.value)
                                }
                                className="w-full h-10 border rounded"
                            />

                            <input
                                type="number"
                                value={row.order}
                                min="1"
                                max="4"
                                step="1"
                                onChange={(e) =>
                                    handleChange(row.id, "order", e.target.value)
                                }
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="number"
                                min="10"
                                step="10"
                                max="100"
                                value={row.heightRow}
                                onChange={(e) =>
                                    handleChange(row.id, "heightRow", e.target.value)
                                }
                                className="border p-2 rounded w-full"
                            />
                            
                           <button
                                onClick={() => deleteRow(row.id)}
                                className="bg-red-500 text-white rounded hover:bg-red-600 w-10 h-10 flex items-center justify-center justify-self-center"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                
            </div>

            <div className="flex gap-3">
                <button
                    onClick={addRow}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add
                </button>

                <button
                    onClick={saveData}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Save
                </button>
            </div>
        </div> 

        <div className="p-2">
    <div className="bg-gray-900 border border-gray-700 overflow-hidden">

        {/* Top section */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-4">

                <div>
                    <label className="block text-sm text-gray-300 mb-1">
                        {translations.system.headline}
                    </label>

                    <input
                        value={groupHeadLine.label}
                        type="text"
                        className="
                            w-full
                            bg-gray-900
                            border border-gray-700
                            
                            px-3 py-2
                            text-white
                            outline-none
                            focus:border-blue-500
                        "
                        onChange={(e)=>{
                            
                            setGroupHeadLine({...groupHeadLine,label:e.target.value})
                            console.log(groupHeadLine,'HEADLINE')
                        }}

                        
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">
                        {translations.system.scale}
                    </label>

                    <input
                        type="number"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={scale}
                        onChange={(e)=>setScale(e.target.value)}
                        className="
                            w-full
                            bg-gray-900
                            border border-gray-700
                           
                            px-3 py-2
                            text-white
                            outline-none
                            focus:border-blue-500
                        "
                    />
                </div>

            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

            {/* Header */}
            <div
                className="
                    min-w-[1200px]
                    grid grid-cols-8
                    gap-2
                    bg-gray-800
                    border-b border-gray-700
                    px-3 py-3
                    text-sm
                    font-semibold
                    text-gray-300
                "
            >
               

                  <div>{translations.system.fr_begin}</div>
                        <div>{translations.system.fr_end}</div>
                        <div>{translations.system.label}</div>
                        <div>{translations.system.measure}</div>
                        <div>{translations.system.background_color}</div>
                        <div>{translations.system.order}</div>
                        <div>{translations.system.height_row}</div>
                        <div>#</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-800">
                {rows.map((row) => (
                    <div
                        key={row.id}
                        className="
                            min-w-[1200px]
                            grid grid-cols-8
                            gap-2
                            items-center
                            px-3 py-3
                            bg-gray-900
                            hover:bg-gray-800/70
                            transition
                        "
                    >
                        <input
                            type="text"
                            value={row.fr_begin}
                            onChange={(e) =>
                                handleChange(row.id, "fr_begin", e.target.value)
                            }
                            className="
                                w-full
                                bg-gray-800
                                border border-gray-700
                               
                                px-3 py-2
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                        <input
                            type="text"
                            value={row.fr_end}
                            onChange={(e) =>
                                handleChange(row.id, "fr_end", e.target.value)
                            }
                            className="
                                w-full
                                bg-gray-800
                                border border-gray-700
                                
                                px-3 py-2
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                        <input
                            type="text"
                            value={row.label}
                            onChange={(e) =>
                                handleChange(row.id, "label", e.target.value)
                            }
                            className="
                                w-full
                                bg-gray-800
                                border border-gray-700
                               
                                px-3 py-2
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                        <select
                            value={row.measure}
                            onChange={(e) =>
                                handleChange(row.id, "measure", e.target.value)
                            }
                            className="
                                w-full
                                bg-gray-800
                                border border-gray-700
                                
                                px-3 py-2
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        >
                            <option value="kHz">kHz</option>
                            <option value="MHz">MHz</option>
                            <option value="GHz">GHz</option>
                        </select>

                        <input
                            type="color"
                            value={row.bgColor}
                            onChange={(e) =>
                                handleChange(row.id, "bgColor", e.target.value)
                            }
                            className="
                                w-full
                                h-11
                                bg-gray-800
                                border border-gray-700
                              
                                cursor-pointer
                            "
                        />

                        <input
                            type="number"
                            value={row.order}
                            min="1"
                            max="4"
                            step="1"
                            onChange={(e) =>
                                handleChange(row.id, "order", e.target.value)
                            }
                            className="
                                w-full
                                bg-gray-800
                                border border-gray-700
                               
                                px-3 py-2
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                        <input
                            type="number"
                            min="10"
                            step="10"
                            max="100"
                            value={row.heightRow}
                            onChange={(e) =>
                                handleChange(row.id, "heightRow", e.target.value)
                            }
                            className="
                                w-full
                                bg-gray-800
                                border border-gray-700
                             
                                px-3 py-2
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                        <div className="flex justify-center">
                            <button
                                onClick={() => deleteRow(row.id)}
                                className="
                                    w-10 h-10
                                    flex items-center justify-center
                                  
                                    bg-red-500
                                    text-white
                                    hover:bg-red-600
                                    transition
                                "
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex gap-3">
            <button
                onClick={addRow}
                className="
                    bg-blue-500
                    hover:bg-blue-600
                    text-white
                    px-5 py-2
                   
                    transition
                "
            >
                {translations.system.add}
            </button>

            <button
                onClick={saveData}
                className="
                    bg-green-500
                    hover:bg-green-600
                    text-white
                    px-5 py-2
                   
                    transition
                "
            >
                {translations.system.save}
            </button>
              <button
                onClick={cancelData}
                className="
                    bg-gray-500
                    hover:bg-gray-600
                    text-white
                    px-5 py-2
                   
                    transition
                "
            >
                {translations.system.cancel}
            </button>
        </div>
    </div>
</div>
        </>
      
    );
  
}