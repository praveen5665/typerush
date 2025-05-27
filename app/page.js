
import TypingBox from "../components/TypingBox";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between gap-4 p-4 items-center">
      <div>Header</div>
      <TypingBox />
      <Footer />
    </div>
  );
}
