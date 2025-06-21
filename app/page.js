
import TypingBox from "../components/TypingBox";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between gap-4 p-4 items-center bg-bg">
      <Header />
      <TypingBox />
      <Footer />
    </div>
  );
}
