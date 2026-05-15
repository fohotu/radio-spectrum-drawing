import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";


export default function AddElement(props) {

  const {setElements,elements,pageWidth,pageHeigth,group,setGroup} = props;  
 
  
  const [rows, setRows] = useState([
    /*
    {
      id:Date.now().toString(),
      fr_begin: "",
      fr_end: "",
      measure: "kHz",
      height: "",
      group_id:0,
    },*/
  ]);

  const[min,setMin] = useState(0);
  const[max,setMax] = useState(0);
  const[scale,setScale] = useState(0.5);

  // добавить строку
  const addRow = () => {
    let id = Date.now().toString();

    let group_id = sessionStorage.getItem("group_id");

    if (!group_id) {
      group_id = Date.now().toString();
      sessionStorage.setItem("group_id", group_id);
    }

    setRows([
      ...rows,
      {id,group_id, fr_begin: "", fr_end: "", measure: "kHz", height: "" ,order:1 },
    ]);
    setGroup({
      ...group,
      id:group_id,
    });
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

  // сохранить
  const saveData = () => {

    // пример данных
  //const new_elements = calculateLayout(rows);//generateLayout(rows);
    const new_elements = layoutIntervals(rows);
    
    console.log(rows,getMinMax(rows));

    
    sessionStorage.removeItem("group_id");

    const cordinated = cordinate(new_elements);
    setElements([...elements,...cordinated]);
    console.log("ELEMENTS:",new_elements, elements,cordinated);
    //axios.post('/api/save', formatted)

  };

  /* TEST */

  const input = [
      
      {fr_begin: 400, fr_end: 600, h: 1/2},
      {fr_begin: 400, fr_end: 500, h: 1/2},
      {fr_begin: 500, fr_end: 600, h: 1/2},
      {fr_begin: 600, fr_end: 700, h: 1},
      {fr_begin: 700, fr_end: 750, h: 1/2},
      {fr_begin: 750, fr_end: 800, h: 1/2},
      {fr_begin: 700, fr_end: 800, h: 1/2},
  
  ];

function calculateLayout(data) {
 let trash = [];
 let result =  data.map((item) => {
    if(!trash.includes(item.id)){

      let obj = {
        width:item.fr_end - item.fr_begin,
        height:item.h * 100,
        x:0,
        y:0,
        child:[],
      };

      let x1 = item.fr_begin;
      let x2 = item.fr_end;
      obj.x = x2-x1;
      obj.y = 0;

      data.forEach((sub_item) => {
        let sub_x1 = sub_item.fr_begin;
        let sub_x2 = sub_item.fr_end;
        if(x1 <= sub_x1 && x2 >= sub_x2){
          let child_item = {
            x:sub_x2 - sub_x1,
            height:sub_item.h * 100,
            y:obj.y + sub_item.h * 100,
          }
          obj.child.push(child_item);
          trash.push(sub_item.id);
        }
      })

      return obj;

    }

    

  })
 // console.log(result);
  return result;
}

function calculateLayout1(data) {
    const minFr = Math.min(...data.map(d => d.fr_begin));
    const placedItems = [];

    return data.map(item => {
        const width = item.fr_end - item.fr_begin;
        const x = item.fr_begin - minFr;
        const height = item.h * 100;

        let y = 0;
        let placed = false;

        // Пробуем найти свободное место, начиная с y = 0
        // Увеличиваем y шагами по 25 (минимальный возможный h: 1/4) 
        // или ищем по координатам существующих блоков
        while (!placed) {
            // Проверяем, пересекается ли текущий прямоугольник с кем-то уже поставленным
            const hasCollision = placedItems.some(p => {
                const horizontalOverlap = !(item.fr_end <= p.fr_begin || item.fr_begin >= p.fr_end);
                const verticalOverlap = !(y + height <= p.y || y >= p.y + p.height);
                return horizontalOverlap && verticalOverlap;
            });

            if (!hasCollision) {
                placed = true;
            } else {
                // Если столкновение есть, пробуем сдвинуться ниже
                y += 25; 
                
                // Предохранитель: если вышли за пределы общей высоты 100
                if (y >= 100) {
                   y = 0; // Или любая другая логика для переполнения
                   placed = true; 
                }
            }
        }

        const newItem = {
            x,
            y,
            width,
            height,
            fr_begin: item.fr_begin,
            fr_end: item.fr_end
        };

        placedItems.push(newItem);

        return {
            x: newItem.x,
            y: newItem.y,
            width: newItem.width,
            height: newItem.height
        };
    });
}

/** TEST SPLACE */

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

const normalize = (x) => (x - min) / (max - min);

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

  let r = sorted.map((item) => {
   
    //const scale = 0.5; // или px на MHz
    //const x = item.fr_begin * scale;
    
    const start = (item.fr_begin - min) / total * pageWidth * scale;  
    const end = ((item.fr_end - min) / total) * pageWidth * scale;

   //const width = (item.fr_end - item.fr_begin) * scale;
    const width = end - start;

   //const y = item.level * 100;
   //const x = normalize(item.fr_end) * scale;
   //console.log(normalize(item.fr_end));
   //const width = (normalize(item.fr_end) - normalize(item.fr_begin))*scale;
    const height_diff = item.height ?? 1;
    const height = 100 / height_diff;
  //const y = item.level * height;
    const y = item.level * height;
   
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

const cordinate11 = (data) => {

  const sorted = data.sort((a, b) => b.order - a.order);

  const {min,max} = getMinMax(data);
  const total = max-min;
  //const pageWidth = 747;

  let r = data.map((item,index) => {

    console.log(item);  
    const scale = 1; // или px на MHz
    //const x = item.fr_begin * scale;

    const start = (item.fr_begin - min) / total * pageWidth;  
    const end = ((item.fr_end - min) / total) * pageWidth;

   // const width = (item.fr_end - item.fr_begin) * scale;
    const width = end - start;

   // const y = item.level * 100;
   // const x = normalize(item.fr_end) * scale;
   // console.log(normalize(item.fr_end));
   // const width = (normalize(item.fr_end) - normalize(item.fr_begin))*scale;
    const height_diff = item.height ?? 1;
    const height = 100 / height_diff;
  //  const y = item.level * height;
    const y = index * height;
   
    return {
      ...item,
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

/* TEST PLACe */


//const result = calculateLayout(input);
//const r1 = layoutIntervals(input);
//console.log(r1,'R!');
//console.log(input,result);

  /* TEST */


  /*

  [
    {fr_begin:400,fr_end:600,h:1/2},
    {fr_begin:400,fr_end:500,h:1/2},
    {fr_begin:500,fr_end:600,h:1/2},
    {fr_begin:600,fr_end:700,h:1},

    {fr_begin:700,fr_end:750,h:1/2},
    {fr_begin:750,fr_end:800,h:1/2},
    {fr_begin:700,fr_end:800,h:1/2},
  ]
  [
    {x:0,y:0,width:200,height:50},
    {x:0,y:50,width:100,height:50},
    {x:100,y:50,width:100,height:50},
    {x:200,y:0,width:100,height:100},
    {x:300,y:0,width:50,height:50},
    {x:350,y:0,width:50,height:50},
    {x:300,y:50,width:100,height:50},
  ]
  */
  

  const generateElements1 = (rows) => {
  const elements = [];

  // 1. сортировка по высоте (сначала 1/1)
  const sorted = [...rows].sort(
    (a, b) => Number(a.height) - Number(b.height)
  );

  let root = sorted[0]; // 1/1
  const others = sorted.slice(1);

  const rootWidth = root.fr_end - root.fr_begin;
  const rootHeight = 100 / Number(root.height || 1);

  // 2. главный элемент (верх)
  elements.push({
    id: "root",
    x: 0,
    y: 0,
    width: rootWidth,
    height: rootHeight,
    fr_begin: root.fr_begin,
    fr_end: root.fr_end,
  });

  // 3. нижние элементы
  let currentX = 0;
  const baseY = rootHeight;

  others.forEach((row, i) => {
    const width = row.fr_end - row.fr_begin;
    const height = 100 / Number(row.height || 1);

    elements.push({
      id: "child_" + i,
      x: currentX,
      y: baseY,
      width: width,
      height: height,
      fr_begin: row.fr_begin,
      fr_end: row.fr_end,
    });

    currentX += width;
  });

  return elements;
};

const generateLayout = (rows) => {
  const elements = [];

  // 1. сортировка по диапазону
  const sorted = [...rows].sort((a, b) => {
    if (a.fr_begin === b.fr_begin) {
      return a.fr_end - b.fr_end;
    }
    return a.fr_begin - b.fr_begin;
  });

  let currentX = 0;

  for (let i = 0; i < sorted.length; ) {
    const base = sorted[i];

    const group = sorted.filter(
      (r) =>
        r.fr_begin >= base.fr_begin &&
        r.fr_end <= base.fr_end
    );

    // уникальные поддиапазоны
    const children = group.filter(
      (r) =>
        !(r.fr_begin === base.fr_begin && r.fr_end === base.fr_end)
    );

    const width = base.fr_end - base.fr_begin;

    // если нет вложенности
    if (children.length === 0) {
      elements.push({
        x: currentX,
        y: 0,
        width,
        height: 100 / base.h,
      });

      currentX += width;
      i++;
      continue;
    }

    // 🔥 если есть вложенность (как у тебя)
    // верх
    elements.push({
      x: currentX,
      y: 0,
      width,
      height: 100 / base.h,
    });

    // нижние элементы
    let innerX = currentX;

    children.forEach((child) => {
      const w = child.fr_end - child.fr_begin;

      elements.push({
        x: innerX,
        y: 100 / base.h,
        width: w,
        height: 100 / child.h,
      });

      innerX += w;
    });

    currentX += width;
    i += group.length;
  }

  return elements;
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-4">
        <div
            className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl shadow border border-gray-200"
          >
          <label>
            Min:
            <input
              type="number"
              placeholder="min"
              value={group.fr_begin}
              onChange={(e) => setGroup({...group,fr_begin:e.target.value})}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </label>
            <label>
              Max:
               <input
                type="number"
                placeholder="max"
                value={group.fr_end}
                onChange={(e) => setGroup({...group,fr_end:e.target.value})}
                className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </label>

            <label>
              Scale:
                <input
                type="number"
                placeholder="scale"
                value={group.scale}
                step="0.25"
                min="0.25"
                max = "1"
                onChange={(e) => setGroup({...group,scale:e.target.value})}
                className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </label>
           
            
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
  );
}