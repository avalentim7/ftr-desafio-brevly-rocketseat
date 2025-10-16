import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinkBySlug, getOriginalUrl } from "../http";
import { useLinksStore } from "../store/use-links-store";
import logo from "../assets/Logo_Icon.svg";

export function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);
  const incrementLinkCount = useLinksStore((state) => state.incrementLinkCount);

  useEffect(() => {
    async function redirect() {
      if (!slug) {
        setError("Link inválido");
        return;
      }

      try {
        const link = await getLinkBySlug(slug);

        if (!link) {
          setError("Link não encontrado ou expirado");
          return;
        }

        incrementLinkCount(link.id);

        const { originalUrl } = await getOriginalUrl(slug);

        setTimeout(() => {
          window.location.href = originalUrl;
        }, 500);
      } catch {
        setError("Link não encontrado ou expirado");
      }
    }

    redirect();
  }, [slug, incrementLinkCount]);

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-200 gap-8 px-4">
        <img src={logo} alt="Brevly Logo" className="w-48" />
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Oops!</h1>
          <p className="text-gray-600">{error}</p>
          <a
            href="/"
            className="mt-6 inline-block bg-blue-base text-white px-6 py-2 rounded-lg hover:bg-blue-dark transition-colors"
          >
            Voltar para home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-200 gap-8 px-4">
      <div className="flex flex-col justify-center bg-white px-12 py-16 rounded-lg shadow-sm text-center items-center">
        <img src={logo} alt="Brevly Logo" className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Redirecionando...</h1>
        <p className="text-gray-600">O link será aberto automaticamente em alguns instantes.</p>
        <p className="text-gray-600">
          Não foi redirecionado?{" "}
          <a className="text-blue-base underline font-semibold hover:text-blue-base/80" href="/">
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  );
}
