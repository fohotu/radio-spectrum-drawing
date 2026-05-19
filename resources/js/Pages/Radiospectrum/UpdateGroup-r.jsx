import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function UpdateGroup(props) {

    const {
        activeGroup,
        setFrGroups,
        frGroups,
        pageWidth,
        closeCallback,
    } = props;

    const { translations } = usePage().props;

    const [rows, setRows] = useState([]);
    const [scale, setScale] = useState(0.5);

    const [groupHeadLine, setGroupHeadLine] = useState({
        id: "title-" + (Date.now() + Math.random()).toString(),
        type: "title",
        label: "",
        x: 10,
        y: -100,
        width: 200,
        height: 50,
        visible_begin: false,
        visible_end: false,
        bgColor: "#ffffff",
    });

    // LOAD ACTIVE GROUP
    useEffect(() => {

        if (!activeGroup) return;

        const group = frGroups.find(
            (g) => g.id === activeGroup.id
        );

        if (!group) return;

        setScale(Number(group.scale) || 0.5);

        setRows(
            group.elements
                .filter((el) => el.type !== "title")
                .map((el) => ({ ...el }))
        );

        const headLine =
            group.elements.find(
                (el) => el.type === "title"
            );

        if (headLine) {
            setGroupHeadLine({
                ...headLine
            });
        }

    }, [activeGroup, frGroups]);

    // GET MIN MAX
    function getMinMax(ranges) {

        let min = Infinity;
        let max = -Infinity;

        ranges.forEach((r) => {

            const begin =
                Number(r.fr_begin);

            const end =
                Number(r.fr_end);

            if (
                !isNaN(begin) &&
                begin < min
            ) {
                min = begin;
            }

            if (
                !isNaN(end) &&
                end > max
            ) {
                max = end;
            }
        });

        return {
            min:
                min === Infinity
                    ? 0
                    : min,

            max:
                max === -Infinity
                    ? 0
                    : max,
        };
    }

    // LAYOUT LEVELS
    function layoutIntervals(intervals) {

        const sorted = [...intervals]
            .map(item => ({ ...item }))
            .sort((a, b) => {

                const orderDiff =
                    Number(a.order) -
                    Number(b.order);

                if (orderDiff !== 0) {
                    return orderDiff;
                }

                if (
                    a.fr_begin ===
                    b.fr_begin
                ) {
                    return (
                        b.fr_end -
                        a.fr_end
                    );
                }

                return (
                    a.fr_begin -
                    b.fr_begin
                );
            });

        const levels = [];

        for (const interval of sorted) {

            let placed = false;

            for (
                let levelIndex = 0;
                levelIndex < levels.length;
                levelIndex++
            ) {

                const level =
                    levels[levelIndex];

                const last =
                    level[level.length - 1];

                if (
                    interval.fr_begin >=
                    last.fr_end
                ) {

                    level.push(interval);

                    interval.level =
                        levelIndex;

                    placed = true;

                    break;
                }
            }

            if (!placed) {

                levels.push([interval]);

                interval.level =
                    levels.length - 1;
            }
        }

        return sorted;
    }

    // CALCULATE COORDINATES
    const cordinate = (data) => {

        console.log(data,'data');

        const sorted = [...data].sort(
            (a, b) =>
                Number(a.order) -
                Number(b.order)
        );

        const { min, max } =
            getMinMax(sorted);

        const total =
            max - min || 1;

        return sorted.map((item) => {

            const start =
                (
                    (
                        item.fr_begin - min
                    ) / total
                ) *
                pageWidth *
                Number(scale);

            const end =
                (
                    (
                        item.fr_end - min
                    ) / total
                ) *
                pageWidth *
                Number(scale);

            const width =
                end - start;

            const height =
                Number(
                    item.heightRow
                ) || 100;

            const autoY =
                (
                    Number(item.order) - 1
                ) * height;

            const oldItem =
                rows.find(
                    (r) =>
                        r.id === item.id
                );

            return {
                ...item,

                type:
                    "group_denomination",

                // KEEP OLD POSITION
                x:
                    item.x ??
                    oldItem?.x ??
                    start,

                y:
                    item.y ??
                    oldItem?.y ??
                    autoY,

                width,
                height,

                order:
                    Number(item.order),

                heightRow: height,

                visible_begin: true,
                visible_end: true,
            };
        });
    };

    // ADD ROW
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

                order: 1,

                heightRow: 100,
            },
        ]);
    };

    // DELETE ROW
    const deleteRow = (id) => {

        setRows((prev) =>
            prev.filter(
                (row) =>
                    row.id !== id
            )
        );
    };

    // UPDATE FIELD
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

    // CANCEL
    const cancel = () => {

        if (closeCallback) {
            closeCallback();
        }
    };

    // SAVE
    const saveData = () => {

        const new_elements =
            layoutIntervals(rows);

        const cordinated =
            cordinate(new_elements);

        const finalElements =
            [...cordinated];

        if (groupHeadLine.label) {

            finalElements.push({
                ...groupHeadLine
            });
        }

        setFrGroups((prev) =>

            prev.map((group) =>

                group.id ===
                activeGroup.id

                    ? {
                        ...group,

                        scale:
                            Number(scale),

                        elements:
                            finalElements,
                    }

                    : group
            )
        );

        if (closeCallback) {
            closeCallback();
        }
    };

    return (
        <div className="p-2">

            <div className="bg-gray-900 border border-gray-700 overflow-hidden">

                {/* TOP */}
                <div className="p-4 border-b border-gray-700 bg-gray-800">

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-4">

                        <div>

                            <label className="block text-sm text-gray-300 mb-1">
                                {translations.system.headline}
                            </label>

                            <input
                                value={
                                    groupHeadLine.label
                                }
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
                                onChange={(e) =>
                                    setGroupHeadLine({
                                        ...groupHeadLine,
                                        label:
                                            e.target.value
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
                                onChange={(e) =>
                                    setScale(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
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

            </div>
        </div>
    );
}