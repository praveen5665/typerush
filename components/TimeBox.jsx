"use client";
import { useTestModeContext } from "@/context/TestModeContext";

const TimeBox = ({ countdown }) => {
  const { testTime, setTestTime } = useTestModeContext();

  const timeOptions = [15, 30, 60];

  return (
    <div className="flex justify-between mx-2 text-lg font-bold">
      <div>
        {countdown > 0 ? (
          <span>Time Left: {countdown} seconds</span>
        ) : (
          <span>Time's up!</span>
        )}
      </div>
      <div className="flex gap-2">
        {timeOptions.map((time) => (
          <button
            key={time}
            onClick={() => setTestTime(time)}
            className={`px-3 py-1 hover:cursor-pointer rounded transition-all duration-200
              ${
                testTime === time ? "bg-white text-black" : "hover:bg-gray-500"
              }`}
          >
            {time}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeBox;
