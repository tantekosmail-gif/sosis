"use client";

import { useFilterStore } from "@/stores/filterStore";

export default function PlatformSelect(){

    const{

        platform,

        setPlatform

    }=useFilterStore();

    return(

        <select

            value={platform}

            onChange={(e)=>setPlatform(e.target.value)}

            className="border rounded-xl p-3"

        >

            <option value="youtube">

                Youtube

            </option>

            <option value="facebook">

                Facebook

            </option>

            <option value="instagram">

                Instagram

            </option>

            <option value="tiktok">

                TikTok

            </option>

        </select>

    )

}