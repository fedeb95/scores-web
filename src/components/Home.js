import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import AddScore from "./AddScore";
import RecoverPassword from "./RecoverPassword";
import ScoreList from "./ScoreList";
import Search from "./Search";

const Home = ({ user }) => {
    const [recoveryToken, setRecoveryToken] = useState(null);
    const [scores, setScores] = useState([]);

    const filterTextRef = useRef();
    const [isChangingFilter, setChangingFilter] = useState(false);
    const [isAddingScore, setAddingScore] = useState(false);
    const [filterAttribute, setFilterAttribute] = useState('title');

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

        filterScores().catch(console.error);
    }, [recoveryToken]);

    useEffect(() => {
        filterScores();
    }, [filterAttribute]);

    const fetchScores = async () => {
        let { data: scores, error } = await supabase
            .from("scores")
            .select("*")
            .eq('created_by', user.id)
            .order("id", { ascending: false });
        if (error) console.log("error", error);
        else setScores(scores);
    };

    const filterScores = async () => {
        let query = filterTextRef.current.value.trim();
        if(query.length > 0){
            let queryString = query.split(' ').map(t => t+":* & ").join('').slice(0, -2);
            console.log(queryString);
            let { data: scores, error } = await supabase
            .from("scores")
            .select("*")
            .textSearch(filterAttribute, queryString)
            .order("id", { ascending: false });
            if (error) console.log("error", error);
            else setScores(scores);
        }else{
            fetchScores();
        }
    };

    const handleLogout = async () => {
        supabase.auth.signOut().catch(console.error);
    };

    let searchClassName = "";
    if(isAddingScore){
        searchClassName = "hidden md:inline";
    }else{
        searchClassName = "";
    }

    let addScoreClassName = "hidden md:inline";
    if(isAddingScore){
        addScoreClassName = "";
    }else{
        addScoreClassName = "hidden md:inline";
    }

    return recoveryToken ? (
        <RecoverPassword
            token={recoveryToken}
            setRecoveryToken={setRecoveryToken}
        />
    ) : (
        <div className={""}>
            <header
                className={
                    "flex justify-between items-center px-10 h-16 bg-gray-900"
                }
            >
                <span
                    className={
                        "text-2xl sm:text-4xl text-white  font-sans"
                    }
                >
                    Scores
                </span>
                <button
                    onClick={handleLogout}
                    className={
                        "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                    }
                >
                    Logout
                </button>
                {/* <svg class="h-screen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg> */}
            </header>
            <div className={" px-6 md:columns-2 "}>
                <div className={searchClassName}>
                    <Search 
                        filterAttribute={filterAttribute} 
                        setFilterAttribute={setFilterAttribute}
                        filterTextRef={filterTextRef}
                        filterScores={filterScores}
                        isChangingFilter={isChangingFilter}
                        setChangingFilter={setChangingFilter}
                    ></Search>
                </div>

                {!isAddingScore?
                    <div className="md:hidden">
                    <ScoreList scores={scores} setScores={setScores} setError={setError}></ScoreList>
                    </div>
                    : 
                    <div></div>
                }
            
            <div className={"hidden md:inline"}>
                <ScoreList scores={scores} setScores={setScores} setError={setError}></ScoreList>
            </div>

            <div className={"flex-col m-0 mt-4 h-10"}>
            <div
                className={"md:hidden"}>    
                { isAddingScore? 
               
               <div>
                    <button
                        onClick={() => setAddingScore(false)}
                        className={
                            "md:hidden self-end my-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                        }
                        >
                            Back
                        </button>
                
                   
               </div>
                :
                    
                <div className="">
                <button
                    onClick={() => {
                            setError(null);
                            setAddingScore(true);
                        }
                    }
                    className={
                        "md:hidden flex my-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                    }
                    >
                        Add new score
                    </button>
                </div>
        
                }
            </div>
            <div className={addScoreClassName}>
                        <AddScore 
                            user={user}
                            setScores={setScores} 
                            scores={scores}
                            setAddingScore={setAddingScore}
                        ></AddScore>
                </div>
            </div>
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
    );
};

export default Home;
