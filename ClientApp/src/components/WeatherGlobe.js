import React, { useEffect, useRef, useState} from 'react';
import Globe from 'react-globe.gl';



const MyGlobe = (props) => {
    const globeEl = useRef();
    const [dimensions, setDimensions] = useState({ height: window.innerHeight, width: window.innerWidth });

    const getTooltip = d =>
        `      
        <div style="text-align: center">
        <div><b>${d.name}</b></div>
        <div>${d.tempC}°C</div>
        </div>
        `;

    useEffect(() => {
        console.log(globeEl.current);
        globeEl.current.controls().enableZoom = false;
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.2;

    }, []);

    useEffect(() => {
        function handleResize() {
            console.log("resized to: ", window.innerWidth, 'x', window.innerHeight);
            setDimensions({ height: window.innerHeight, width: window.innerWidth });
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    })

    return <Globe ref={globeEl} backgroundColor="rgba(0,0,0,0)" width={dimensions.width} height={dimensions.height} globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        pointsData={props.pointData} pointAltitude="size" pointColor="color"
        pointLabel={getTooltip}
    />;
};

export default MyGlobe;