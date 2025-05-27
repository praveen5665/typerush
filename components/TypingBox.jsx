"use client";
import { generate as randomWords } from "random-words";
import { useState, useEffect, useRef, useMemo, createRef } from "react";
import TimeBox from "./TimeBox";
import { useTestModeContext } from "@/context/TestModeContext";

const TypingBox = () => {
  const [wordsArray, setWordsArray] = useState(() => randomWords(50));
  const { testTime } = useTestModeContext();
  const [countdown, setCountdown] = useState(testTime);
  const [timerStarted, setTimerStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map((i) => createRef(null));
  }, [wordsArray]);

  const InputRef = useRef(null);

  useEffect(() => {
    let timer;
    if (timerStarted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
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
  }, [timerStarted, countdown]);

  const handleUserInput = (e) => {
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
        // Move to the next word
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
      return;
    }

    if (e.key === "Backspace") {
      if (currentCharIndex > 0) {
        if (currentCharIndex === currWord.length) {
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
      return;
    }
    if (e.key === currWord[currentCharIndex].innerText) {
      currWord[currentCharIndex].classList.add("correct-char");
    } else {
      currWord[currentCharIndex].classList.add("incorrect-char");
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
    InputRef.current.focus();
  };

  const resetTest = () => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTimerStarted(false);
    setTestCompleted(false);
    setWordsArray(randomWords(50));
    setCountdown(testTime);
    focusInput();

    // Clear all existing classes
    wordsSpanRef.forEach((ref) => {
      if (ref.current && ref.current.children) {
        Array.from(ref.current.children).forEach((child) => {
          child.classList.remove(
            "blinking-cursor",
            "blinking-cursor-right",
            "correct-char",
            "incorrect-char",
            "extra-char",
          );
        });
      }
    });
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
    setWordsArray(randomWords(50));
    focusInput();
  }, []);

  return (
    <div className="type-box  max-w-[1200px] mx-auto flex flex-col gap-5 border-2 border-dashed border-gray-300 p-4 rounded-md">
      {testCompleted ? (
        <div className="text-center text-2xl">WPM is loading...</div>
      ) : (
        <>
          <TimeBox countdown={countdown} />
          <div
            onClick={focusInput}
            className="words-container text-2xl flex flex-wrap gap-2"
          >
            {wordsArray.map((word, index) => (
              <span
                ref={wordsSpanRef[index]}
                className="mx-1.5 p-0.5"
                key={index}
              >
                {word.split("").map((char, charIndex) => (
                  <span key={charIndex}>{char}</span>
                ))}
              </span>
            ))}
          </div>
          <input
            type="text"
            ref={InputRef}
            onKeyDown={handleUserInput}
            className="opacity-0 absolute w-0 h-0"
          />
        </>
      )}
    </div>
  );
};

export default TypingBox;
