import Image from "next/image";
import { LoginForm } from "@/components/login/login-form";

export default function Home() {
  return (
    <main className="min-h-screen flex">
      <div className="w-1/2 bg-sky-500 flex flex-col justify-center text-white p-10">
        <Image
          src="/logo.png"
          width={300}
          height={100}
          className="mb-8"
          alt="Company logo"
        />
        <p className="text-sm">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="flex justify-center mb-6">
          <Image src="/icon.png" alt="Company icon" width={100} height={100} />
        </div>
        <h2 className="text-center text-2xl mb-12">WELCOME</h2>
        <LoginForm />
      </div>
    </main>
  );
}
