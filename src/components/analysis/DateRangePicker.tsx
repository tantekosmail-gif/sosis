"use client";

import { useFilterStore } from "@/stores/filterStore";

export default function DateRangePicker(){

    const{

        startDate,

        endDate,

        setStartDate,

        setEndDate

    }=useFilterStore();

    return(

        <>

            <input

                type="date"

                value={startDate}

                onChange={(e)=>setStartDate(e.target.value)}

                className="border rounded-xl p-3"

            />

            <input

                type="date"

                value={endDate}

                onChange={(e)=>setEndDate(e.target.value)}

                className="border rounded-xl p-3"

            />

        </>

    )

}