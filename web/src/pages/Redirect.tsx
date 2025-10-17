import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLinkBySlug, getOriginalUrl } from "../http";
import { useLinksStore } from "../store/use-links-store";
import logo from "../assets/Logo_Icon.svg";

export function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const incrementLinkCount = useLinksStore((state) => state.incrementLinkCount);

  useEffect(() => {
    async function redirect() {
      if (!slug) {
        navigate("/404");
        return;
      }

      try {
        const link = await getLinkBySlug(slug);

        if (!link) {
          navigate("/404");
          return;
        }

        incrementLinkCount(link.id);

        const { originalUrl } = await getOriginalUrl(slug);

        setTimeout(() => {
          window.location.href = originalUrl;
        }, 500);
      } catch {
        navigate("/404");
      }
    }

    redirect();
  }, [slug, incrementLinkCount, navigate]);

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
