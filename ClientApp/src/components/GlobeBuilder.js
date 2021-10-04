import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import DrawCanvas from './DrawCanvas.js'
import WeatherGlobe from './WeatherGlobe.js';
import './Globe.css';


export default function GlobeBuilder() {
    const [globeImage, setGlobeImage] = useState();
    const [draw, setDraw] = useState(false);

    const handleNewDrawing = (canvasData) => {
        setDraw(true);
        setGlobeImage(canvasData.uri);
    }

    return (
        <div className='globe-abs'>
            <div>
                <DrawCanvas onDrawingChange={handleNewDrawing} />
            </div>
            <div class="container-sm" >
                <div class="row" >
                    <div class="col col-sm-3">
                        <WeatherGlobe draw={draw} globeImage={globeImage} />
                    </div>
                </div>
            </div>
        </div>);         
         
};
