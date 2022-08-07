
const Search = ({ filterAttribute, filterTextRef, filterScores, isChangingFilter, setChangingFilter }) => {

    return (
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
    );
};

export default Search;
