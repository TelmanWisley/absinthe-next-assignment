import Image from "next/image";
import CheckPoints from "./components/CheckPoints";
import DistributePoint from "./components/DistributePoint";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      <CheckPoints />
      <DistributePoint />
    </main>
  );
}
