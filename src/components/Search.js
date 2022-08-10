
const Search = ({ 
    filterAttribute,
    setFilterAttribute, 
    filterTextRef, 
    filterScores, 
    isChangingFilter, 
    setChangingFilter }) => {

    return (
        <div>
            <p className={"py-2"}>Search: </p>
            <div className={"columns-2"}>
                <div className={" py-1"}>
                    <input
                            ref={filterTextRef}
                            type="text"
                            onKeyUp={(e) => filterScores()}
                            className={
                                "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                            }
                        />
                </div>
                <div className={"columns-4"}>
                    <button
                        onClick={() => setChangingFilter(!isChangingFilter)}
                        className={
                            "flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                        }
                    >{filterAttribute.replace(/^\w/, (c) => c.toUpperCase())}</button>

                
                { isChangingFilter? 
                    <div className={""}>
                        <button 
                        className={ 
                            "flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-blue active:bg-red-700 transition duration-150 ease-in-out"
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
                            "flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-blue active:bg-red-700 transition duration-150 ease-in-out"
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
                                    </div>
            </div>
        </div>
    );
};

export default Search;
