/**
 * A stored indicator figure in both forms the UI needs it in.
 *
 * `value` is the parsed magnitude, for comparisons and charts — null wherever
 * the backend could not read a number, including indicators whose baseline has
 * not been set yet. `label` is the figure as authored, so comparators and survey
 * annotations the plan carries (`<15 (दि.वि.ल.)`) survive to the screen.
 */
export interface IndicatorMeasure {
  value: number | null;
  label: string;
}

export interface IndicatorFiscalYear {
  id: string;
  year: string;
  dateInAd: string | null;
}

export interface ImpactIndicator {
  configId: string;
  indicatorId: string;
  code: string;
  name: string;
  unit: string | null;
  baseYear: string | null;
  /** Current status for `fiscalYear`. National — no province breakdown exists. */
  current: IndicatorMeasure | null;
  /** This fiscal year's milestone. */
  currentTarget: IndicatorMeasure | null;
  /** The end-of-plan (2030) commitment. */
  endTarget: IndicatorMeasure | null;
  dataSource: string | null;
  remarks: string | null;
}

export interface ImpactIndicatorsResponse {
  locale: string;
  fiscalYear: IndicatorFiscalYear | null;
  endFiscalYear: IndicatorFiscalYear | null;
  indicators: Array<ImpactIndicator>;
}
