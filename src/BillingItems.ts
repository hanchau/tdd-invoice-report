import {BillingItem} from "./BillingItem";

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