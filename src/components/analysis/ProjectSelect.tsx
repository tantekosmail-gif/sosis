"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTopicStore } from "@/store/topic.store";

export default function ProjectSelect() {

    const setTopicId = useTopicStore(s=>s.setTopicId);

    const [topics,setTopics]=useState<any[]>([]);

    useEffect(()=>{

        async function load(){

            const {data}=await supabase

                .from("topics")

                .select("id,name")

                .eq("status","active");

            setTopics(data||[]);

        }

        load();

    },[]);

    return(

        <select

            className="border rounded-xl p-3"

            onChange={(e)=>setTopicId(e.target.value)}

        >

            <option value="">

                Select Project

            </option>

            {

                topics.map(item=>(

                    <option

                        key={item.id}

                        value={item.id}

                    >

                        {item.name}

                    </option>

                ))

            }

        </select>

    )

}