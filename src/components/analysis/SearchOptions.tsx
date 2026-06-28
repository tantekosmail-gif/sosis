"use client";

export default function SearchOptions(){

    return(

        <div className="grid grid-cols-4 gap-4">

            <input

                defaultValue={20}

                type="number"

                className="border rounded-xl p-3"

                placeholder="Video Limit"

            />

            <input

                defaultValue={50}

                type="number"

                className="border rounded-xl p-3"

                placeholder="Comment Limit"

            />

            <select className="border rounded-xl p-3">

                <option value="id">

                    Indonesia

                </option>

                <option value="en">

                    English

                </option>

            </select>

            <select className="border rounded-xl p-3">

                <option>

                    Relevance

                </option>

                <option>

                    Latest

                </option>

                <option>

                    Most Viewed

                </option>

            </select>

        </div>

    )

}