export async function generateMetadata() {
  return {
    title: "Not Found",
  };
}

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="border-gray-300 mr-5 border-r pr-6 text-2xl font-medium">404</h1>
      <p className="text-xl">This page could not be found.</p>
    </div>
  );
}
