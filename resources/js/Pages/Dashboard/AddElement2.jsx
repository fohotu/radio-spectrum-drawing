import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

function AddElement(props) {

  const {setElements,elements,pageWidth,pageHeigth} = props;  
  const [rows, setRows] = useState([
      {
        id:Date.now().toString(),
        fr_begin: "",
        fr_end: "",
        measure: "kHz",
        height: "",
        gropup_id:"",
      },
    ]);


    const[min,setMin] = useState(0);
    const[max,setMax] = useState(0);

    const addRow = () => {
        let id = Date.now().toString();
        const group_id = sessionStorage.getItem("group_id");

        if(!group_id){
          sessionStorage.setItem("group_id", Date.now().toString());
          const group_id = sessionStorage.getItem("group_id");
        }

        setRows([
          ...rows,
          {id,group_id, fr_begin: "", fr_end: "", measure: "kHz", height: "" },
        ]);
    };

    // обновить поле
    const updateRow = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };


    //удалить строку
    const deleteRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    //очистить всё
    const clearAll = () => {
        setRows([]);
    };

    const saveData = () => {
        console.log(rows);
        sessionStorage.removeItem("group_id");
        let r = layoutIntervals(rows);
        console.log(r,rows);
    }
   
    function layoutIntervals(intervals) {
        // сортировка
        intervals.sort((a, b) => {
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


    const findAfter = () => {

    } 

    const findBefore = () => {

    }   

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

                {/* delete */}
                <button
                  onClick={() => deleteRow(index)}
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
                onClick={clearAll}
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
    )
}

export default AddElement