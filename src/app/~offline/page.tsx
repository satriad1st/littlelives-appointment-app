import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[calc(100vh_-_48px_-_56px)] flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-6 text-3xl font-bold">You&apos;re Offline!</h1>

      <div className="mb-8 w-32">
        <Image src="/icon0.svg" alt="Appointment Logo" width={128} height={128} priority />
      </div>

      <p className="text-gray-400 max-w-md">
        It seems you&apos;re currently offline. <br />
        Please check your internet connection and try again. Some features may still work while offline.
      </p>
    </div>
  );
}
