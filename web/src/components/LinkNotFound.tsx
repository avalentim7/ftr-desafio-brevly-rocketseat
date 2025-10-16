import { Link } from "lucide-react";

function LinkNotFound() {
  return (
    <div className="text-gray-500 flex flex-col items-center justify-center gap-4 p-8 border-t border-gray-200">
      <Link size={32} />
      <p className="text-gray-500 text-xs uppercase">Ainda não existem links cadastrados</p>
    </div>
  );
}

export default LinkNotFound;
