import { supabase } from "../lib/supabaseClient";
import ScoreItem from "./ScoreItem";

const ScoreList = ({ scores, setScores, setError }) => {
    const deleteScore = async (score) => {
        const id = score.id;
        try {
            console.log(score.url);
            let { error: error} = await supabase.storage.from("scores-files").remove([score.url]);
            if(error){
                setError(error.message);
            }else{
                await supabase.from("scores").delete().eq("id", id);
                setScores(scores.filter((x) => x.id !== id));
            }
        } catch (error) {
            console.log("error", error);
        }
        setError(null);
    };

    return (
        <div
            className={"flex flex-col grow"}
            style={{ height: "calc(85vh - 10.5rem)" }}
        >
            <div
                className={`border-x flex-grow grid ${
                    scores.length ? "auto-rows-min" : ""
                } grid-cols-1 h-2/3 overflow-y-scroll first:mt-3`}
            >
                {scores.length ? (
                    scores.map((score) => (
                        <ScoreItem
                            key={score.id}
                            score={score}
                            onDelete={() => deleteScore(score)}
                            setError={setError}
                        />
                    ))
                ) : (
                    <span
                        className={
                            "h-full flex justify-center items-center"
                        }
                    >
                        You do have any scores yet!
                    </span>
                )}
            </div>
        </div> 
    );
};

export default ScoreList;
