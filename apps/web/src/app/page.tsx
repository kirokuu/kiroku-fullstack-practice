import Link from "next/link";
import { Button } from "@kiroku/ui";
export default function HomePage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center 
                 bg-gradient-to-r from-violet-500 via-teal-500 to-cyan-500 
                 bg-[length:300%_300%] animate-animated-gradient text-white"
    >
      <section className="text-center p-8 max-w-3xl mx-auto">
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-4 
                     text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]"
        >
          Kiroku
        </h1>
        <p className="text-lg md:text-xl text-slate-100 mb-10 max-w-xl">
          당신의 운동, 식단, 목표, 생각을 한 곳에서 기록하고 관리하세요.
          <br />
          가장 중요한 것에 집중할 수 있도록, Kiroku가 함께합니다.
        </p>
        <Button asChild>
          <Link href="/login">지금 시작하기</Link>
        </Button>
      </section>
    </div>
  );
}
