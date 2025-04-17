export function KeywordSearch({ turnIntoTags }) {

    function handleChange(terms) {
        return turnIntoTags(terms, "keyword");
    }
    return (
        <input type="text" className="brownBorder bg-white rounded-md pl-1" onChange={ e => handleChange(e.target.value) } ></input>
    )
}