import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import AddScore from "./AddScore";
import RecoverPassword from "./RecoverPassword";
import ScoreList from "./ScoreList";

const Home = ({ user }) => {
    const [recoveryToken, setRecoveryToken] = useState(null);
    const [scores, setScores] = useState([]);
    const titleTextRef = useRef();
    const authorTextRef = useRef();

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
    }, []);

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
        if(query.length > 2){
            let { data: scores, error } = await supabase
            .from("scores")
            .select("*")
            .textSearch(filterAttribute, query+':*')
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
                
                { !isAddingScore?
                // TODO make component and add hidden md:inline copy below!
                <div className={"columns-2"}>
                    <p>Search: </p>
                    <input
                            ref={filterTextRef}
                            type="text"
                            onKeyUp={(e) => filterScores()}
                            className={
                                "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                            }
                        />

                    <button
                        onClick={() => setChangingFilter(!isChangingFilter)}
                        className={
                            "flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                        }
                    >{filterAttribute.replace(/^\w/, (c) => c.toUpperCase())}</button>

                </div>
                :
                <div></div>
                }

                { isChangingFilter? 
                    <div className={"flex flex-col"}>
                        <button 
                        className={ 
                            "flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                        }
                        onClick={() => {
                                setFilterAttribute('title');
                                setChangingFilter(false);
                            }
                        }>
                            Title
                        </button>
                        <button 
                        className={ 
                            "flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                        }
                        onClick={() => {
                                setFilterAttribute('author');
                                setChangingFilter(false);
                            }
                        }>
                            Author
                        </button>
                    </div> 
                    : <div></div>}
                {(!isChangingFilter && ! isAddingScore)?
                    <ScoreList scores={scores} setScores={setScores}></ScoreList>
                    : 
                    <div></div>
                }
            
            <div className={"hidden md:inline"}>
                <ScoreList scores={scores} setScores={setScores}></ScoreList>
            </div>

            <div className={"flex-col m-4 mt-0 h-10"}>
            <div 
                className={"hidden md:inline"}>
            <AddScore 
                user={user} 
                setError={setError} 
                setScores={setScores} 
                scores={scores}
            ></AddScore>
            </div>
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
                
                    <AddScore 
                        user={user} 
                        setError={setError} 
                        setScores={setScores} 
                        scores={scores}
                    ></AddScore>
               </div>
                :
                    
                <div>
                <button
                    onClick={() => setAddingScore(true)}
                    className={
                        "md:hidden flex my-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                    }
                    >
                        Add new score
                    </button>
                </div>
        
                }
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
