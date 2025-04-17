import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceMeh, faFaceSmile, faFaceAngry } from '@fortawesome/free-solid-svg-icons';


export function Results({ sentiment, buttonPressed, loading, fullPosts }) {
  const svgRef = useRef(null);
  const colorSet = { positive: "#00bf91", neutral: "#ffc326", negative: "#e04d93" };
  const sum = Object.values(sentiment).reduce((accum, current) => accum + current);
  let max = 0;
  let overallSentiment = "";
  for (const key of Object.keys(sentiment)) {
    if (sentiment[key] > max) {
      max = sentiment[key];
      overallSentiment = key;
    }
  };

  const [showStats, setShowStats] = useState(false);
  function displayStats() {
    setShowStats(true);
  };
  function hideStats() {
    setShowStats(false);
  };

    useEffect(() => {
        if (!loading) return;
        hideStats()
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
    }, [loading]);

  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (!buttonPressed) return;

    if (fullPosts.length === 0) {
      setNoResults(true);
      console.log("noResults", noResults)
      return;
    }
    setNoResults(false);

    const data = Object.keys(sentiment).map((key) => ({
      name: key,
      value: sentiment[key],
    }));

    // Skip if no valid data
    if (!data.length || data.every((d) => d.value === 0)) return;

    displayStats();

    const svg = d3.select(svgRef.current);
    const width = 200;
    const height = 200;
    const radius = 80;

    // Clear previous content
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(Object.keys(colorSet))
      .range(Object.values(colorSet));

    const pie = d3.pie().value((d) => d.value);
    const path = d3.arc().outerRadius(radius).innerRadius(0);

    const pies = g
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    pies
      .append("path")
      .attr("d", path)
      .attr("fill", (d) => color(d.data.name))
      .attr("stroke", "white")
      .attr("stroke-width", 1);

  }, [sentiment, buttonPressed]);

  return (
    <div className="relative flex flex-col justify-center">
      {loading && <div className="loader absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-25"></div>}
      <h2 className={showStats ? "block text-center mb-5" : "hidden"}>
        overall: <span className="font-bold" style={{ color: colorSet[overallSentiment] }}>{overallSentiment}</span>
      </h2>
      <h2 className={noResults && !loading ? "block text-center mb-5" : "hidden" }>no results</h2>
      <div className="flex flex-row">
        <div className={showStats ? "flex flex-col" : "hidden"}>
            <h3 className="font-bold" >user's sentiment</h3>
            <h3><FontAwesomeIcon icon={faFaceSmile} color={colorSet.positive} /> {Math.round((sentiment.positive / sum)*100)}%</h3>
            <h3><FontAwesomeIcon icon={faFaceMeh} color={colorSet.neutral} /> {Math.round((sentiment.neutral / sum)*100)}%</h3>
            <h3><FontAwesomeIcon icon={faFaceAngry} color={colorSet.negative} /> {Math.round((sentiment.negative / sum)*100)}%</h3>
        </div>
        <svg className="mt-0" ref={svgRef} width="200" height="200" id="piechart"></svg>
      </div>
    </div>
  );
}