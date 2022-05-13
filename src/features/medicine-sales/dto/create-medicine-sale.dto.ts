export class CreateMedicineSaleDto {
  purchaseId?: string;
  medicineId?: string;
  name?: string;
  quantity?: number;
  sellQuantity: number;
  finalMedicineAmount?: number;
  totalAmount: number;
}
