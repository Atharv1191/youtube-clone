import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY } from '../../data';
import moment from 'moment';
import { value_converter } from '../../data';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
    const { videoId } = useParams();
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);

    // Fetch video details
    const fetchVideoData = async () => {
        try {
            const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
            const response = await fetch(videoDetailsUrl);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setApiData(data.items[0]);
            }
        } catch (error) {
            console.error("Error fetching video data:", error);
        }
    };

    // Fetch channel details and comments only after video data is available
    const fetchOtherData = async () => {
        if (!apiData || !apiData.snippet) return;

        try {
            // Fetching channel data
            const channelDataUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const channelResponse = await fetch(channelDataUrl);
            const channelData = await channelResponse.json();
            if (channelData.items && channelData.items.length > 0) {
                setChannelData(channelData.items[0]);
            }

            // Fetching comments
            const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}`;
            const commentResponse = await fetch(commentUrl);
            const commentData = await commentResponse.json();
            if (commentData.items) {
                setCommentData(commentData.items);
            }
        } catch (error) {
            console.error("Error fetching additional data:", error);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        if (apiData) {
            fetchOtherData();
        }
    }, [apiData]);

    return (
        <div className="play-video">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>

            <h3>{apiData ? apiData.snippet.title : "Loading title..."}</h3>

            <div className="play-video-info">
                <p>
                    {apiData ? value_converter(apiData.statistics.viewCount) : "0"} Views &bull;{" "}
                    {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "Loading..."}
                </p>
                <div>
                    <span>
                        <img src={like} alt="Like" />
                        {apiData ? value_converter(apiData.statistics.likeCount) : "0"}
                    </span>
                    <span>
                        <img src={dislike} alt="Dislike" />
                    </span>
                    <span>
                        <img src={share} alt="Share" /> Share
                    </span>
                    <span>
                        <img src={save} alt="Save" /> Save
                    </span>
                </div>
            </div>

            <hr />

            <div className="publisher">
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="Channel" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : "Loading..."}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "0"} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>

            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Loading description..."}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : "0"} Comments</h4>

                {commentData.length > 0 ? (
                    commentData.map((item, index) => (
                        <div key={index} className="comment">
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="User" />
                            <div>
                                <h3>
                                    {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                                    <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                                </h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="Like" />
                                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt="Dislike" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading comments...</p>
                )}
            </div>
        </div>
    );
};

export default PlayVideo;
