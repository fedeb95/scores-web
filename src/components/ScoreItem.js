import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ScoreItem = ({ score, onDelete, setError, setPdfFile }) => {

    const downloadFile = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fileName = score.url;
        const { data, error } = await supabase.storage.from('scores-files')
            .download(fileName);
        
        setPdfFile(data);
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = `${fileName}-${+new Date()}.pdf`;
        //link.click();         
        if(error){
            setError(error.message);
        }
    }

    return (
        <div
            className={"p-1 max-h-14 flex align-center justify-between border-y"}
        >
            <span className={"truncate flex-grow"}>
                    {score.title}, {score.author}
            </span>
            <button
                className={"px-2"}
                onClick={downloadFile}
            >
            &#11015;
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
