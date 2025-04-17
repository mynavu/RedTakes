export function TagsBox({ tagsList }) {
    return (
        <div className=" w-80 h-auto mt-5 flex flex-row flex-wrap justify-center gap-2">
            { tagsList.keyword.length > 0 && (
                tagsList.keyword.map( word => (
                    <span className="blue blueBackground pr-1 pl-1 rounded-md" key={word}>{ word }</span>
                ))
            )}
            { tagsList.subreddit.length > 0 && (
                tagsList.subreddit.map( word => (
                    <span className="pink pinkBackground pr-1 pl-1 rounded-md" key={word}>{ word }</span>
                ))
            )}
            { tagsList.flair.length > 0 && (
                tagsList.flair.map( word => (
                    <span className="yellow yellowBackground pr-1 pl-1 rounded-md" key={word}>{ word }</span>
                ))
            )}
        </div>
    )
}