import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { element as defaultElement } from "./Default";
export default function UpdateGroup(props) {

  
    const {
        activeGroup,
        setFrGroups,
        frGroups,
        pageWidth,
        closeCallback,
    } = props;

    console.log(activeGroup,'ACTIVE GROUP');

    const { translations } = usePage().props;

    const [rows, setRows] = useState([]);
    const [scale, setScale] = useState(0.5);
   

    const [groupHeadLine,setGroupHeadLine] = useState({
        ...defaultElement,
        id: "title-"+(Date.now() + Math.random()).toString(),
        type:"title",
        label:"",
        width:200,
        height:50,
        visible_begin:false,
        visible_end:false,
         visible_border_left:true,
        bgColor: "#ffffff",
    });

    defaultElement

    // LOAD ACTIVE GROUP
    useEffect(() => {
        if (!activeGroup) return;

        const group = frGroups.find(
            (g) => g.id === activeGroup.id
        );

        if (!group) return;

        setScale(group.scale || 0.5);

        setRows(
            /*
            group.elements.map((el) => ({
                ...el,
            }))
            */

            group.elements.filter((el) => el.type!='title')
        );

        let headLine = group.elements.filter((el) => el.type=='title')
        if(headLine.length && headLine[0]){
          //  console.log(headLine);
            setGroupHeadLine(headLine[0]);
        }
    }, [activeGroup, frGroups]);

    function getMinMax(ranges) {
        let min = Infinity;
        let max = -Infinity;

        ranges.forEach((r) => {
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
            max: max === -Infinity ? null : max,
        };
    }

    function layoutIntervals(intervals) {

        intervals.sort((a, b) => {
            const orderDiff =
                Number(a.order) - Number(b.order);

            if (orderDiff !== 0) return orderDiff;

            if (a.fr_begin === b.fr_begin) {
                return b.fr_end - a.fr_end;
            }

            return a.fr_begin - b.fr_begin;
        });

        const levels = [];

        for (const interval of intervals) {

            let placed = false;

            for (
                let levelIndex = 0;
                levelIndex < levels.length;
                levelIndex++
            ) {

                const level = levels[levelIndex];
                const last = level[level.length - 1];

                if (
                    interval.fr_begin >= last.fr_end
                ) {
                    level.push(interval);

                    interval.level = levelIndex;

                    placed = true;

                    break;
                }

                if (
                    interval.fr_begin >= last.fr_begin &&
                    interval.fr_end <= last.fr_end
                ) {
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

    const cordinate = (data) => {

        const sorted = data.sort(
            (a, b) =>
                Number(a.order) - Number(b.order)
        );

        const { min, max } = getMinMax(data);

        const total = max - min;

        let default_y = sorted[0].y ?? 0;
        
       
        console.log(sorted,'SORTED');
        return sorted.map((item) => {

            const start =
                ((item.fr_begin - min) / total) *
                pageWidth *
                scale;

            const end =
                ((item.fr_end - min) / total) *
                pageWidth *
                scale;

            const width = end - start;

          

            /*
            const height_diff =
                item.heightLevel ?? 1;

            const height = 100 / height_diff;
            
            const y = default_y ? default_y: item.heightLevel * height;
            
            */
            const height = item.heightRow ?? 100;
       
            //const y = default_y ? default_y:(item.order-1) * height;
            //const y = default_y ? default_y:item.order * height;

            const y = (item.order-1) * height;

            /*
            if(item.id.startsWith('new-row-')){
                const y = (item.order-1) * height;
            } else{
                const y = item.y ?? (item.order-1) * height;
            }
            */
            
           
            const oldItem = rows.find(
                (r) => r.id === item.id
            );

            let new_y = item.y ?? y;
            if(item.id.toString().startsWith('new-row-')){
                console.log(item,'NEW ROW');
               new_y = item.y + (Number(item.order)-1) * Number(item.heightRow);
               item.id = (Date.now() + Math.random()).toString();
            }

            return {
                ...item,
                type: "group_denomination",
                x:start,
              //  x:item.x ?? start,
              //  y,
                y:new_y,
                width,
                height,
               // order: item.order,
                heightRow: item.heightRow,
                // уровень
               // heightLevel: height_diff,
               // visible_begin: true,
               // visible_end: true,
            };
        });
    };




    const addRow = () => {

        console.log(rows,'ROWS') // 0,1,2,3,4,5,6,7,8,9
        let new_row = {
            id:'new-row-'+
                (
                    Date.now() +
                    Math.random()
                ).toString(),
            fr_begin: 0,
            fr_end: 0,
            label: "",
            measure: "kHz",
            bgColor: "#0081fa",
            order: 1,
            height: 100,
            heightRow: 100,
        }
        if(rows.length){
            let for_clone =  rows.find(
                el => Number(el.order) === 1
            );
            new_row = {
                ...for_clone,
                id:'new-row-'+
                (
                    Date.now() +
                    Math.random()
                ).toString(),
                fr_begin: 0,
                fr_end: 0,
                label: "Empty",
                description:"",
                bgColor: "#0081fa",
                order: 1,
                height: 100,
                heightRow: 100,
                x: for_clone.x+for_clone.width,
                
            }
        }

        setRows((prev) => [
            ...prev,
            new_row
            /*
            {
                id:'new-row-'+
                    (
                        Date.now() +
                        Math.random()
                    ).toString(),
                fr_begin: 0,
                fr_end: 0,
                label: "",
                measure: "kHz",
                bgColor: "#0081fa",
                order: 1,
                height: 100,
                heightRow: 100,
            },*/
        ]);
    };

    const deleteRow = (id) => {
        setRows((prev) =>
            prev.filter((row) => row.id !== id)
        );
    };

    const handleChange = (
        id,
        field,
        value
    ) => {
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

    const cancel = () =>{
        if(closeCallback){
            closeCallback();
        }
    }

    // UPDATE GROUP
    const saveData = () => {

       
        
        const new_elements = layoutIntervals(rows);
       // const new_elements = rows;

         
            const cordinated = cordinate(new_elements);
            console.log(cordinated,'-------')
            //const cordinated = new_elements;    

         //       console.log(rows[0],new_elements[0],cordinated[0],'ROWS');
       // return false;

                if(groupHeadLine.label){
                    cordinated.push(groupHeadLine);
                }

                console.log(rows,new_elements,cordinated,'-------')
                setFrGroups((prev) =>
                    prev.map((group) =>
                        group.id === activeGroup.id
                            ? {
                                ...group,
                                scale,
                                elements: cordinated,
                            }
                            : group
                    )
                );

                if(closeCallback){
                    closeCallback();
                }
    };


return (
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
                            onChange={(e)=>
                                setGroupHeadLine({
                                    ...groupHeadLine,
                                    label:e.target.value
                                })
                            }
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
                                type="number"
                                value={row.fr_begin}
                                onChange={(e) =>
                                    handleChange(
                                        row.id,
                                        "fr_begin",
                                        e.target.value
                                    )
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
                                value={row.fr_end}
                                onChange={(e) =>
                                    handleChange(
                                        row.id,
                                        "fr_end",
                                        e.target.value
                                    )
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
                                    handleChange(
                                        row.id,
                                        "label",
                                        e.target.value
                                    )
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
                                    handleChange(
                                        row.id,
                                        "measure",
                                        e.target.value
                                    )
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
                                <option value="kHz">
                                    kHz
                                </option>

                                <option value="MHz">
                                    MHz
                                </option>

                                <option value="GHz">
                                    GHz
                                </option>
                            </select>

                            <input
                                type="color"
                                value={row.bgColor}
                                onChange={(e) =>
                                    handleChange(
                                        row.id,
                                        "bgColor",
                                        e.target.value
                                    )
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
                                min="1"
                                max="4"
                                step="1"
                                value={row.order}
                                onChange={(e) =>
                                    handleChange(
                                        row.id,
                                        "order",
                                        e.target.value
                                    )
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
                                    handleChange(
                                        row.id,
                                        "heightRow",
                                        e.target.value
                                    )
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
                                    onClick={() =>
                                        deleteRow(row.id)
                                    }
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
                    onClick={cancel}
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
);

}