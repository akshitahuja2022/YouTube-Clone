import React, { useCallback, useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
// import { useParams } from "react-router-dom";
function PlayVideo({ videoId }) {
  // const videoId = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  // const fetchVideoData = useCallback(, [videoId]);

  const fetchOtherData = useCallback(async (apiData, videoId) => {
    return await Promise.all([
      fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
      ),
      fetch(
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`
      ),
    ]);
    // fetching channel data
    // const channelUrl = ``;
    // await fetch(channelUrl)
    //   .then((res) => res.json())
    //   .then((data) => setChannelData(data.items && data.items[0]));

    // // fetching comment data
    // const commentUrl = ;
    // await fetch(commentUrl)
    //   .then((res) => res.json())
    //   .then((data) => setCommentData(data.items));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const videoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      return await fetch(videoUrl)
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          return data?.items?.[0] || {};
        });
    };

    (async function () {
      const response = await fetchData();
      if (response) {
        setApiData(response);
        const [channelData, commentData] = await fetchOtherData(
          response,
          videoId
        );
        setChannelData(channelData.items && channelData.items[0]);
        setCommentData(commentData.items);
      }
    })();
  }, [fetchOtherData, videoId]);

  // if (!apiData) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         height: "100%",
  //       }}
  //     >
  //       Loading Video....
  //     </div>
  //   );
  // }

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="Create YouTube Clone Using React JS | Build Complete Website Like YouTube In React JS 2024"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>

      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {value_converter(apiData ? apiData.statistics.viewCount : "12k")}{" "}
          views &bull;
          {apiData
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "2 days ago"}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? apiData.statistics.likeCount : "2345"}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />

      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.default.url : ""}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : "1.5M"}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 100)
            : "Descritption here"}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 102}
          comments
        </h4>

        {/* Array.isArray(commentData) && */}
        {Array.isArray(commentData) &&
          commentData.map((item, index) => {
            return (
              <div key={index} className="comment">
                <img
                  src={
                    item.snippet.topLevelComment.snippet.authorProfileImageUrl
                  }
                  alt=""
                />
                <div>
                  <h3>
                    {item.snippet.topLevelComment.snippet.auhtorDisplayName}
                    <span>1 day ago</span>
                  </h3>
                  <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                  <div className="comment-action">
                    <img src={like} alt="" />
                    <span>
                      {value_converter(
                        item.snippet.topLevelComment.snippet.likeCount
                      )}
                    </span>
                    <img src={dislike} alt="" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default PlayVideo;
