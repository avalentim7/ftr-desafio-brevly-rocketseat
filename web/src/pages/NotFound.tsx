import notFoundImage from "../assets/404.svg";

export function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-200 gap-8 px-4">
      <div className="flex items-center flex-col bg-white px-12 py-16 rounded-lg shadow-sm text-center max-w-xl">
        <img src={notFoundImage} alt="404 - Link não encontrado" className="mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Link não encontrado</h2>
        <p className="text-gray-600 mb-6">
          <span>O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. </span>
          <span className="block md:inline">
            Saiba mais em{" "}
            <a href="/" className="inline-block text-blue-base hover:text-blue-dark transition-colors font-semibold">
              brev.ly.
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
