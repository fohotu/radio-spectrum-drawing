import { Trash2 } from 'lucide-react';
import React, { useEffect,useState } from 'react'

function UpdateGroup(props) {
  
  const {group_id,elements,setElements,pageWidth} = props;  
  const [rows,setRows] = useState([]);
  const[min,setMin] = useState(0);
  const[max,setMax] = useState(0);

  useEffect(() => {

    setRows(elements.filter((item) => item.group_id == group_id))
  
    },[]);

    function layoutIntervals(intervals) {
  
  // сортировка

  intervals.sort((a, b) => {
    const orderDiff = Number(a.order) - Number(b.order);
    if (orderDiff !== 0) return orderDiff;
    // fallback
    if (a.fr_begin === b.fr_begin) return b.fr_end - a.fr_end;
    return a.fr_begin - b.fr_begin;

  });  
  /*
  intervals.sort((a, b) => {
    if (a.fr_begin === b.fr_begin) return b.fr_end - a.fr_end;
    return a.fr_begin - b.fr_begin;
  });
  */

 
  /*

  intervals.sort((a, b) => {
    if (a.fr_begin === b.fr_begin) return b.fr_end - a.fr_end;
    return a.fr_begin - b.fr_begin;
  });
  
  */

 


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

  //Sort By Order
 // intervals.sort((a,b) => Number(a.order) - Number(b.order));


  return intervals;

}

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

  console.log(sorted,data);

  const {min,max} = getMinMax(data);
  const total = max-min;
  //const pageWidth = 747;

  let default_y = sorted[0].y ?? 0;

  let r = sorted.map((item) => {

   
    const scale = 0.5; // или px на MHz
    //const x = item.fr_begin * scale;

    const start = (item.fr_begin - min) / total * pageWidth * scale;  
    const end = ((item.fr_end - min) / total) * pageWidth * scale;

   // const width = (item.fr_end - item.fr_begin) * scale;
    const width = end - start;

   // const y = item.level * 100;
   // const x = normalize(item.fr_end) * scale;
   // console.log(normalize(item.fr_end));
   // const width = (normalize(item.fr_end) - normalize(item.fr_begin))*scale;
    const height_diff = item.height ?? 1;
    const height = 100 / height_diff;
  //  const y = item.level * height;
    const y = default_y ? default_y: item.level * height;
   // const default_x = item.x ?? start;  
    return {
      ...item,
      type:"group_denomination",
      x:start,
      //x:default_x,
      y,
      width,
      height,
      visible_begin:true,
      visible_end:true,
    }
  });
 
  return r;
}
    const addRow = () => {
      let id = Date.now().toString();
      setRows([
        ...rows,
        {id,group_id, fr_begin: "", fr_end: "", measure: "kHz", height: "" ,order:1 },
      ]);
    };

    const saveData = () => {

    // пример данных
    const new_elements = layoutIntervals(rows);
    
    console.log(rows,getMinMax(rows));

    
   

    const cordinated = cordinate(new_elements);

    setElements((prev) => [
        ...prev.filter((el) => el.group_id !== group_id),
        ...cordinated
    ]);
    /*

    setElements((prev) =>
        prev.filter((el) => el.group_id !== group_id)
    );


    setElements([...elements,...cordinated]);

    */
    console.log("ELEMENTS:",new_elements, elements,cordinated);
    //axios.post('/api/save', formatted)

  };

   const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-4">
        <div
            className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <input
              type="number"
              placeholder="min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="number"
              placeholder="max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        {/* ROWS */}
        {
          (rows.length && rows[0].group_id) ?
            <label>
              <input type="checkbox" />GROUP_{rows[0].group_id}
            </label>
          :""   
        }
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-3 bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            {/* fr_begin */}
            <input
              type="number"
              placeholder="fr_begin"
              value={row.fr_begin}
              onChange={(e) =>
                updateRow(index, "fr_begin", e.target.value)
              }
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* fr_end */}
            <input
              type="number"
              placeholder="fr_end"
              value={row.fr_end}
              onChange={(e) =>
                updateRow(index, "fr_end", e.target.value)
              }
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* measure */}
            <select
              value={row.measure}
              onChange={(e) =>
                updateRow(index, "measure", e.target.value)
              }
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="kHz">kHz</option>
              <option value="MHz">MHz</option>
              <option value="GHz">GHz</option>
            </select>

            {/* height 1/X */}
            <div className="flex items-center border border-gray-300 rounded">
              <span className="px-2 text-gray-600">1 /</span>
              <input
                type="number"
                placeholder="2"
                min="1"
                value={row.height}
                onChange={(e) =>
                  updateRow(index, "height", e.target.value)
                }
                className="w-full p-2 outline-none"
              />
            </div>

             <div className="flex items-center border border-gray-300 rounded">
              <span className="px-2 text-gray-600">Order</span>
              <input
                type="number"
                placeholder="1"
                min="1"
                value={row.order}
                onChange={(e) =>
                  updateRow(index, "order", e.target.value)
                }
                className="w-full p-2 outline-none"
              />
            </div>


            {/* delete */}
            <button
              onClick={()=>{}}
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            + Add Row
          </button>

          <button
            onClick={()=>{}}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Clear All
          </button>

          <button
            onClick={saveData}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>


      </div>
    </div>
  );
}

export default UpdateGroup