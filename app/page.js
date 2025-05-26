import TypingBox from "../components/TypingBox";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-auto gap-4 p-4 items-center justify-center">
      <div>Header</div>
      <TypingBox />
      <div>Footer</div>
    </div>
  );
}
