import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {v4 as uuidv4} from 'uuid';

const AddScore = ({ user, setScores, scores, setAddingScore }) => {
    const titleTextRef = useRef();
    const authorTextRef = useRef();
    const [file, setFile] = useState();
    const [errorText, setError] = useState();
    
    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const addScore = async () => {
        let titleText = titleTextRef.current.value;
        let authorText = authorTextRef.current.value;

        let title = titleText.trim();
        let author = authorText.trim();
        
        if(!file){
            setError("Please upload a pdf file.");
            return;
        }

        const fileExt = file.name.split('.').pop()
        if(!['pdf', 'png', 'jpg', 'jpeg'].includes(fileExt)){
            setError("Only pdf files are allowed!");
            return;
        }
        const fileName = user.id+'/'+uuidv4()+'-'+file.name;
        console.log(fileName);

        if (title.length <= 3) {
            setError("Title length should be more than 3!");
        } else {
            let { data: score, error } = await supabase
                .from("scores")
                .insert({ 
                    title: title, 
                    url: fileName, 
                    author: author, 
                    created_by: user.id 
                }).single();
            if (error){
                setError(error.message);
            } else {
                const { data, error } = await supabase.storage
                    .from('scores-files')
                    .upload(fileName, file)
                if(error){
                    await supabase.from("scores")
                        .delete().eq("id", score.id);
                    setError(error.message);
                    // TODO when loading scores, if no file exists, delete it
                    // and maybe tell user
                }else{
                    setScores([score, ...scores]);
                    setError(null);
                    titleTextRef.current.value = "";
                    authorTextRef.current.value = "";
                    setAddingScore(false);
                }
            }
        }
    };

    return (
                <div className={""}>
                    <div>
                        <p>Title</p>
                    </div>
                    <input
                        ref={titleTextRef}
                        type="text"
                        onKeyUp={(e) => e.key === "Enter" && addScore()}
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                    />
                    <p>Author</p>
                    <input
                        ref={authorTextRef}
                        type="text"
                        onKeyUp={(e) => e.key === "Enter" && addScore()}
                        className={
                            "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                        }
                    />
                    <p>File</p>
                    <input
                        onChange={onFileChange}
                        type="file"
                        id="score"
                        // accept="pdf/*"
                    />
                    {!!errorText && (
                        <div
                            className={
                                "border max-w-sm self-center px-4 py-2 mt-4 text-center text-sm bg-red-100 border-red-300 text-red-400"
                            }
                        >
                            {errorText}
                        </div>
                    )}
                    <button
                        onClick={async () => {
                                addScore();
                            }
                        }
                        className={
                            "flex justify-center my-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                        }
                    >
                        Save
                    </button>
                </div>
    );
};

export default AddScore;
