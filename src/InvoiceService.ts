class BillingItem {
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

    private calculateTotalGSTCost() {
        if(this.getDescription() === 'hours of Conference Room usage') {
            const freeConferenceHoursOfOtherServices = this.parentBillingItemsReference.getFreeConferenceHours() || 0;
            return Math.floor(Math.max((this.quantity - freeConferenceHoursOfOtherServices)* this.unitPrice * (this.GSTRate), 0));
        }
        return Math.floor(this.quantity * this.unitPrice * this.GSTRate);
    }

    private calculateTotalCost() {
        if(this.getDescription() === 'hours of Conference Room usage') {
            const freeConferenceHoursOfOtherServices = this.parentBillingItemsReference.getFreeConferenceHours() || 0;
            return Math.floor(Math.max((this.quantity - freeConferenceHoursOfOtherServices)* this.unitPrice * (1 + this.GSTRate), 0));
        }
        return Math.floor(this.quantity * this.unitPrice * (1 + this.GSTRate));
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

class BillingItems {
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


export class ReportFormat {

    generateBillingItems(monthlyUsageByClient: string, GSTRateList: Map<string, number>, ServicePriceList: Map<string, number>, freeConferenceHours: Map<string, number>) {
        const billingItems = new BillingItems();
        const lines: string[] = monthlyUsageByClient.split('\n');
        for (const line of lines) {
            const [countStr, ...descriptionArray] = line.split(' ');
            const noOfItems = parseInt(countStr);
            const descriptionOfItems = descriptionArray.join(' ');
            if (!GSTRateList.has(descriptionOfItems)) {
                throw new Error('Invalid usage type');
            }
            billingItems.addItemWithInfo(descriptionOfItems, noOfItems, (GSTRateList.get(descriptionOfItems) || 0), (ServicePriceList.get(descriptionOfItems) || 0), (freeConferenceHours.get(descriptionOfItems) || null), billingItems);
        }
        return billingItems;
    }

    generateReport(billingItems: BillingItems) {
        let invoiceReport:string = '';
        for (const billingItem of billingItems.getBillingItems()) {
            invoiceReport += `${billingItem.getQuantity()} ${billingItem.getDescription()}: ${billingItem.getTotalCost()}\n`;
        }
        invoiceReport += 'Total: ' + billingItems.getTotalCost() + '\n';
        invoiceReport += 'Total GST: ' + billingItems.getTotalGSTCost();
        return invoiceReport;
    }
}

export class InvoiceService {
    private monthlyUsageByClient: string;
    private gstRateList: Map<string, number>;
    private servicePrices: Map<string, number>;
    private freeConferenceHours: Map<string, number>;
    private reportFormat: ReportFormat;

    constructor(monthlyUsageByClient: string, reportFormat: ReportFormat, gstRateList: Map<string, number>, servicePrices: Map<string, number>, freeConferenceHours: Map<string, number>) {
        this.monthlyUsageByClient = monthlyUsageByClient;
        this.reportFormat = reportFormat;
        this.gstRateList = gstRateList;
        this.servicePrices = servicePrices;
        this.freeConferenceHours = freeConferenceHours;
    }

    generateInvoiceReport(): string {
        let invoiceReport:string = '';
        let billingItems = this.reportFormat.generateBillingItems(this.monthlyUsageByClient, this.gstRateList, this.servicePrices, this.freeConferenceHours);
        invoiceReport = this.reportFormat.generateReport(billingItems);

        return invoiceReport;
    }

}
