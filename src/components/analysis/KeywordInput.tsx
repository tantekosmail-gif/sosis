"use client";

import { useFilterStore } from "@/stores/filterStore";

export default function KeywordInput(){

    const{

        keyword,

        setKeyword

    }=useFilterStore();

    return(

        <div>

            <label className="text-sm font-medium">

                Keyword / Hashtag / Channel

            </label>

            <input

                value={keyword}

                onChange={(e)=>setKeyword(e.target.value)}

                placeholder="Contoh : Kemacetan Jakarta"

                className="border rounded-xl w-full mt-2 p-3"

            />

        </div>

    )

}