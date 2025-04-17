export function FlairSearch({ turnIntoTags }) {
    function handleChange(terms) {
        return turnIntoTags(terms, "flair");
    }

    return (
        <input type="text" className="brownBorder bg-white rounded-md pl-1" onChange={ e => handleChange(e.target.value) }></input>
    )
}