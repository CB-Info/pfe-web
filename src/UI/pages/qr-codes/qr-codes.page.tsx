import React, { useState, useEffect } from "react";
import { Table } from "../../../data/models/table.model";
import { TablesRepositoryImpl } from "../../../network/repositories/tables.repository";
import { PageHeader } from "../../components/layout/page-header.component";
import { QrCode, Download, Printer, ExternalLink } from "lucide-react";
import Loading from "../../components/common/loading.component";
import { useAlerts } from "../../../hooks/useAlerts";
import { BaseContent } from "../../components/contents/base.content";

// Fonction simple pour générer un QR code en ASCII (pour démonstration)
// En production, vous devriez utiliser une vraie bibliothèque comme qrcode.js
const generateSimpleQR = (text: string): string => {
  // Pour la démonstration, nous retournons un placeholder
  // En réalité, vous devriez utiliser une bibliothèque comme qrcode
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="10" y="10" width="180" height="180" fill="black"/>
      <rect x="20" y="20" width="160" height="160" fill="white"/>
      <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">
        QR Code
      </text>
      <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="10" fill="black">
        Table: ${text.split("/").pop()}
      </text>
    </svg>
  `)}`;
};

interface QRCodeCardProps {
  table: Table;
  onGenerateQR: (tableId: string) => void;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ table, onGenerateQR }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const customerUrl = `${window.location.origin}/customer/${table._id}`;

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    try {
      // Simuler la génération (remplacer par une vraie bibliothèque QR)
      await new Promise((resolve) => setTimeout(resolve, 500));
      const qrDataURL = generateSimpleQR(customerUrl);
      setQrCode(qrDataURL);
      onGenerateQR(table._id);
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.download = `qr-table-${table.number}.png`;
    link.href = qrCode;
    link.click();
  };

  const handlePrint = () => {
    if (!qrCode) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - Table ${table.number}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                text-align: center;
              }
              .qr-container {
                page-break-inside: avoid;
                margin-bottom: 40px;
              }
              .table-info {
                margin-bottom: 20px;
                font-size: 24px;
                font-weight: bold;
              }
              .qr-image {
                border: 2px solid #ddd;
                border-radius: 8px;
              }
              .instructions {
                margin-top: 20px;
                font-size: 16px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="table-info">Table ${table.number}</div>
              <img src="${qrCode}" alt="QR Code Table ${table.number}" class="qr-image" />
              <div class="instructions">
                Scannez ce QR code pour consulter la carte<br>
                et passer votre commande
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleTestURL = () => {
    window.open(customerUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Table {table.number}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span
            className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${
              table.isOccupied
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }
          `}
          >
            {table.isOccupied ? "Occupée" : "Libre"}
          </span>
          <span>• {table.capacity} places</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* URL de la table */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">URL client :</p>
          <p className="text-sm font-mono text-gray-800 break-all">
            {customerUrl}
          </p>
        </div>

        {/* QR Code */}
        {qrCode ? (
          <div className="text-center">
            <img
              src={qrCode}
              alt={`QR Code Table ${table.number}`}
              className="mx-auto border border-gray-200 rounded-lg"
              style={{ width: "200px", height: "200px" }}
            />
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button
                onClick={handleTestURL}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Tester
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={handleGenerateQR}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loading size="small" />
                  Génération...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  Générer QR Code
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function QRCodesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedCount, setGeneratedCount] = useState(0);
  const { addAlert } = useAlerts();

  const tablesRepository = new TablesRepositoryImpl();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const fetchedTables = await tablesRepository.getAll();
        const sortedTables = fetchedTables.sort((a, b) => a.number - b.number);
        setTables(sortedTables);
      } catch (error) {
        addAlert({
          severity: "error",
          message: "Erreur lors de la récupération des tables",
          timeout: 5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleGenerateQR = () => {
    setGeneratedCount((prev) => prev + 1);
  };

  const handleGenerateAllQR = async () => {
    for (const table of tables) {
      // Simuler la génération pour toutes les tables
      setTimeout(() => {
        // Déclencher la génération pour chaque table
        const event = new CustomEvent("generate-qr", {
          detail: { tableId: table._id },
        });
        document.dispatchEvent(event);
      }, tables.indexOf(table) * 200);
    }
  };

  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const qrCodes = tables.map((table) => {
        const customerUrl = `${window.location.origin}/customer/${table._id}`;
        const qrCode = generateSimpleQR(customerUrl);
        return { table, qrCode };
      });

      const htmlContent = `
        <html>
          <head>
            <title>QR Codes - Toutes les tables</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              .qr-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 40px;
              }
              .qr-container {
                page-break-inside: avoid;
                text-align: center;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
              }
              .table-info {
                margin-bottom: 15px;
                font-size: 18px;
                font-weight: bold;
              }
              .qr-image {
                border: 2px solid #ddd;
                border-radius: 8px;
              }
              .instructions {
                margin-top: 15px;
                font-size: 12px;
                color: #666;
              }
              @media print {
                .qr-container { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <h1 style="text-align: center; margin-bottom: 40px;">QR Codes - Tables du restaurant</h1>
            <div class="qr-grid">
              ${qrCodes
                .map(
                  ({ table, qrCode }) => `
                <div class="qr-container">
                  <div class="table-info">Table ${table.number}</div>
                  <img src="${qrCode}" alt="QR Code Table ${table.number}" class="qr-image" width="150" height="150" />
                  <div class="instructions">
                    Scannez pour consulter la carte<br>
                    et passer votre commande
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="medium" text="Chargement des tables..." />
      </div>
    );
  }

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<QrCode className="w-6 h-6 text-blue-600" />}
          title="QR Codes des tables"
          description="Générez et gérez les QR codes pour permettre aux clients de commander depuis leur table"
        />

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-6">
            {/* Actions globales */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleGenerateAllQR}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Générer tous les QR codes
              </button>
              <button
                onClick={handlePrintAll}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimer toutes les tables
              </button>
              {generatedCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                  <QrCode className="w-4 h-4" />
                  {generatedCount} QR code(s) généré(s)
                </div>
              )}
            </div>

            {/* Grille des tables */}
            {tables.length === 0 ? (
              <div className="text-center py-16">
                <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune table trouvée
                </h3>
                <p className="text-gray-500">
                  Ajoutez des tables dans la section de gestion pour générer des
                  QR codes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table) => (
                  <QRCodeCard
                    key={table._id}
                    table={table}
                    onGenerateQR={handleGenerateQR}
                  />
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Comment utiliser les QR codes
              </h3>
              <div className="space-y-2 text-blue-800">
                <p>
                  1. <strong>Générez</strong> les QR codes pour chaque table
                </p>
                <p>
                  2. <strong>Imprimez</strong> les QR codes et placez-les sur
                  les tables
                </p>
                <p>
                  3. Les clients <strong>scannent</strong> le QR code avec leur
                  téléphone
                </p>
                <p>
                  4. Ils accèdent directement à la carte et peuvent{" "}
                  <strong>commander</strong> sans authentification
                </p>
                <p>
                  5. Les commandes apparaissent automatiquement dans votre
                  interface de gestion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseContent>
  );
}
