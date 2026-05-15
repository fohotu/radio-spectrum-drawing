import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function UpdateGroup(props) {

    console.log(props);
    const {
        activeGroup,
        setFrGroups,
        frGroups,
        pageWidth,
    } = props;

    console.log(activeGroup);

    const [rows, setRows] = useState([]);
    const [scale, setScale] = useState(0.5);
    const [groupHeadLine,setGroupHeadLine] = useState({
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
    });

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
       
            const y = default_y ? default_y:(item.order-1) * height;
           
            const oldItem = rows.find(
                (r) => r.id === item.id
            );

            return {
                ...item,
                type: "group_denomination",
                x:start,
                y,
                width,
                height,
                // уровень
               // heightLevel: height_diff,
                visible_begin: true,
                visible_end: true,
            };
        });
    };




    const addRow = () => {
        setRows((prev) => [
            ...prev,
            {
                id:
                    (
                        Date.now() +
                        Math.random()
                    ).toString(),
                fr_begin: 0,
                fr_end: 0,
                label: "",
                measure: "kHz",
                bgColor: "#0081fa",
                order: prev.length + 1,
                height: 1,
            },
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

    // UPDATE GROUP
    const saveData = () => {
        
        const new_elements =
            layoutIntervals(rows);
            const cordinated =
                cordinate(new_elements);

                if(groupHeadLine.label){
                    cordinated.push(groupHeadLine);
                }
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
    };

    return (
        <div className="p-4 space-y-4">
               <div className="grid grid-cols-[1fr_120px] gap-2">
                        <div>
                            <label>
                                Headline
                                <input
                                    value={groupHeadLine.label} 
                                    type="text" 
                                    className="border p-2 rounded w-full"
                                    onChange={(e)=>setGroupHeadLine({...groupHeadLine,label:e.target.value})}
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
            {/* HEADER */}
            <div className="grid grid-cols-8 gap-2 font-semibold">
                <div>fr_begin</div>
                <div>fr_end</div>
                <div>Label</div>
                <div>Measure</div>
                <div>bgColor</div>
                <div>Order</div>
                <div>height</div>
                <div>Action</div>
            </div>

            {/* ROWS */}
            <div className="space-y-3">
                {rows.map((row) => (
                    <div
                        key={row.id}
                        className="grid grid-cols-8 gap-2 items-center"
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
                            className="border p-2 rounded w-full"
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
                            className="border p-2 rounded w-full"
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
                            className="border p-2 rounded w-full"
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
                            className="border p-2 rounded w-full"
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
                            className="w-full h-10 border rounded"
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
                            className="border p-2 rounded w-full"
                        />

                     
{
    /*
    
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
    
     */
}                   
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
                            onClick={() =>
                                deleteRow(row.id)
                            }
                            className="bg-red-500 text-white rounded hover:bg-red-600 w-10 h-10 flex items-center justify-center justify-self-center"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* ACTIONS */}
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
                    Update
                </button>

            </div>
        </div>
    );
}