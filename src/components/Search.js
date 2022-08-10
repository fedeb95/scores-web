
const Search = ({ 
    filterAttribute,
    setFilterAttribute, 
    filterTextRef, 
    filterScores, 
    isChangingFilter, 
    setChangingFilter }) => {

    const attributes = ["title", "author"];

    const buttons = attributes.map((attr) => {
        const attrClassName = filterAttribute === attr? 
            "flex mx-2 px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
            : "flex mx-2 px-2 py-1 border border-transparent text-sm font-medium rounded-md text-black bg-blue-300 hover:bg-blue-200 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:bg-blue-400 transition duration-150 ease-in-out"
                        ;
        return <button key={attr}
                        className={ attrClassName }
                        onClick={() => {
                                setFilterAttribute(attr);
                            }
                        }>
                            {attr.replace(/^\w/, (c) => c.toUpperCase())}
                        </button>;
    });
    
    return (
        <div>
            <div className={"flex flex-row my-1"}>
                <p>Search: </p>
                { buttons }
            </div>
            <div className={"py-1"}>
                <input
                    ref={filterTextRef}
                    type="text"
                    onKeyUp={(e) => filterScores()}
                    className={
                        "bg-gray-200 border px-2 border-gray-300 w-full mr-4"
                    }
                />
            </div>
        </div>
    );
};

export default Search;
