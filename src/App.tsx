/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Table, 
  ArrowRight,
  Terminal,
  Trash2,
  Calendar,
  Zap,
  Layers,
  BookOpen,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DataRow {
  ID: string;
  Duration: string;
  Date: string;
  Pulse: string;
  Maxpulse: string;
  Calories: string;
  [key: string]: string;
}

const INITIAL_CSV = `ID;Duration;Date;Pulse;Maxpulse;Calories
0;60;'2020/12/01';110;130;4091
1;60;'2020/12/02';117;145;4790
2;60;'2020/12/03';103;135;3400
3;45;'2020/12/04';109;175;2824
4;45;'2020/12/05';117;148;4060
5;60;'2020/12/06';102;127;3000
6;60;'2020/12/07';110;136;3740
7;450;'2020/12/08';104;134;2533
8;30;'2020/12/09';109;133;1951
9;60;'2020/12/10';98;124;2690
10;60;'2020/12/11';103;147;3293
11;60;'2020/12/12';100;120;2507
12;60;'2020/12/12';100;120;2507
13;60;'2020/12/13';106;128;3453
14;60;'2020/12/14';104;132;3793
15;60;'2020/12/15';98;123;2750
16;60;'2020/12/16';98;120;2152
17;60;'2020/12/17';100;120;3000
18;45;'2020/12/18';90;112;NaN
19;60;'2020/12/19';103;123;3230
20;45;'2020/12/20';97;125;2430
21;60;'2020/12/21';108;131;3642
22;45;NaN;100;119;2820
23;60;'2020/12/23';130;101;3000
24;45;'2020/12/24';105;132;2460
25;60;'2020/12/25';102;126;3345
26;60;20201226;100;120;2500
27;60;'2020/12/27';92;118;2410
28;60;'2020/12/28';103;132;NaN
29;60;'2020/12/29';100;132;2800
30;60;'2020/12/30';102;129;3803
31;60;'2020/12/31';92;115;2430`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'micro' | 'practical'>('micro');
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DataRow[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

  const microSteps = [
    {
      title: "M1: Leitura de CSV",
      description: "Importação da biblioteca pandas e leitura do arquivo CSV com parâmetros específicos.",
      icon: <FileText className="w-6 h-6" />,
      code: `import pandas as pd\ndf = pd.read_csv('data.csv', sep=';', engine='python')\nprint(df)`,
      action: () => {
        const parsed = Papa.parse<DataRow>(INITIAL_CSV, { header: true, delimiter: ';', skipEmptyLines: true });
        setData(parsed.data);
        addLog("Microatividade 1: CSV lido com sucesso.");
      }
    },
    {
      title: "M2: Subconjunto de Dados",
      description: "Criação de um subconjunto contendo apenas as colunas ID, Duration e Date.",
      icon: <Layers className="w-6 h-6" />,
      code: `df_subset = df[['ID', 'Duration', 'Date']]\nprint(df_subset)`,
      action: () => {
        const newData = data.map(row => ({ ID: row.ID, Duration: row.Duration, Date: row.Date } as DataRow));
        setData(newData);
        addLog("Microatividade 2: Subconjunto criado (3 colunas).");
      }
    },
    {
      title: "M3: Configuração de Exibição",
      description: "Configuração do max_rows para 9999 e exibição usando to_string().",
      icon: <RefreshCw className="w-6 h-6" />,
      code: `pd.options.display.max_rows = 9999\nprint(df.to_string())`,
      action: () => {
        addLog("Microatividade 3: Configuração max_rows = 9999 aplicada.");
      }
    },
    {
      title: "M4: Primeiras e Últimas Linhas",
      description: "Exibição das primeiras 10 e últimas 10 linhas do conjunto original.",
      icon: <Table className="w-6 h-6" />,
      code: `print(df.head(10))\nprint(df.tail(10))`,
      action: () => {
        addLog("Microatividade 4: Exibindo head(10) e tail(10).");
      }
    },
    {
      title: "M5: Informações Gerais",
      description: "Uso do método info() para extrair metadados do conjunto de dados.",
      icon: <BookOpen className="w-6 h-6" />,
      code: `print(df.info())`,
      action: () => {
        addLog("Microatividade 5: Informações gerais extraídas.");
        addLog(`Linhas: ${data.length}, Colunas: 6`);
      }
    }
  ];

  const practicalSteps = [
    {
      title: "Importação e Verificação",
      description: "Leitura inicial e verificação de integridade dos dados.",
      icon: <FileText className="w-6 h-6" />,
      code: `df = pd.read_csv('data.csv', sep=';')\nprint(df.info())`,
      action: () => {
        const parsed = Papa.parse<DataRow>(INITIAL_CSV, { header: true, delimiter: ';', skipEmptyLines: true });
        setData(parsed.data);
        addLog("Trabalho Prático: Dados carregados.");
      }
    },
    {
      title: "Tratamento de Calorias",
      description: "Substituição de valores nulos (NaN) em 'Calories' por 0.",
      icon: <Zap className="w-6 h-6" />,
      code: `df_copy['Calories'] = df_copy['Calories'].fillna(0)`,
      action: () => {
        const newData = data.map(row => ({
          ...row,
          Calories: (row.Calories === "NaN" || row.Calories === "" || row.Calories === undefined) ? "0" : row.Calories
        }));
        setData(newData);
        addLog("Calorias nulas substituídas por 0.");
      }
    },
    {
      title: "Tratamento de Datas (1900/01/01)",
      description: "Preenchimento de datas nulas com marcador temporário.",
      icon: <Calendar className="w-6 h-6" />,
      code: `df_copy['Date'] = df_copy['Date'].fillna('1900/01/01')`,
      action: () => {
        const newData = data.map(row => ({
          ...row,
          Date: (row.Date === "NaN" || row.Date === "" || row.Date === undefined) ? "1900/01/01" : row.Date
        }));
        setData(newData);
        addLog("Datas nulas preenchidas com '1900/01/01'.");
      }
    },
    {
      title: "Erro de Conversão",
      description: "Tentativa de conversão que falha devido ao marcador '1900/01/01'.",
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      code: `df_copy['Date'] = pd.to_datetime(df_copy['Date'], format='%Y/%m/%d')`,
      action: () => {
        setError("ValueError: time data '1900/01/01' does not match format '%Y/%m/%d'");
        addLog("ERRO: Formato incompatível detectado.");
      }
    },
    {
      title: "Correção com NaN",
      description: "Substituição do marcador por NaN real para permitir conversão.",
      icon: <RefreshCw className="w-6 h-6" />,
      code: `df_copy['Date'] = df_copy['Date'].replace('1900/01/01', np.nan)`,
      action: () => {
        const newData = data.map(row => ({
          ...row,
          Date: row.Date === "1900/01/01" ? "" : row.Date
        }));
        setData(newData);
        setError(null);
        addLog("'1900/01/01' substituído por NaN.");
      }
    },
    {
      title: "Erro de Formato (20201226)",
      description: "Outro erro: valor sem separadores detectado.",
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      code: `df_copy['Date'] = pd.to_datetime(df_copy['Date'], format='%Y/%m/%d')`,
      action: () => {
        setError("ValueError: time data '20201226' does not match format '%Y/%m/%d'");
        addLog("ERRO: '20201226' impede a conversão em lote.");
      }
    },
    {
      title: "Ajuste Fino e Conversão",
      description: "Correção do valor específico e conversão final bem-sucedida.",
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      code: `df_copy['Date'] = df_copy['Date'].replace('20201226', '2020/12/26')\ndf_copy['Date'] = pd.to_datetime(df_copy['Date'])`,
      action: () => {
        const newData = data.map(row => ({
          ...row,
          Date: row.Date === "20201226" ? "2020/12/26" : row.Date
        }));
        setData(newData);
        setError(null);
        addLog("Datas corrigidas e convertidas para datetime.");
      }
    },
    {
      title: "Remoção de Nulos",
      description: "Limpeza final removendo registros que ainda possuem datas nulas.",
      icon: <Trash2 className="w-6 h-6" />,
      code: `df_copy.dropna(subset=['Date'], inplace=True)`,
      action: () => {
        const newData = data.filter(row => row.Date !== "" && row.Date !== "NaN");
        setData(newData);
        addLog("Registros nulos removidos. Limpeza concluída.");
      }
    }
  ];

  const currentSteps = activeTab === 'micro' ? microSteps : practicalSteps;

  useEffect(() => {
    reset();
  }, [activeTab]);

  const nextStep = () => {
    if (step < currentSteps.length - 1) {
      const next = step + 1;
      setStep(next);
      currentSteps[next].action();
    }
  };

  const reset = () => {
    setStep(0);
    setLogs([]);
    setError(null);
    const parsed = Papa.parse<DataRow>(INITIAL_CSV, { header: true, delimiter: ';', skipEmptyLines: true });
    setData(parsed.data);
    addLog(`Ambiente inicializado: ${activeTab === 'micro' ? 'Microatividades' : 'Trabalho Prático'}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              DGT2823: <span className="text-blue-600">Soluções de Big Data</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Guia Prático de Manipulação e Limpeza de Dados com Pandas
            </p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setActiveTab('micro')}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                activeTab === 'micro' ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Microatividades
            </button>
            <button 
              onClick={() => setActiveTab('practical')}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                activeTab === 'practical' ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Trabalho Prático
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls & Code */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    {currentSteps[step].icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Passo {step + 1}</h2>
                    <p className="text-xs text-slate-400 font-mono">{activeTab === 'micro' ? 'Microatividade' : 'Etapa de Limpeza'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-800">{currentSteps[step].title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {currentSteps[step].description}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Code className="w-3 h-3" />
                  Código Pandas
                </div>
                <pre className="bg-slate-900 text-blue-300 p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner">
                  {currentSteps[step].code}
                </pre>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
                <button 
                  onClick={nextStep}
                  disabled={step === currentSteps.length - 1}
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Console Output */}
            <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Console Output</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
              </div>
              <div className="p-4 h-56 overflow-y-auto font-mono text-[11px] space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                {logs.length === 0 && <span className="text-slate-600 italic">Aguardando execução...</span>}
                {logs.map((log, i) => (
                  <div key={i} className="text-slate-300 flex gap-2">
                    <span className="text-slate-600 shrink-0">[{i}]</span>
                    <span>{log}</span>
                  </div>
                ))}
                {error && (
                  <div className="text-red-400 mt-2 bg-red-950/30 p-3 rounded-lg border border-red-900/50 flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Data Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-800">DataFrame Viewer</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {data.length} registros
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
                    <tr>
                      {Object.keys(data[0] || {}).map(header => (
                        <th key={header} className="px-6 py-4 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence mode="popLayout">
                      {data.map((row, idx) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          key={`${row.ID}-${idx}`} 
                          className={cn(
                            "hover:bg-blue-50/30 transition-colors group",
                            (row.Date === "1900/01/01" || row.Date === "20201226") && "bg-amber-50/50",
                            (row.Calories === "0" || row.Calories === "NaN") && "bg-slate-50/50"
                          )}
                        >
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-6 py-3.5">
                              <span className={cn(
                                "px-2 py-1 rounded-md text-xs font-medium",
                                val === "1900/01/01" && "bg-amber-100 text-amber-700",
                                val === "20201226" && "bg-red-100 text-red-700",
                                (val === "NaN" || val === "") && "bg-slate-100 text-slate-400 italic",
                                val === "0" && row.Calories === "0" && "bg-blue-100 text-blue-700 font-bold"
                              )}>
                                {val || 'NaN'}
                              </span>
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Arquivos do Projeto
                  </h4>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Os scripts Python e o dataset CSV estão disponíveis na raiz do projeto para download e execução local.
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="text-[10px] bg-blue-500 px-2 py-1 rounded font-mono">data.csv</span>
                  <span className="text-[10px] bg-blue-500 px-2 py-1 rounded font-mono">pratica_pandas.py</span>
                </div>
              </div>

              <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Status da Limpeza
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Calorias</p>
                      <p className="text-xs font-semibold text-slate-600">
                        {data.some(r => r.Calories === "NaN" || r.Calories === "") ? "⚠️ Pendente" : "✅ Tratado"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Datas</p>
                      <p className="text-xs font-semibold text-slate-600">
                        {data.some(r => r.Date === "20201226" || r.Date === "1900/01/01") ? "⚠️ Pendente" : "✅ Tratado"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic mt-4">
                  * A limpeza garante que o dataset esteja pronto para algoritmos de Machine Learning e Big Data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
