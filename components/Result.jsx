import Graph from "./Graph";

const Result = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  extraChars,
  missedChars,
  graphData,
  testTime
}) => {
  let timeSet = new Set();
  const newgraphData = graphData.filter((i) => {
    if (!timeSet.has(i[0])) {
      timeSet.add(i[0]);
      return true;
    }
  });
  graphData = newgraphData;
  return (

    <div className="flex gap-4 py-4">
      <div className="left text-xl flex flex-col items-center mt-[-46px] justify-center space-y-4 min-w-[200px]">
          <div>WPM: <span className="text-caret">{wpm}</span></div>
          <div>Accuracy: <span className="text-caret">{accuracy}%</span></div>
          <div>Test Duration: <span className="text-caret">{testTime}s</span></div>
      </div>
      <div className="right flex flex-1 flex-col items-center justify-center space-y-4">
          <Graph graphData={graphData} />
          <div className="flex justify-between w-full px-8">
            <div>Correct : <span className="text-caret">{correctChars}</span></div>
            <div>Incorrect : <span className="text-caret">{incorrectChars}</span></div>
            <div>Extra : <span className="text-caret">{extraChars}</span></div>
            <div>Missed : <span className="text-caret">{missedChars}</span></div>
          </div>
      </div>
      
    </div>

  );
};

export default Result;
