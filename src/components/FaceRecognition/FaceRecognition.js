import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ box, imageURL }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='input_image' alt='image missing' src={imageURL} width='500px' height='auto'/>
                <div className='bounding_box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>
        
    );
}

export default FaceRecognition;
