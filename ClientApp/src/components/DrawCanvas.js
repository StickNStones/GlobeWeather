import React from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Line, Text } from 'react-konva';


const DrawCanvas = (props) => {
    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const stageRef = React.useRef(null);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
        console.log(lines);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleExport = () => {
        const uri = stageRef.current.toDataURL();
        console.log(uri);
        props.onDrawingChange({ uri });
    }

    return (
        <div style={{marginRight: "20px", marginLeft: "10px" }}>
            <div style={{ border: "1px solid"}}>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                    <Text text="Just start drawing" x={5} y={5} />
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#df4b26"
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
                </Stage>
                </div>
            <select
                value={tool}
                onChange={(e) => {
                    setTool(e.target.value);
                }}
            >
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
            </select>
            <button onClick={handleExport}>Click here to log stage data URL</button>
        </div>
    );
};


export default DrawCanvas;