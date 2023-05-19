import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  // Options for react-youtube
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  // exmaple to understand 
   /**
      suppose there is function name called movieTrailer which is promise based function
      function movieTrailer(moive){
          return new Promise(function(resolve,reject)){
              resolve(movie);
              reject("");
            }
          } 
   **/
  
  // this is promise based function using .then 
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || '')
      .then((url) =>{
        //callback function will excute after when the promise get resolved
      const urlParams = new URLSearchParams(new URL(url).search);
      setTrailerUrl(urlParams.get('v'));
      } )
      // here to catch the error if the promise rejected then it will reject the promise
      .catch ((error) => console.log(error));
    }
  };
  
  // now  using async function
  
  /**
 * const handleClick = async((movie) =>{
  *  if(trailerUrl){
  *      setTrailerUrl(""); 
  *    }
  * try{
  *    let url = movieTrailer(movie?.name || '');
  * const urlParams = new  URLSearchParams(new URL(url).search);
  * setTrailerUrl(urlParams.get('v'));
  *    }
  *   catch((err)=>{
  *    console.log(err);
  *   })
 * }
 * 
 */
  

  
  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map(
          (movie) =>
            movie.backdrop_path !== null && (
              <img
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${baseImgUrl}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
                key={movie.id}
                onClick={() => handleClick(movie)}
              />
            )
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
