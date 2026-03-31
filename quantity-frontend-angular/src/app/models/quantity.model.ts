export interface QuantityDTO {
  value: number;
  unit: string;
  measurementType: string;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
}

export interface QuantityMeasurementDTO {
  resultValue: number;
  resultUnit: string;
  resultString: string;
  operation: string;
  error: boolean;
  errorMessage?: string;
}