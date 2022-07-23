import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ScoreItem = ({ score, onDelete }) => {

    return (
        <div
            className={"p-1 max-h-14 flex align-center justify-between border"}
        >
            <span className={"truncate flex-grow"}>
                    {score.title}, {score.author}
            </span>
            <button
                className={"font-mono text-red-500 text-xl border px-2"}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                }}
            >
                X
            </button>
        </div>
    );
};

export default ScoreItem;
