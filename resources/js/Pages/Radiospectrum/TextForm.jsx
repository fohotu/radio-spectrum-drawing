import React,{useState} from 'react'

function TextForm(props) {

    const {group_id,setFrGroups,frGroups} = props; 
    const [txt,setTxt] = useState("");
    const save = () => {
        let label = {
            id: "title-"+(Date.now() + Math.random()).toString(),
            type:"title",
            label:txt,
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
        }

        setFrGroups((prev) =>
        prev.map((group) => {
            if (group.id === group_id) {
                return {
                    ...group,
                    elements: [...group.elements, label],
                };
            }
                return group;
            })
        );
    }

    return (
        <div>
            <input type="text" onChange={(e) => setTxt(e.target.value)} />
            <button onClick={()=>save()}>save</button>
        </div>
    )
}

export default TextForm