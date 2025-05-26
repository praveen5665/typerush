"use client";
import { generate as randomWords } from "random-words";
import { useState, useEffect, useRef, useMemo, createRef } from "react";
import TimeBox from "./TimeBox";
import { useTestModeContext } from "@/context/TestModeContext";

const TypingBox = () => {
  const [wordsArray, setWordsArray] = useState(() => randomWords(50));

  const { testTime } = useTestModeContext();
  const [countdown, setCountdown] = useState(testTime);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map((i) => createRef(null));
  }, [wordsArray]);

  const InputRef = useRef(null);

  const handleUserInput = (e) => {
    const currWord = wordsSpanRef[currentWordIndex].current.childNodes;

    if (e.key === " ") {
      if (currentCharIndex === currWord.length) {
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);

        currWord[currentCharIndex - 1].classList.remove(
          "blinking-cursor-right",
        );

        if (currentWordIndex + 1 < wordsSpanRef.length) {
          wordsSpanRef[currentWordIndex + 1].current.children[0].classList.add(
            "blinking-cursor",
          );
        }
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

  useEffect(() => {
    setCountdown(testTime);
  }, [testTime]);

  useEffect(() => {
    setWordsArray(randomWords(50));
    focusInput();
  }, []);

  useEffect(() => {
    wordsSpanRef[0].current.children[0].classList.add("blinking-cursor");
  }, [wordsArray]);

  return (
    <div className="type-box  max-w-[1200px] mx-auto flex flex-col gap-5 border-2 border-dashed border-gray-300 p-4 rounded-md">
      <TimeBox countdown={countdown} />
      <div
        onClick={focusInput}
        className="words-container text-2xl flex flex-wrap gap-2"
      >
        {wordsArray.map((word, index) => (
          <span ref={wordsSpanRef[index]} className="mx-1.5 p-0.5" key={index}>
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
    </div>
  );
};

export default TypingBox;
