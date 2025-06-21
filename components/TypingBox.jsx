"use client";
import { generate as randomWords } from "random-words";
import { useState, useEffect, useRef, useMemo, createRef } from "react";
import TimeBox from "./TimeBox";
import { useTestModeContext } from "@/context/TestModeContext";
import Result from "./Result";

const TypingBox = () => {
  const [wordsArray, setWordsArray] = useState(() => randomWords(500));
  const { testTime } = useTestModeContext();
  const [countdown, setCountdown] = useState(testTime);
  const [timerStarted, setTimerStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Test Statistics
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);

  const [graphData, setGraphData] = useState([]);

  const correctCharsRef = useRef(0);

  const calculateWPM = () => {
    const wpmValue = Math.round((correctChars * 12) / testTime);
    setWpm(wpmValue);
  };

  const resetTest = () => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTimerStarted(false);
    setTestCompleted(false);
    setWordsArray(randomWords(500));
    setCountdown(testTime);
    // Reset statistics
    setCorrectChars(0);
    setIncorrectChars(0);
    setExtraChars(0);
    setMissedChars(0);
    setAccuracy(0);
    setWpm(0);
    setGraphData([]);

    focusInput();

    // Clear all existing classes and remove extra characters
    wordsSpanRef.forEach((ref) => {
      if (ref.current && ref.current.children) {
        const children = Array.from(ref.current.children);
        children.forEach((child) => {
          if (child.classList.contains("extra-char")) {
            child.remove();
          } else {
            child.classList.remove(
              "blinking-cursor",
              "blinking-cursor-right",
              "correct-char",
              "incorrect-char",
            );
          }
        });
      }
    });
  };

  useEffect(() => {
    if (testCompleted) {
      calculateWPM();
      const totalChars =
        correctChars + incorrectChars + extraChars + missedChars;
      setAccuracy(
        totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0,
      );
    }
  }, [
    testCompleted,
    correctChars,
    incorrectChars,
    extraChars,
    wordsArray,
    countdown,
    testTime,
  ]);

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map((i) => createRef(null));
  }, [wordsArray]);

  const InputRef = useRef(null);

  const handleUserInput = (e) => {
    if (e.keyCode !== 8 && e.key.length > 1) {
      e.preventDefault();
      return;
    }

    if (!timerStarted) {
      setTimerStarted(true);
    }

    if (countdown === 0) {
      return;
    }

    const currWord = wordsSpanRef[currentWordIndex].current.childNodes;

    if (e.key === " ") {
      if (currentCharIndex > 0 && currentWordIndex < wordsSpanRef.length) {
        // If the current character is not the first one, remove the blinking cursor
        if (currentCharIndex < currWord.length) {
          currWord[currentCharIndex].classList.remove("blinking-cursor");
          currWord[currentCharIndex].classList.remove("blinking-cursor-right");
          setMissedChars((prev) => prev + currWord.length - currentCharIndex);
        } else if (currWord.length > 0) {
          // If the current character is the last one, remove the right blinking cursor
          currWord[currWord.length - 1].classList.remove(
            "blinking-cursor-right",
          );
        }

        // Add the correct class to the current word
        const nextWordIndex = currentWordIndex + 1;
        if (nextWordIndex < wordsSpanRef.length) {
          const nextWordChars = wordsSpanRef[nextWordIndex].current.children;
          if (nextWordChars.length > 0) {
            nextWordChars[0].classList.add("blinking-cursor");
          }
        }

        //  scrolling logic
        if (
          wordsSpanRef[currentWordIndex + 1].current.offsetLeft <
          wordsSpanRef[currentWordIndex].current.offsetLeft
        ) {
          wordsSpanRef[currentWordIndex].current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        // Move to the next word
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
      return;
    }

    if (e.key === "Backspace") {
      if (currentCharIndex > 0) {
        if (currentCharIndex === currWord.length) {
          // If the current character is the last one, remove the right blinking cursor
          if (currWord[currentCharIndex - 1].classList.contains("extra-char")) {
            currWord[currentCharIndex - 1].remove();
            const lastCharIndex = currWord.length - 1;
            if (lastCharIndex >= 0) {
              currWord[lastCharIndex].classList.add("blinking-cursor-right");
            }
          } else {
            currWord[currentCharIndex - 1].classList.remove(
              "blinking-cursor-right",
            );
            currWord[currentCharIndex - 1].classList.remove("correct-char");
            currWord[currentCharIndex - 1].classList.remove("incorrect-char");
            currWord[currentCharIndex - 1].classList.add("blinking-cursor");
          }
        } else {
          // If the current character is not the last one, remove the blinking cursor
          currWord[currentCharIndex].classList.remove("blinking-cursor");
          currWord[currentCharIndex - 1].classList.remove("correct-char");
          currWord[currentCharIndex - 1].classList.remove("incorrect-char");
          currWord[currentCharIndex - 1].classList.add("blinking-cursor");
        }
        setCurrentCharIndex((prev) => prev - 1);
      }
      return;
    }

    if (currentCharIndex >= currWord.length) {
      let newSpan = document.createElement("span");
      newSpan.innerText = e.key;
      newSpan.classList.add(
        "blinking-cursor-right",
        "incorrect-char",
        "extra-char",
      );
      wordsSpanRef[currentWordIndex].current.appendChild(newSpan);

      currWord[currentCharIndex - 1].classList.remove("blinking-cursor-right");

      setCurrentCharIndex((prev) => prev + 1);
      setExtraChars((prev) => prev + 1);
      return;
    }
    if (e.key === currWord[currentCharIndex].innerText) {
      currWord[currentCharIndex].classList.add("correct-char");
      setCorrectChars((prev) => prev + 1);
    } else {
      currWord[currentCharIndex].classList.add("incorrect-char");
      setIncorrectChars((prev) => prev + 1);
    }

    currWord[currentCharIndex].classList.remove("blinking-cursor");

    if (currentCharIndex + 1 < currWord.length) {
      currWord[currentCharIndex + 1].classList.add("blinking-cursor");
    } else {
      currWord[currentCharIndex].classList.add("blinking-cursor-right");
    }

    setCurrentCharIndex((prev) => prev + 1);
  };

  const focusInput = () => {
    setTimeout(() => {
      if (InputRef.current) {
        InputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (wordsSpanRef[0].current && wordsSpanRef[0].current.children[0]) {
      wordsSpanRef[0].current.children[0].classList.add("blinking-cursor");
    }
  }, [wordsArray]);

  useEffect(() => {
    resetTest();
  }, [testTime]);

  useEffect(() => {
    setCountdown(testTime);
  }, [testTime]);

  useEffect(() => {
    setWordsArray(randomWords(500));
    focusInput();
  }, []);


  useEffect(() => {
    correctCharsRef.current = correctChars;
  }, [correctChars]);

  useEffect(() => {
    // Timer logic
    let timer;
    if (timerStarted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          const timeElapsed = testTime - prev + 1;
          const currentWPM = Math.round(
            (correctCharsRef.current * 12) / timeElapsed,
          );
          setGraphData((data) => [...data, [timeElapsed, currentWPM]]);

          if (prev === 1) {
            setTimerStarted(false);
            setTestCompleted(true);
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerStarted, testTime]);

  useEffect(() => {
    // Handle Tab key to reset the test
    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        resetTest();
      }
    };

    window.addEventListener("keydown", handleTabKey);

    return () => {
      window.removeEventListener("keydown", handleTabKey);
    };
  }, [resetTest]);

  return (
    <div className="type-box min-h-[300px]  px-30 min-w-full max-w-[1200px] flex flex-col gap-5  p-4 rounded-md">
      <TimeBox countdown={countdown} />
      {testCompleted ? (
        <div className="">
          <Result
            wpm={wpm}
            accuracy={accuracy}
            correctChars={correctChars}
            incorrectChars={incorrectChars}
            extraChars={extraChars}
            missedChars={missedChars}
            graphData={graphData}
            testTime={testTime}
          />
        </div>
      ) : (
        <div className="relative flex-1 p-2 overflow-hidden">
          <div
            onClick={focusInput}
            className="words-container text-2xl pt-5 flex flex-wrap gap-2 space-y-1 overflow-hidden h-[150px] relative scrollbar-hide"
          >
            {wordsArray.map((word, index) => (
              <span ref={wordsSpanRef[index]} className="mx-1.5" key={index}>
                {word.split("").map((char, charIndex) => (
                  <span className="mx-[1.5px]" key={charIndex}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}
      {!testCompleted && (
        <input
          type="text"
          ref={InputRef}
          onKeyDown={handleUserInput}
          className="opacity-0 absolute w-0 h-0"
        />
      )}
    </div>
  );
};

export default TypingBox;
