import ImageOptimizer from "@/components/image-optimizer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full">
        <ImageOptimizer />
      </div>
    </main>
  );
}
