import React,{useState,useEffect} from 'react'

import { Trash2 } from "lucide-react";
function Test(props) {

     const {setElements,elements,pageWidth,pageHeigth} = props;  
  const [rows,setRows] = useState([]);
  const addRow = () => {
    let id = Date.now().toString();

    let group_id = sessionStorage.getItem("group_id");

    if (!group_id) {
      group_id = Date.now().toString();
      sessionStorage.setItem("group_id", group_id);
    }

    setRows([
        ...rows,
        {id,group_id, fr_begin: "", fr_end: "", measure: "kHz", height: 1,order:1 },
        ]);
    };

    // обновить поле
    const updateRow = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };

    // удалить строку
    const deleteRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    // очистить всё
    const clearAll = () => {
        setRows([]);
    };  

    const saveData = () => {
        console.log(rows);
    }

  return (
    <div>
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
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-3 bg-white p-4 rounded-xl shadow border border-gray-200"
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
                placeholder="1"
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
              onClick={() => deleteRow(index)}
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

    </div>
  )
}

export default Test