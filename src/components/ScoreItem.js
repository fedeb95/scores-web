import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ScoreItem = ({ score, onDelete, setError, setActiveFile }) => {

    const loadPdfFile = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fileName = score.url;
        const { data, error } = await supabase.storage.from('scores-files')
            .download(fileName);
        
        setActiveFile(data);       
        if(error){
            setError(error.message);
        }
    }


    const downloadFile = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fileName = score.url;
        const { data, error } = await supabase.storage.from('scores-files')
            .download(fileName);

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = `${fileName}-${+new Date()}.pdf`;
        link.target = "_self";
        link.click();         
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
                onClick={loadPdfFile}
            >
            &#128065;
            </button>
            <button
                className={"px-2"}
                onClick={downloadFile}
            >
            &#11015;
            </button>
            <button
                className={"px-2"}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                }}
            >
                &#128683;
            </button>
        </div>
    );
};

export default ScoreItem;
