import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-12">
      <h1 className="text-2xl font-semibold">프로젝트를 찾을 수 없습니다.</h1>
      <p className="mt-4 text-sm text-muted">주소가 변경되었거나 아직 공개되지 않은 프로젝트입니다.</p>
      <Link href="/work" className="mt-6 inline-flex min-h-11 items-center text-accent underline underline-offset-4">경력 요약으로 돌아가기</Link>
    </div>
  );
}

