// Brazilian Tax Calculation Engine
// Comprehensive tax calculation for Brazilian fiscal requirements

export type RegimeTributario = 'sn' | 'normal';
export type OperationType = 'venda' | 'bonificacao' | 'transferencia' | 'devolucao';

export interface ContextoFiscal {
  regime: RegimeTributario;
  ufEmit: string;
  ufDest: string;
  operacao: OperationType;
  contribuinteICMS?: boolean;
}

export interface ParamTributarios {
  cfop: string;
  ncm?: string;
  cest?: string;
  cstIcms?: string;
  csosn?: string;
  aliqICMS?: number;
  redBaseICMS?: number;
  mvaST?: number;
  fcp?: number;
  aliqPIS?: number;
  aliqCOFINS?: number;
  aliqIPI?: number;
  cargaEfetiva?: number; // Para Simples Nacional
  iss?: {
    municipio: string;
    aliq: number;
    redBase?: number;
  };
}

export interface ItemFiscal {
  qtd: number;
  un: string;
  precoUnit: number;
  desconto?: number;
  freteRateado?: number;
  outras?: number;
}

export interface ResultadoCalculoItem {
  baseProduto: number;
  // ICMS
  baseICMS?: number;
  valorICMS?: number;
  // ICMS ST
  baseST?: number;
  valorST?: number;
  // PIS/COFINS
  valorPIS?: number;
  valorCOFINS?: number;
  // IPI
  valorIPI?: number;
  // ISS (NFS-e)
  baseISS?: number;
  valorISS?: number;
  // Simples Nacional
  cargaEfetiva?: number;
  // FCP
  valorFCP?: number;
}

/**
 * Calcula impostos para um item individual
 */
export function calcularItem(
  ctx: ContextoFiscal, 
  param: ParamTributarios, 
  item: ItemFiscal
): ResultadoCalculoItem {
  // Base de cálculo do produto
  const base = (item.precoUnit * item.qtd) - (item.desconto || 0) + 
               (item.freteRateado || 0) + (item.outras || 0);
  
  const resultado: ResultadoCalculoItem = { baseProduto: base };

  if (ctx.regime === 'sn' && param.cargaEfetiva) {
    // Simples Nacional - Carga Efetiva
    resultado.cargaEfetiva = +(base * (param.cargaEfetiva / 100)).toFixed(2);
  } else {
    // Regime Normal - Cálculo detalhado

    // ICMS
    if (param.aliqICMS) {
      const baseIcms = +(base * (1 - (param.redBaseICMS || 0) / 100)).toFixed(2);
      const vIcms = +(baseIcms * (param.aliqICMS / 100)).toFixed(2);
      resultado.baseICMS = baseIcms;
      resultado.valorICMS = vIcms;

      // ICMS ST
      if (param.mvaST) {
        const baseST = +((base * (1 + param.mvaST / 100)) - baseIcms).toFixed(2);
        resultado.baseST = baseST;
        resultado.valorST = +(baseST * (param.aliqICMS / 100)).toFixed(2);
      }

      // FCP (Fundo de Combate à Pobreza)
      if (param.fcp) {
        resultado.valorFCP = +(baseIcms * (param.fcp / 100)).toFixed(2);
      }
    }

    // IPI
    if (param.aliqIPI) {
      resultado.valorIPI = +(base * (param.aliqIPI / 100)).toFixed(2);
    }

    // PIS/COFINS
    if (param.aliqPIS) {
      resultado.valorPIS = +(base * (param.aliqPIS / 100)).toFixed(2);
    }
    if (param.aliqCOFINS) {
      resultado.valorCOFINS = +(base * (param.aliqCOFINS / 100)).toFixed(2);
    }
  }

  // ISS (para serviços - NFS-e)
  if (param.iss) {
    const baseISS = +(base * (1 - (param.iss.redBase || 0) / 100)).toFixed(2);
    resultado.baseISS = baseISS;
    resultado.valorISS = +(baseISS * (param.iss.aliq / 100)).toFixed(2);
  }

  return resultado;
}

/**
 * Valida CFOP baseado na operação
 */
export function validarCFOP(cfop: string, operacao: OperationType, ufEmit: string, ufDest: string): boolean {
  const cfopNum = parseInt(cfop);
  
  // CFOPs dentro do estado (5xxx)
  if (ufEmit === ufDest && cfopNum >= 5000 && cfopNum < 6000) return true;
  
  // CFOPs fora do estado (6xxx) 
  if (ufEmit !== ufDest && cfopNum >= 6000 && cfopNum < 7000) return true;
  
  // CFOPs do exterior (7xxx)
  if (cfopNum >= 7000 && cfopNum < 8000) return true;
  
  return false;
}

/**
 * Calcula totais consolidados de uma NF-e
 */
export function calcularTotaisNFe(itens: ResultadoCalculoItem[]): {
  valorProdutos: number;
  valorTotalNFe: number;
  totalICMS: number;
  totalST: number;
  totalPIS: number;
  totalCOFINS: number;
  totalIPI: number;
  totalFCP: number;
} {
  return itens.reduce((acc, item) => ({
    valorProdutos: acc.valorProdutos + item.baseProduto,
    valorTotalNFe: acc.valorTotalNFe + item.baseProduto,
    totalICMS: acc.totalICMS + (item.valorICMS || 0),
    totalST: acc.totalST + (item.valorST || 0),
    totalPIS: acc.totalPIS + (item.valorPIS || 0),
    totalCOFINS: acc.totalCOFINS + (item.valorCOFINS || 0),
    totalIPI: acc.totalIPI + (item.valorIPI || 0),
    totalFCP: acc.totalFCP + (item.valorFCP || 0),
  }), {
    valorProdutos: 0,
    valorTotalNFe: 0,
    totalICMS: 0,
    totalST: 0,
    totalPIS: 0,
    totalCOFINS: 0,
    totalIPI: 0,
    totalFCP: 0,
  });
}