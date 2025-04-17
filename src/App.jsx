import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons';
import { faDroplet, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Search } from './Search';
import { Results } from './Results';
import { UserPosts } from './UserPosts';

function App() {

  const [tagsList, setTagsList] = useState({keyword: [], subreddit: [], flair: []});

    function turnIntoTags(terms, key) {
        const currentTags = terms.split(",")
        .map(term => term.trim())
        .filter(term => term.trim() !== "");
        setTagsList(prevTagsList => ({
            ...prevTagsList, [key] : currentTags
        }));
    };
  
    const [time, setTime] = useState("relevance");
    function updateTime(value) {
      setTime(value);
    };

    const [sortBy, setSortBy] = useState("all");
    function updateSortBy(value) {
      setSortBy(value);
    };

    const [sentiment, setSentiment] = useState({positive: 0, neutral: 0, negative: 0});
    function updateSentiment(value) {
      setSentiment(value);
    };

    const [fullPosts, setFullPosts] = useState([]);
    function updateFullPosts(value) {
      setFullPosts(value);
    }

    const [buttonPressed, setButtonPressed] = useState(false);
    function updateButtonPressed() {
      setButtonPressed(true);
    };

    const [loading, setLoading] = useState(false);
    function hideLoading() {
      setLoading(false);
    };
    function showLoading() {
      setLoading(true);
    };


  return (
    <div className="flex flex-col items-center">
      <div className='mt-10 relative'>
        <FontAwesomeIcon className='blue absolute right-2.5 bottom-0' icon={faDroplet} />
        <FontAwesomeIcon icon={faRedditAlien} className="text-6xl" />
      </div>
      <h1 className="text-center mt-5 text-3xl font-bold">RedTakes</h1>
      <h2 className="text-center text-lg">
        know the <span className='pink'>sentiment </span>
         of Reddit users on <span className='pink'>anything</span>
      </h2>
      <FontAwesomeIcon icon={faArrowDown} className='text-center text-3xl mt-5 mb-5'></FontAwesomeIcon>
      <Search turnIntoTags={ turnIntoTags } updateTime={ updateTime } updateSortBy={ updateSortBy } 
      tagsList={ tagsList } time={ time } sortBy={ sortBy } updateSentiment={ updateSentiment } updateFullPosts={ updateFullPosts } 
      updateButtonPressed={ updateButtonPressed } hideLoading={ hideLoading } showLoading={ showLoading }/>
      <Results sentiment={ sentiment } buttonPressed={ buttonPressed } loading={ loading } fullPosts={ fullPosts }/>
      <UserPosts fullPosts={ fullPosts } loading={ loading } />
    </div>

  );
}

export default App;