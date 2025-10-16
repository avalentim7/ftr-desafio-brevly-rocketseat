import { db } from "@/infra/db";
import { Either, makeRight } from "@/infra/shared/either";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";
import { Readable } from "node:stream";

type ExportLinksToCsvOutput = {
  fileKey: string;
  publicUrl: string;
  rowCount: number;
};

export async function exportLinksToCsv(): Promise<Either<never, ExportLinksToCsvOutput>> {
  const links = await db.query.links.findMany({
    orderBy: (links, { desc }) => [desc(links.createdAt)]
  });

  const csvHeader = 'URL Original,URL Encurtada,Contagem de Acessos,Data de Criacao\n';

  const csvRows = links.map(link => {
    const originalUrl = link.originalUrl;
    const shortUrl = link.shortUrl;
    const accessCount = link.accessCount;
    const createdAt = link.createdAt.toISOString();

    return `"${originalUrl}","${shortUrl}",${accessCount},"${createdAt}"`;
  }).join('\n');

  const csvContent = csvHeader + csvRows;

  const csvStream = Readable.from([csvContent]);

  const timestamp = Date.now();
  const fileName = `links-export-${timestamp}.csv`;

  const { key, url } = await uploadFileToStorage({
    folder: 'downloads',
    fileName,
    contentType: 'text/csv',
    contentStream: csvStream,
  });

  return makeRight({
    fileKey: key,
    publicUrl: url,
    rowCount: links.length,
  });
}
