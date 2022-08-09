import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ScoreItem = ({ score, onDelete, setError }) => {

    const downloadFile = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fileName = score.url;
        const { data, error } = await supabase.storage.from('scores-files')
            .download(fileName);
        const fileURL = URL.createObjectURL(data);
        //Open the URL on new Window
        const pdfWindow = window.open();
        pdfWindow.location.href = fileURL;         
        if(error){
            console.log(error);
        }
    }

    return (
        <div
            className={"p-1 max-h-14 flex align-center justify-between border"}
        >
            <span className={"truncate flex-grow"}>
                    {score.title}, {score.author}
            </span>
            <button
                onClick={downloadFile}
            >
                Download
            </button>
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
