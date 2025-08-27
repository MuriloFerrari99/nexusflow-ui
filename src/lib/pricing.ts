// Pricing calculation service with all formulas
export interface PricingInputs {
  cost_base: number;
  freight_unit_cost: number;
  packaging_unit_cost: number;
  other_variable_cost: number;
  markup_percent?: number;
  margin_target_percent?: number;
  target_price?: number;
  icms_percent?: number;
  pis_percent?: number;
  cofins_percent?: number;
  iss_percent?: number;
  tax_burden_percent?: number;
  gateway_percent?: number;
  marketplace_percent?: number;
  sales_commission_percent?: number;
  admin_fixed_fee?: number;
}

export interface PricingMode {
  mode: 'markup' | 'margin' | 'target_price';
}

export interface RoundingConfig {
  rounding: 'none' | 'normal' | 'psychological';
  rounding_decimals: number;
  rounding_ending: string;
}

export interface PricingResult {
  price_suggested: number;
  margin_percent: number;
  markup_percent: number;
  profit_amount: number;
  total_cost: number;
  total_taxes_percent: number;
  breakdown: {
    cost_total: number;
    taxes_amount: number;
    fees_amount: number;
    profit: number;
    steps: string[];
  };
  warnings: string[];
}

export function calculateTotalCost(inputs: PricingInputs): number {
  return (
    inputs.cost_base +
    inputs.freight_unit_cost +
    inputs.packaging_unit_cost +
    inputs.other_variable_cost
  );
}

export function calculateTotalTaxesPercent(inputs: PricingInputs): number {
  const taxBurden = inputs.tax_burden_percent || 0;
  
  // Se tax_burden_percent estiver definido, usar ele (mais simples)
  if (taxBurden > 0) {
    return taxBurden;
  }
  
  // Senão, somar impostos individuais
  return (
    (inputs.icms_percent || 0) +
    (inputs.pis_percent || 0) +
    (inputs.cofins_percent || 0) +
    (inputs.iss_percent || 0)
  );
}

export function calculateTotalFeesPercent(inputs: PricingInputs): number {
  return (
    (inputs.gateway_percent || 0) +
    (inputs.marketplace_percent || 0) +
    (inputs.sales_commission_percent || 0)
  );
}

export function applyRounding(price: number, config: RoundingConfig): number {
  if (config.rounding === 'none') {
    return price;
  }
  
  if (config.rounding === 'normal') {
    return Math.round(price * Math.pow(10, config.rounding_decimals)) / Math.pow(10, config.rounding_decimals);
  }
  
  if (config.rounding === 'psychological') {
    // Para arredondamento psicológico (ex: ,99)
    const integerPart = Math.floor(price);
    const ending = config.rounding_ending === ',99' ? 0.99 : 
                   config.rounding_ending === ',95' ? 0.95 : 0.99;
    return integerPart + ending;
  }
  
  return price;
}

export function calculatePricing(
  inputs: PricingInputs, 
  mode: PricingMode, 
  rounding: RoundingConfig
): PricingResult {
  const totalCost = calculateTotalCost(inputs);
  const totalTaxesPercent = calculateTotalTaxesPercent(inputs) / 100;
  const totalFeesPercent = calculateTotalFeesPercent(inputs) / 100;
  const adminFixedFee = inputs.admin_fixed_fee || 0;
  
  let priceSuggested = 0;
  let marginPercent = 0;
  let markupPercent = 0;
  const steps: string[] = [];
  const warnings: string[] = [];
  
  // Validações iniciais
  if (totalCost <= 0) {
    warnings.push('Custo total deve ser maior que zero');
  }
  
  const totalPercentualTaxesAndFees = totalTaxesPercent + totalFeesPercent;
  
  if (totalPercentualTaxesAndFees >= 1) {
    warnings.push('Total de impostos e taxas não pode ser maior ou igual a 100%');
  }
  
  steps.push(`Custo total: R$ ${totalCost.toFixed(2)}`);
  steps.push(`Impostos: ${(totalTaxesPercent * 100).toFixed(1)}%`);
  steps.push(`Taxas: ${(totalFeesPercent * 100).toFixed(1)}%`);
  if (adminFixedFee > 0) {
    steps.push(`Taxa fixa: R$ ${adminFixedFee.toFixed(2)}`);
  }
  
  try {
    switch (mode.mode) {
      case 'markup':
        markupPercent = inputs.markup_percent || 0;
        
        // Fórmula: preço_bruto = custo_total * (1 + markup%)
        const priceBrutoSemTax = totalCost * (1 + markupPercent / 100);
        steps.push(`Preço bruto (custo + markup ${markupPercent}%): R$ ${priceBrutoSemTax.toFixed(2)}`);
        
        // Aplicar impostos e taxas: preço_final = (preço_bruto + taxa_fixa) / (1 - percentual_total)
        priceSuggested = (priceBrutoSemTax + adminFixedFee) / (1 - totalPercentualTaxesAndFees);
        steps.push(`Preço final (após impostos/taxas): R$ ${priceSuggested.toFixed(2)}`);
        break;
        
      case 'margin':
        marginPercent = inputs.margin_target_percent || 0;
        
        // Fórmula: preço = (custo_total + taxa_fixa) / (1 - (margem% + impostos% + taxas%))
        const targetMarginDecimal = marginPercent / 100;
        priceSuggested = (totalCost + adminFixedFee) / (1 - (targetMarginDecimal + totalPercentualTaxesAndFees));
        
        steps.push(`Margem desejada: ${marginPercent}%`);
        steps.push(`Preço calculado para margem: R$ ${priceSuggested.toFixed(2)}`);
        break;
        
      case 'target_price':
        priceSuggested = inputs.target_price || 0;
        
        // Calcular margem líquida obtida
        const profitLiquido = priceSuggested * (1 - totalPercentualTaxesAndFees) - adminFixedFee - totalCost;
        marginPercent = priceSuggested > 0 ? (profitLiquido / priceSuggested) * 100 : 0;
        markupPercent = totalCost > 0 ? (profitLiquido / totalCost) * 100 : 0;
        
        steps.push(`Preço alvo: R$ ${priceSuggested.toFixed(2)}`);
        steps.push(`Margem calculada: ${marginPercent.toFixed(1)}%`);
        steps.push(`Markup calculado: ${markupPercent.toFixed(1)}%`);
        break;
    }
  } catch (error) {
    warnings.push('Erro no cálculo: verifique os valores inseridos');
    priceSuggested = 0;
  }
  
  // Aplicar arredondamento
  const priceBeforeRounding = priceSuggested;
  priceSuggested = applyRounding(priceSuggested, rounding);
  
  if (priceBeforeRounding !== priceSuggested) {
    steps.push(`Arredondamento ${rounding.rounding}: R$ ${priceBeforeRounding.toFixed(2)} → R$ ${priceSuggested.toFixed(2)}`);
  }
  
  // Recalcular métricas finais
  const finalProfit = priceSuggested * (1 - totalPercentualTaxesAndFees) - adminFixedFee - totalCost;
  const finalMargin = priceSuggested > 0 ? (finalProfit / priceSuggested) * 100 : 0;
  const finalMarkup = totalCost > 0 ? (finalProfit / totalCost) * 100 : 0;
  
  if (finalMargin < 0) {
    warnings.push('Margem negativa! Preço abaixo do custo total.');
  }
  
  if (finalMargin < 5) {
    warnings.push('Margem muito baixa (menor que 5%)');
  }
  
  const taxesAmount = priceSuggested * totalTaxesPercent;
  const feesAmount = priceSuggested * totalFeesPercent;
  
  return {
    price_suggested: priceSuggested,
    margin_percent: finalMargin,
    markup_percent: finalMarkup,
    profit_amount: finalProfit,
    total_cost: totalCost,
    total_taxes_percent: totalTaxesPercent * 100,
    breakdown: {
      cost_total: totalCost,
      taxes_amount: taxesAmount,
      fees_amount: feesAmount + adminFixedFee,
      profit: finalProfit,
      steps,
    },
    warnings,
  };
}