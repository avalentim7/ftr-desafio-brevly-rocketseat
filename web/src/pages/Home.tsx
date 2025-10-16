import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import FormCreateShortenedUrl from "../components/FormCreateShortenedUrl";
import { Download } from "lucide-react";
import LinkNotFound from "../components/LinkNotFound";
import LinkCard from "../components/LinkCard";
import ProgressBar from "../components/ProgressBar";
import { useLinksStore } from "../store/use-links-store";

export function Home() {
  const { links, fetchLinks, exportLinks, isLoading } = useLinksStore();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const publicUrl = await exportLinks();
      window.open(publicUrl, "_blank");
    } catch {
      alert("Erro ao exportar CSV");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-dvh overflow-auto flex flex-col items-center justify-center bg-gray-200 gap-8 px-4 py-8 lg:px-64">
      <div className="w-full">
        <img src={logo} alt="Brevly Logo" />
      </div>
      <div className="flex w-full gap-5 flex-col md:flex-row md:items-start">
        {/* Card Novo Link - Esquerda no desktop, topo no mobile */}
        <div className="bg-white p-8 rounded-lg shadow-sm md:w-auto md:min-w-[400px]">
          <div className="flex items-center mb-6">
            <h3 className="text-gray-700 font-bold text-xl">Novo Link</h3>
          </div>
          <FormCreateShortenedUrl />
        </div>

        {/* Card Meus Links - Direita no desktop, embaixo no mobile */}
        <div className="flex-1 flex flex-col">
          <ProgressBar isLoading={isExporting} />
          <div className="bg-white p-8 rounded-lg shadow-sm flex-1">
            <div className="flex flex-row justify-between sm:items-center mb-6 gap-4">
              <h3 className="text-gray-700 font-bold text-xl">Meus links</h3>
              <button
                onClick={handleExportCsv}
                disabled={isLoading || links.length === 0 || isExporting}
                className="flex items-center justify-center gap-2 rounded-md bg-gray-100 text-gray-600 font-semibold px-3 py-1.5 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                {isExporting ? "Exportando..." : "Baixar CSV"}
              </button>
            </div>
            {links.length === 0 ? (
              <LinkNotFound />
            ) : (
              <div className="space-y-3 overflow-auto md:max-h-[690px] md:pr-1">
                {links.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
