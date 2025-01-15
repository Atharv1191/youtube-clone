import React from 'react'
import './video.css'
import PlayVideo from '../../components/PlayVideo/PlayVideo'
import Recomended from '../../components/Recomended/Recomended'
const video = () => {
  return (
    <div className='play-container'>
      <PlayVideo/>
      <Recomended/>
    </div>
  )
}

export default video