// Motor de Reposição - Cálculos ROP, EOQ e Sugestões
export interface ReplenishmentPolicy {
  policy: 'rop' | 'minmax' | 'periodic';
  serviceLevel: number; // %
  zFactor: number;
  demandDaily: number;
  sigmaDemand: number;
  leadTimeDays: number;
  reviewPeriodDays?: number;
  minLevel?: number;
  maxLevel?: number;
  eoq?: number;
  moq?: number;
  packMultiple?: number;
}

export interface InventoryStatus {
  onHand: number;
  reserved: number;
  inTransit: number;
  netAvailable: number;
}

export interface ReplenishmentSuggestion {
  suggestedQty: number;
  rop: number;
  safetyStock: number;
  targetLevel?: number;
  reason: string;
  expectedStockoutDate?: Date;
  priority: 'crítica' | 'alta' | 'média' | 'baixa';
}

/**
 * Calcula estoque de segurança
 * SS = Z * σ * sqrt(L)
 */
export function calculateSafetyStock(policy: ReplenishmentPolicy): number {
  return policy.zFactor * policy.sigmaDemand * Math.sqrt(policy.leadTimeDays);
}

/**
 * Calcula ponto de pedido (ROP)
 * ROP = d * L + SS
 */
export function calculateROP(policy: ReplenishmentPolicy): number {
  const safetyStock = calculateSafetyStock(policy);
  return policy.demandDaily * policy.leadTimeDays + safetyStock;
}

/**
 * Calcula EOQ (Economic Order Quantity)
 * EOQ = sqrt((2 * D * S) / H)
 */
export function calculateEOQ(
  annualDemand: number,
  orderCost: number,
  holdingCostPerUnit: number
): number {
  return Math.sqrt((2 * annualDemand * orderCost) / holdingCostPerUnit);
}

/**
 * Normaliza quantidade considerando MOQ e múltiplos
 */
export function normalizeQuantity(
  qty: number,
  moq?: number,
  packMultiple?: number
): number {
  let normalizedQty = Math.ceil(qty);
  
  if (moq && normalizedQty < moq) {
    normalizedQty = moq;
  }
  
  if (packMultiple && packMultiple > 1) {
    normalizedQty = Math.ceil(normalizedQty / packMultiple) * packMultiple;
  }
  
  return normalizedQty;
}

/**
 * Gera sugestão de reposição baseada na política
 */
export function generateReplenishmentSuggestion(
  policy: ReplenishmentPolicy,
  inventory: InventoryStatus
): ReplenishmentSuggestion {
  const safetyStock = calculateSafetyStock(policy);
  const rop = calculateROP(policy);
  
  let suggestedQty = 0;
  let targetLevel: number | undefined;
  let reason = '';
  let priority: 'crítica' | 'alta' | 'média' | 'baixa' = 'média';
  
  const projectedStock = inventory.netAvailable + inventory.inTransit;
  const daysUntilStockout = projectedStock / policy.demandDaily;
  
  // Determinar prioridade baseada no risco
  if (projectedStock <= safetyStock) {
    priority = 'crítica';
  } else if (projectedStock <= rop) {
    priority = 'alta';
  } else if (daysUntilStockout <= policy.leadTimeDays + 2) {
    priority = 'média';
  } else {
    priority = 'baixa';
  }
  
  switch (policy.policy) {
    case 'rop':
      if (projectedStock <= rop) {
        const baseQty = Math.max(
          policy.eoq || rop,
          rop + policy.demandDaily * (policy.reviewPeriodDays || 0) - projectedStock
        );
        suggestedQty = normalizeQuantity(baseQty, policy.moq, policy.packMultiple);
        reason = `Estoque projetado (${projectedStock}) abaixo do ROP (${rop})`;
      }
      break;
      
    case 'minmax':
      targetLevel = policy.maxLevel || rop * 2;
      if (projectedStock < (policy.minLevel || rop)) {
        suggestedQty = normalizeQuantity(
          targetLevel - projectedStock,
          policy.moq,
          policy.packMultiple
        );
        reason = `Estoque abaixo do mínimo (${policy.minLevel || rop})`;
      }
      break;
      
    case 'periodic':
      targetLevel = policy.demandDaily * (policy.leadTimeDays + (policy.reviewPeriodDays || 0)) + safetyStock;
      if (projectedStock < targetLevel) {
        suggestedQty = normalizeQuantity(
          targetLevel - projectedStock,
          policy.moq,
          policy.packMultiple
        );
        reason = `Revisão periódica - target level (${targetLevel})`;
      }
      break;
  }
  
  // Calcular data prevista de ruptura
  let expectedStockoutDate: Date | undefined;
  if (daysUntilStockout > 0 && daysUntilStockout < 90) {
    expectedStockoutDate = new Date();
    expectedStockoutDate.setDate(expectedStockoutDate.getDate() + Math.floor(daysUntilStockout));
  }
  
  return {
    suggestedQty,
    rop,
    safetyStock,
    targetLevel,
    reason,
    expectedStockoutDate,
    priority
  };
}

/**
 * Converte nível de serviço (%) para fator Z
 */
export function getZFactor(serviceLevel: number): number {
  const zTable: Record<number, number> = {
    50: 0.00,
    60: 0.25,
    70: 0.52,
    80: 0.84,
    85: 1.04,
    90: 1.28,
    95: 1.65,
    97: 1.88,
    99: 2.33,
    99.5: 2.58,
    99.9: 3.09
  };
  
  return zTable[serviceLevel] || 1.65; // Default 95%
}