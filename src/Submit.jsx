import axios from 'axios';

const client_id = "37-gzkllJQN8xs7OysJooQ";
const client_secret = "I985YGV953btvEufGVqelyPzjChDIQ";
const hf_token = "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";

let posts = [];
let fullposts = [];
let overallSentiment = {positive: 0, neutral: 0, negative: 0};

const auth_string = btoa(`${client_id}:${client_secret}`);
const headers = {
  //'User-Agent': 'PublicSearchBot/0.0.1',
  'Authorization': `Basic ${auth_string}`
};
const data = { grant_type: 'client_credentials' };
 
async function getToken() {
  try {
    const token_response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams(data).toString(),
      { headers }
    );
    
    const token_data = token_response.data;
    if (!token_data.access_token) {
      console.error("Error: 'access_token' not found in response");
      process.exit(1);
    }
    return token_data.access_token;
  } catch (error) {
    console.error(`Token Error: ${error.response?.status} - ${error.response?.data}`);
    process.exit(1);
    // alert("Please reload and try again");
  }
}

async function searchReddit(access_token, keyword, subreddit, flair, sortby, time) {
  const search_headers = {
    //'User-Agent': 'PublicSearchBot/0.0.1',
    'Authorization': `bearer ${access_token}`
  };

  let searchString = "";

  if (keyword.length > 0) {
    searchString += keyword.join(" ");
    searchString += " ";
  }
  if (subreddit.length > 0) {
    subreddit = subreddit.map(sub => "r/"+sub);
    searchString += subreddit.join(" ");
    searchString += " ";
  }
  if (flair.length > 0) {
    flair = flair.map(fla => "flair:"+fla);
    searchString += flair.join(" ");
    searchString += " ";
  }
  searchString = searchString.trim();

  const search_params = {
    q: searchString,
    limit: 10,
    sort: sortby,
    t: time,
    type: 'comment,link'
  };

  // console.log("searchString:", searchString)

  try {
    const search_response = await axios.get('https://oauth.reddit.com/search', {
      headers: search_headers,
      params: search_params
    });

    const results = search_response.data.data.children;
    // console.log('Raw Results:', results.map(item => item.kind));
    if (!results.length) {
      console.log(`No posts or comments found for '${keyword}'.`);
      return;
    }

    for (const item of results) {
      const data = item.data;
      let analysisString = "";
      

      const regex = new RegExp(`\\b${keyword}\\b`, 'i');

        // Add sentiment or not
      if (item.kind === 't3') {
        if (data.title) {
          analysisString += data.title;
          fullposts.push({
            title: data.title, 
            text: data.selftext,
            subreddit: data.subreddit,
            author: data.author,
            upvote_ratio: data.upvote_ratio,
            ups: data.ups,
            link_flair_text: data.link_flair_text,
            permalink: data.permalink,
            created: data.created
         })

        }
        if (data.selftext) {
          let text = data.selftext;
          if (data.selftext.length > 500) { text = text.slice(0,500) + "..." }
          analysisString +=  " " + text;
        }
        posts.push(analysisString);
      }
    }
  } catch (error) {
    console.error(`Search Error: ${error.response?.status} - ${error.response?.data}`);
    // alert("Please reload and try again");
  }
}

async function query(data) {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
        {
          headers: {
            Authorization: `Bearer ${hf_token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ inputs: data }),
        }
      );
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit: wait longer
          const delay = baseDelay * 2 ** attempt;
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Hugging Face Attempt ${attempt} Error: ${error.message}`);
      if (attempt === maxRetries) {
        console.error('Hugging Face API failed after retries');
        // alert('Sentiment analysis failed. Please try again later.');
        return null;
      }
      const delay = baseDelay * 2 ** attempt;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return null;
}

export function Submit({ tagsList, time, sortBy, updateSentiment, updateFullPosts, updateButtonPressed, hideLoading, showLoading }) {

      async function main() {
        if (tagsList.keyword.length === 0 && tagsList.subreddit.length === 0 && tagsList.flair.length === 0) {
            alert(" Enter at least one tag ");
            return;
        }
        showLoading();
        const access_token = await getToken();
        const keyword = tagsList.keyword;
        const subreddit = tagsList.subreddit;
        const flair = tagsList.flair;
        await searchReddit(access_token, keyword, subreddit, flair, sortBy, time);
        for (const post of fullposts) {
  if (post) {
    let postTitle = post.title;
    const response = await query(postTitle);
    if (!response || !response[0]) {
      console.warn(`Skipping post "${postTitle}" due to invalid response`);
      continue;
    }
    let max = 0;
    let maxSentiment = "";
    for (const sentiment of response[0]) {
      let feeling = sentiment.label.toLowerCase();
      let amount = sentiment.score;
      overallSentiment[feeling] += amount;
      if (amount > max) {
        max = amount;
        maxSentiment = feeling;
      }
    }
    post.sentiment = maxSentiment;
  }
}
        // console.log("overallSentiment:", overallSentiment);
        // console.log("fullposts:", fullposts);
        updateSentiment(overallSentiment);
        updateFullPosts(fullposts);
        updateButtonPressed();
        posts = [];
        fullposts = [];
        overallSentiment = {positive: 0, neutral: 0, negative: 0};
        hideLoading();
      }


    return (
        <button onClick={ main } className="brownBackground rounded-md text-amber-50 p-1 mt-5">search results</button>
    )
}