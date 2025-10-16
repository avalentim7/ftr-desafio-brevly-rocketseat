import { useForm } from "react-hook-form";
import { useLinksStore } from "../store/use-links-store";
import { useState } from "react";
import { CircleAlert } from "lucide-react";

interface FormData {
  url: string;
  shortenedUrl: string;
}

export default function FormCreateShortenedUrl() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: "onSubmit" });

  const createLink = useLinksStore((state) => state.createLink);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await createLink(data.url, data.shortenedUrl);
      reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar link";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col mb-2 gap-2">
        <label
          htmlFor="url"
          className={`uppercase text-xs transition-colors ${
            focusedField === "url" ? "text-blue-base" : "text-gray-500"
          }`}
        >
          Link Original
        </label>
        <input
          type="text"
          id="url"
          placeholder="https://www.exemplo.com.br"
          className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.url ? "border-red-500" : "border-gray-300"
          }`}
          {...register("url", {
            required: "Informe uma URL válida.",
            pattern: {
              value: /^https?:\/\/.+\..+/i,
              message: "A URL não é válida",
            },
          })}
          onFocus={() => setFocusedField("url")}
          onBlur={() => setFocusedField(null)}
        />
        {errors.url && (
          <div className="flex items-center gap-2 text-red-500 text-xs">
            <CircleAlert size={16} />
            <span>{errors.url.message}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col mb-2 gap-2">
        <label
          htmlFor="shortenedUrl"
          className={`uppercase text-xs transition-colors ${
            focusedField === "shortenedUrl" ? "text-blue-base" : "text-gray-500"
          }`}
        >
          Link Encurtado
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 text-sm pointer-events-none">
            brev.ly/
          </span>
          <input
            type="text"
            id="shortenedUrl"
            placeholder=""
            className={`pl-[62px] w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.shortenedUrl ? "border-red-500" : "border-gray-300"
            }`}
            {...register("shortenedUrl", {
              required: "Informe uma URL minúscula, sem espaços ou símbolos.",
              minLength: {
                value: 2,
                message: "URL deve ter 2 caracteres no mínimo.",
              },
            })}
            onFocus={() => setFocusedField("shortenedUrl")}
            onBlur={() => setFocusedField(null)}
          />
        </div>
        {errors.shortenedUrl && (
          <div className="flex items-center gap-2 text-red-500 text-xs">
            <CircleAlert size={16} />
            <span>{errors.shortenedUrl.message}</span>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-base font-semibold h-12 text-white px-4 py-2 rounded-lg hover:bg-blue-dark disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isSubmitting ? "Salvando..." : "Salvar Link"}
      </button>
    </form>
  );
}
