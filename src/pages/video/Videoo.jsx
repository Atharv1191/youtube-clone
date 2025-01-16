import React from 'react';
import './video.css';
import PlayVideo from '../../components/PlayVideo/PlayVideo';
import Recomended from '../../components/Recomended/Recomended';
import { useParams } from 'react-router-dom';

const Videoo = () => {
  const { videoId, categoryId } = useParams(); // ✅ Hooks should be used inside the function component

  return (
    <div className='play-container'>
      <PlayVideo videoId={videoId} />
      <Recomended categoryId={categoryId} />
    </div>
  );
};

export default Videoo;
