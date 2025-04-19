export function UserPosts({ fullPosts, loading }) {
    const colorSet = { positive: "#00bf91", neutral: "#ec9400", negative: "#e04d93" };
    const highlightSetTransparent = {
        positive: "rgba(217, 255, 169, 0.5)",
        neutral: "rgba(255, 232, 136, 0.5)",
        negative: "rgba(255, 178, 187, 0.5)",
      };
      const formatUnixTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };
      
    return (
        <div className={`gap-2 max-w-150 mb-20 ${!loading ? "flex flex-col" : "hidden"}`}>
            {fullPosts.map(post =>
                (
                <div className="brownBorder rounded-xl p-2" key={post.created}>
                    <h4>by <span className="font-bold">{post.author}</span> on {formatUnixTimestamp(post.created)}</h4>
                    <h4>r/{post.subreddit}</h4>
                    <h3 className="font-bold underline"><a target="_blank" href={`https://www.reddit.com${post.permalink}`}>{post.title}</a></h3>
                    <h4>{post.text}</h4>
                    <h4 className={`mt-2 ${post.sentiment ? "block" : "hidden"}`}> <span className="rounded-md pl-1 pr-1" style={{ color: colorSet[post.sentiment], background: highlightSetTransparent[post.sentiment] }}>{post.sentiment}</span></h4>
                </div>
                )
             )}
        </div>
    )
}