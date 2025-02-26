import BackgroundVideo from "../components/BackgroundVideo";
import About from "./About";

export default function Home() {
  return (
    <div className="bg-black text-white">
      <div className="relative h-screen w-full flex items-center justify-center text-white">
        <BackgroundVideo />
        <h1 className="relative xl:text-8xl text-4xl  font-bold z-50">
          Step into innovation
        </h1>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center space-y-20">
        <About />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center space-y-20">
        <h1 className="text-8xl font-bold">Step into innovation</h1>
        <p className="text-2xl max-w-2xl text-center">
          Scroll down to see more content
        </p>
      </div>
    </div>
  );
}
