import { Eraser, Pen, Redo, Undo } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Button from '@mui/material/Button';
import { MenuItem, Select, Slider, Tooltip } from '@mui/material';

interface DrawingObject {
    id: string;
    points: number[];
    stroke: string;
    strokeWidth: number;
    dash?: number[];
}

const Whiteboard: React.FC = () => {
    const [color, setColor] = useState<string>('#000000');
    const [size, setSize] = useState<number>(5);
    const [isErasing, setIsErasing] = useState<boolean>(false);
    const [strokeType, setStrokeType] = useState<string>('solid');
    const [drawingObjects, setDrawingObjects] = useState<DrawingObject[]>([]);
    const [currentDrawing, setCurrentDrawing] = useState<DrawingObject | null>(null);
    const [history, setHistory] = useState<DrawingObject[][]>([]);
    const [redoHistory, setRedoHistory] = useState<DrawingObject[][]>([]);

    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    const handleMouseDown = (e: any) => {
        const stage = stageRef.current;
        const pointerPosition = stage.getPointerPosition();

        if (isErasing) {
            const layer = layerRef.current;
            const { x, y } = pointerPosition;
            const radius = size / 2;

            layer.find('Line').forEach((line: any) => {
                const points = line.points();
                for (let i = 0; i < points.length; i += 2) {
                    const lineX = points[i];
                    const lineY = points[i + 1];
                    if (
                        Math.abs(lineX - x) < radius &&
                        Math.abs(lineY - y) < radius
                    ) {
                        line.remove();
                        break;
                    }
                }
            });

            layer.batchDraw();
        } else {
            const newLine: DrawingObject = {
                id: Date.now().toString(),
                points: [pointerPosition.x, pointerPosition.y],
                stroke: color,
                strokeWidth: size,
                dash: strokeType === 'dashed' ? [size * 2, size * 2] : undefined,
            };
            setCurrentDrawing(newLine);
        }
    };

    const handleMouseMove = (e: any) => {
        if (!isErasing){
            if (!currentDrawing) return;
            const stage = stageRef.current;
            const pointerPosition = stage.getPointerPosition();
            setCurrentDrawing({
                ...currentDrawing,
                points: [...currentDrawing.points, pointerPosition.x, pointerPosition.y],
            });
        }
    };

    const handleMouseUp = () => {
        if (currentDrawing) {
            setDrawingObjects([...drawingObjects, currentDrawing]);
            setHistory([...history, [...drawingObjects]]);
            setRedoHistory([]);
            setCurrentDrawing(null);
        }
    };

    const undo = () => {
        if (history.length > 0) {
            const previousState = history.pop()!;
            setRedoHistory([drawingObjects, ...redoHistory]);
            setDrawingObjects(previousState);
            setHistory(history);
        }
    };

    const redo = () => {
        if (redoHistory.length > 0) {
            const nextState = redoHistory.shift()!;
            setHistory([...history, drawingObjects]);
            setDrawingObjects(nextState);
            setRedoHistory(redoHistory);
        }
    };

    const reset = () => {
        setDrawingObjects([]);
        setHistory([]);
        setRedoHistory([]);
        setCurrentDrawing(null);
    };

    return (
        <div className="relative flex flex-col items-center">
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                className='bg-slate-300'
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer ref={layerRef}>
                    {drawingObjects.map((obj) => (
                        <Line
                            key={obj.id}
                            points={obj.points}
                            stroke={obj.stroke}
                            strokeWidth={obj.strokeWidth}
                            dash={obj.dash}
                            lineCap="round"
                            lineJoin="round"
                        />
                    ))}
                    {currentDrawing && (
                        <Line
                            points={currentDrawing.points}
                            stroke={currentDrawing.stroke}
                            strokeWidth={currentDrawing.strokeWidth}
                            dash={currentDrawing.dash}
                            lineCap="round"
                            lineJoin="round"
                        />
                    )}
                </Layer>
            </Stage>
            <div className="absolute bottom-5 space-x-4 flex items-center justify-center bg-slate-100 py-2 px-4 rounded-2xl">
                <Tooltip title="Color" placement="top">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="ml-2 h-8 w-8 border-none outline-none"
                        disabled={isErasing}
                    />
                </Tooltip>
                <Tooltip title="Pen" placement="top">
                    <Button onClick={() => setIsErasing(false)} className="ml-4 px-4 py-2 bg-gray-200 border border-gray-400 rounded" >
                        <Pen />
                    </Button>
                </Tooltip>
                <div className="w-40 flex gap-3">
                    <span>Size</span>
                    <Slider
                        size='small'
                        value={size}
                        min={1}
                        max={50}
                        onChange={(e, newValue) => setSize(newValue as number)}
                        valueLabelDisplay="auto"
                    />
                </div>
                <Tooltip title="Erase" placement="top">
                    <Button onClick={() => setIsErasing(true)} className={`ml-4 px-4 py-2 border border-gray-400 rounded ${isErasing ? "bg-gray-500" : "bg-gray-800 "}`} >
                        <Eraser className='bg-transparent' />
                    </Button>
                </Tooltip>
                <Tooltip title="Undo" placement="top">
                    <Button onClick={undo} className="ml-4 px-4 py-2 bg-gray-200 border border-gray-400 rounded" >
                        <Undo />
                    </Button>
                </Tooltip>
                <Tooltip title="Redo" placement="top">
                    <Button onClick={redo} className="ml-4 px-4 py-2 bg-gray-200 border border-gray-400 rounded" >
                        <Redo />
                    </Button>
                </Tooltip>
                <Tooltip title="Reset" placement="top">
                    <Button onClick={reset} className="ml-4 px-4 py-2 bg-red-500 text-white border border-gray-400 rounded" >
                        Reset
                    </Button>
                </Tooltip>
                <Select
                    value={strokeType}
                    onChange={(e) => setStrokeType(e.target.value)}
                    sx={{
                        '.MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                        },
                    }}
                >
                    <MenuItem value="dashed" className='font-extrabold'>- - - - - - - - - -</MenuItem>
                    <MenuItem value="solid" className='font-extrabold'>___________</MenuItem>
                </Select>
            </div>
        </div>
    );
};

export default Whiteboard;
