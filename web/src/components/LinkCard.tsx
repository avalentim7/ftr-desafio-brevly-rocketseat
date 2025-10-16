import { Copy, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLinksStore } from "../store/use-links-store";
import type { Link } from "../http/types";

interface LinkCardProps {
  link: Link;
}

export default function LinkCard({ link }: LinkCardProps) {
  const navigate = useNavigate();
  const deleteLink = useLinksStore((state) => state.deleteLink);

  const shortUrl = link.shortUrl;

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado com sucesso", {
      description: `O link ${url} foi copiado para a área de transferência`,
    });
  };

  const handleDeleteUrl = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este link?")) {
      try {
        await deleteLink(id);
      } catch {
        alert("Erro ao deletar link");
      }
    }
  };

  const handleLinkClick = () => {
    navigate(`/${link.slug}`);
  };

  return (
    <div
      key={link.id}
      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4 border-t border-gray-200 transition-all"
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span
          onClick={handleLinkClick}
          className="text-blue-base text-lg font-semibold cursor-pointer hover:text-blue-dark/80 transition-all"
        >
          {shortUrl}
        </span>
        <span className="text-gray-700 truncate" title={link.originalUrl}>
          {link.originalUrl}
        </span>
      </div>
      <div className="flex items-center gap-2 justify-between md:justify-end">
        <span className="text-gray-500 text-sm mr-4">{link.accessCount} acessos</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopyUrl(shortUrl)}
            className="flex items-center gap-2 px-3.5 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
            title="Copiar URL"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={() => handleDeleteUrl(link.id)}
            className="flex items-center gap-2 px-3.5 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
            title="Excluir URL"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
