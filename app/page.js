import TypingBox from "./components/TypingBox";

export default function Home() {
  return <h1 className="min-h-screen grid grid-rows-auto gap-4 p-4 items-center justify-center  text-4xl font-bold">
    <div>Header</div>
    <TypingBox />
    <div>Footer</div>
  </h1>;
}
