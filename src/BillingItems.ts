export class BillingItem {
    private quantity: number;
    private description: string;
    private GSTRate: number;
    private unitPrice: number;
    private totalCost: number | undefined;
    private totalGSTCost: number | undefined;
    private freeConferenceHoursPerUnit: number | null;
    private totalFreeConferenceHours: number | null;
    private parentBillingItemsReference: BillingItems;


    constructor(description: string, quantity: number, GSTRate: number, price: any, freeConferenceHoursPerUnit: number | null, parentBillingItemsReference: BillingItems) {
        this.quantity = quantity;
        this.description = description;
        this.GSTRate = GSTRate;
        this.unitPrice = price;
        this.freeConferenceHoursPerUnit = freeConferenceHoursPerUnit;
        this.parentBillingItemsReference = parentBillingItemsReference;
        this.totalFreeConferenceHours = this.freeConferenceHoursPerUnit ? this.freeConferenceHoursPerUnit * this.quantity : null
    }

    private calculateCost() {
        if (this.getDescription() === 'hours of Conference Room usage') {
            const freeConferenceHoursOfOtherServices = this.parentBillingItemsReference.getFreeConferenceHours();
            return Math.floor(Math.max((this.quantity - freeConferenceHoursOfOtherServices) * this.unitPrice, 0));
        }
        return Math.floor(this.quantity * this.unitPrice);
    }
    private calculateTotalGSTCost() {
        return Math.floor(this.calculateCost() * this.GSTRate);
    }

    private calculateTotalCost() {
        return Math.floor(this.calculateCost() + this.calculateTotalGSTCost());
    }

    getQuantity() {
        return this.quantity;
    }

    getDescription() {
        return this.description;
    }

    getTotalCost() {
        this.totalCost = this.calculateTotalCost();
        return this.totalCost;
    }

    getTotalGSTCost() {
        this.totalGSTCost = this.calculateTotalGSTCost();
        return this.totalGSTCost;
    }

    getTotalFreConferenceHours() {
        return this.totalFreeConferenceHours;
    }
}
export class BillingItems {
    private billingItemsList: BillingItem[] = [];

    addItemWithInfo(descriptionOfBillingItem: string, unitsOfBillingItem: number, GSTRate: number, priceOfBillingItem: number, freeConferenceHours: number | null, billingItems: BillingItems) {
        let billingItem = new BillingItem(descriptionOfBillingItem, unitsOfBillingItem, GSTRate, priceOfBillingItem, freeConferenceHours, billingItems);
        this.billingItemsList.push(billingItem);
    }

    getTotalCost() {
        return this.billingItemsList.reduce((totalCost, billingItem) => totalCost + billingItem.getTotalCost(), 0);
    }

    getTotalGSTCost() {
        return this.billingItemsList.reduce((totalGSTCost, billingItem) => totalGSTCost + billingItem.getTotalGSTCost(), 0);
    }

    getBillingItems(): BillingItem[] {
        return this.billingItemsList;
    }

    getFreeConferenceHours(): number {
        return this.billingItemsList.reduce((freeConferenceHours, billingItem) => freeConferenceHours + (billingItem.getTotalFreConferenceHours() || 0), 0);
    }
}