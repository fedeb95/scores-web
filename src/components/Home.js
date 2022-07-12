import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import RecoverPassword from "./RecoverPassword";
import ScoreItem from "./ScoreItem";

const Home = ({ user }) => {
    const [recoveryToken, setRecoveryToken] = useState(null);
    const [scores, setScores] = useState([]);
    const newTaskTextRef = useRef();
    const [errorText, setError] = useState("");

    useEffect(() => {
        /* Recovery url is of the form
         * <SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
         * Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
         */
        let url = window.location.hash;
        let query = url.slice(1);
        let result = {};

        query.split("&").forEach((part) => {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });

        if (result.type === "recovery") {
            setRecoveryToken(result.access_token);
        }

        fetchScores().catch(console.error);
    }, []);

    const fetchScores = async () => {
        let { data: scores, error } = await supabase
            .from("scores")
            .select("*")
            .eq('created_by', user.id)
            .order("id", { ascending: false });
        if (error) console.log("error", error);
        else setScores(scores);
    };

    const deleteScore = async (id) => {
        try {
            await supabase.from("scores").delete().eq("id", id);
            setScores(scores.filter((x) => x.id !== id));
        } catch (error) {
            console.log("error", error);
        }
    };

    const addScore = async () => {
        let taskText = newTaskTextRef.current.value;
        let task = taskText.trim();
        if (task.length <= 3) {
            setError("Task length should be more than 3!");
        } else {
            let { data: score, error } = await supabase
                .from("scores")
                .insert({ url: task, created_by: user.id })
                .single();
            if (error) setError(error.message);
            else {
                setScores([score, ...scores]);
                setError(null);
                newTaskTextRef.current.value = "";
            }
        }
    };

    const handleLogout = async () => {
        supabase.auth.signOut().catch(console.error);
    };

    return recoveryToken ? (
        <RecoverPassword
            token={recoveryToken}
            setRecoveryToken={setRecoveryToken}
        />
    ) : (
        <div >
            <header
                className={
                    "flex justify-between items-center px-4 h-16 bg-gray-900"
                }
            >
                <span
                    className={
                        "text-2xl sm:text-4xl text-white border-b font-sans"
                    }
                >
                    Score List.
                </span>
                <button
                    onClick={handleLogout}
                    className={
                        "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                    }
                >
                    Logout
                </button>
            </header>
            <div
                className={"flex flex-col flex-grow p-4"}
                style={{ height: "calc(80vh - 11.5rem)" }}
            >
                <div
                    className={`p-2 border flex-grow grid gap-2 ${
                        scores.length ? "auto-rows-min" : ""
                    } grid-cols-1 h-2/3 overflow-y-scroll first:mt-8`}
                >
                    {scores.length ? (
                        scores.map((score) => (
                            <ScoreItem
                                key={score.id}
                                todo={score}
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
                {!!errorText && (
                    <div
                        className={
                            "border max-w-sm self-center px-4 py-2 mt-4 text-center text-sm bg-red-100 border-red-300 text-red-400"
                        }
                    >
                        {errorText}
                    </div>
                )}
            </div>
            <div className={"flex m-4 mt-0 h-10"}>
                <input
                    ref={newTaskTextRef}
                    type="text"
                    onKeyUp={(e) => e.key === "Enter" && addScore()}
                    className={
                        "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                    }
                />
                <button
                    onClick={addScore}
                    className={
                        "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                    }
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default Home;
