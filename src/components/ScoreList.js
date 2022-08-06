import { supabase } from "../lib/supabaseClient";
import ScoreItem from "./ScoreItem";

const ScoreList = ({ scores, setScores }) => {
    const deleteScore = async (id) => {
        try {
            await supabase.from("scores").delete().eq("id", id);
            setScores(scores.filter((x) => x.id !== id));
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <div
            className={"flex flex-col grow"}
            style={{ height: "calc(85vh - 7.5rem)" }}
        >
            <div
                className={`p-2 border flex-grow grid ${
                    scores.length ? "auto-rows-min" : ""
                } grid-cols-1 h-2/3 overflow-y-scroll first:mt-8`}
            >
                {scores.length ? (
                    scores.map((score) => (
                        <ScoreItem
                            key={score.id}
                            score={score}
                            onDelete={() => deleteScore(score.id)}
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
