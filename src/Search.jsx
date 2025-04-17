import { useState } from 'react';
import { KeywordSearch } from "./KeywordSearch"
import { SubredditSearch } from "./SubredditSearch"
import { FlairSearch } from "./FlairSearch"
import { Submit } from './Submit';
import { TagsBox } from "./TagsBox";

export function Search({ turnIntoTags, updateTime, updateSortBy, tagsList, time, sortBy, updateSentiment, updateFullPosts, updateButtonPressed, hideLoading, showLoading }) {
    
    return (
        <div className="brownBorder flex flex-col items-center rounded-xl p-5 mb-5 bg">
            <h2><b>find the sentiment:</b></h2>
            <h4>enter at least one tag</h4>
            <h4>use commas "," to include multiple tags</h4>
            <h3 className="blue mt-5">search a <b>keyword</b></h3>
            <KeywordSearch turnIntoTags={ turnIntoTags } />
            <h3 className="pink mt-5">search a <b>subreddit</b></h3>
            <SubredditSearch turnIntoTags={ turnIntoTags } />
            <h3 className="yellow mt-5">search a <b>flair</b></h3>
            <FlairSearch turnIntoTags={ turnIntoTags } />
            <div className="flex flex-row gap-5 mt-5">
                <div className=" flex flex-col items-center">
                    <h3><b> time </b></h3>
                    <select className="brownBorder rounded-md" onChange={ e => updateTime(e.target.value)}>
                        <option value="all">All</option>
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                        <option value="hour">Hour</option>
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <h3><b> sort by </b></h3>
                    <select className="brownBorder rounded-md" onChange={ e => updateSortBy(e.target.value)} >
                        <option value="relevance">Relevance</option>
                        <option value="hot">Hot</option>
                        <option value="top">Top</option>
                        <option value="new">New</option>
                        <option value="comments">Comments</option>
                    </select>
                </div>
            </div>
            <TagsBox tagsList={ tagsList } />
            <Submit tagsList={ tagsList } time={ time } sortBy={ sortBy } updateSentiment={ updateSentiment } updateFullPosts={ updateFullPosts } 
            updateButtonPressed={ updateButtonPressed } hideLoading={ hideLoading } showLoading={ showLoading }/>
            
        </div>
        
    )
}