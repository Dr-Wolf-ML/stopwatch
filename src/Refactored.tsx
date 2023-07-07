import React, { useState, useEffect } from 'react';

const formattedSeconds = (sec: number): string =>
    `${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}`;

interface StopwatchProps {
    initialSeconds: number;
}

interface LapProps {
    index: number;
    lap: number;
    onDelete: () => void;
}

const Lap: React.FC<LapProps> = ({ index, lap, onDelete }) => (
    <div className="stopwatch-lap">
        <strong>{index}</strong>/{formattedSeconds(lap)}{' '}
        <button onClick={onDelete}>X</button>
    </div>
);

const Stopwatch: React.FC<StopwatchProps> = ({ initialSeconds }) => {
    const [secondsElapsed, setSecondsElapsed] = useState<number>(
        initialSeconds
    );
    const [
        lastClearedIncrementer,
        setLastClearedIncrementer,
    ] = useState<NodeJS.Timeout | null>(null);
    const [incrementer, setIncrementer] = useState<NodeJS.Timeout | null>(null);
    const [laps, setLaps] = useState<number[]>([]);

    const toggleIncrementer = () => {
        if (incrementer) {
            clearInterval(incrementer);
            setLastClearedIncrementer(incrementer);
            setIncrementer(null);
        } else {
            const newIncrementer = setInterval(() => {
                setSecondsElapsed(
                    (prevSecondsElapsed) => prevSecondsElapsed + 1
                );
            }, 1000);
            setIncrementer(newIncrementer);
        }
    };

    const handleResetClick = () => {
        if (incrementer) {
            clearInterval(incrementer);
        }
        setLaps([]);
        setSecondsElapsed(0);
        setIncrementer(null);
        setLastClearedIncrementer(null);
    };

    const handleLabClick = () => {
        setLaps((prevLaps) => [...prevLaps, secondsElapsed]);
    };

    const handleDeleteClick = (index: number) => () => {
        setLaps((prevLaps) => {
            const updatedLaps = [...prevLaps];
            updatedLaps.splice(index, 1);
            return updatedLaps;
        });
    };

    useEffect(() => {
        return () => {
            if (incrementer) {
                clearInterval(incrementer);
            }
        };
    }, [incrementer]);

    const isRunning = !!incrementer;
    const isStopped = secondsElapsed !== 0 && !incrementer;

    return (
        <div className="stopwatch">
            <h1 className="stopwatch-timer">
                {formattedSeconds(secondsElapsed)}
            </h1>
            <button type="button" onClick={toggleIncrementer}>
                {isRunning ? 'stop' : 'start'}
            </button>
            {isRunning && (
                <button type="button" onClick={handleLabClick}>
                    lap
                </button>
            )}
            {isStopped && (
                <button type="button" onClick={handleResetClick}>
                    reset
                </button>
            )}
            <div className="stopwatch-laps">
                {laps.map((lap, i) => (
                    <Lap
                        key={i}
                        index={i + 1}
                        lap={lap}
                        onDelete={handleDeleteClick(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Stopwatch;
