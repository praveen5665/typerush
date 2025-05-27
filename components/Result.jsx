
const Result = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  extraChars,
  missedChars,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Test Results</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>WPM: {wpm}</div>
        <div>Accuracy: {accuracy}%</div>
        <div>Correct characters: {correctChars}</div>
        <div>Incorrect characters: {incorrectChars}</div>
        <div>Extra characters: {extraChars}</div>
        <div>Missed characters: {missedChars}</div>
      </div>
    </div>
  );
};

export default Result;