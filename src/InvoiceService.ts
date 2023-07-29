class BillingItem {
    private quantity: number;
    private description: string;
    private GSTRate: number;
    private unitPrice: number;
    private totalCost: number;
    private totaGSTCost: number;


    constructor(description: string, quantity: number, GSTRate: number, price: any) {
        this.quantity = quantity;
        this.description = description;
        this.GSTRate = GSTRate;
        this.unitPrice = price;
        this.totalCost = this.calculateTotalCost();
        this.totaGSTCost = this.calculateTotalGSTCost();
    }

    private calculateTotalGSTCost() {
        return this.quantity * this.unitPrice * this.GSTRate;
    }

    private calculateTotalCost() {
        return this.quantity * this.unitPrice * (1 + this.GSTRate);
    }

    getQuantity() {
        return this.quantity;
    }

    getDescription() {
        return this.description;
    }

    getTotalCost() {
        return this.totalCost;
    }

    getTotalGSTCost() {
        return this.totaGSTCost;
    }

}

class BillingItems {
    private billingItemsList: BillingItem[] = [];

    add(descriptionOfBillingItem: string, unitsOfBillingItem: number, GSTRate: number, priceOfBillingItem: number) {
        this.billingItemsList.push(new BillingItem(descriptionOfBillingItem, unitsOfBillingItem, GSTRate, priceOfBillingItem));
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
}


export class ReportFormat {

    generateBillingItems(monthlyUsageByClient: string, GSTRateList: Map<string, number>, ServicePriceList: Map<string, number>) {
        const billingItems = new BillingItems();
        const lines: string[] = monthlyUsageByClient.split('\n');
        for (const line of lines) {
            const [countStr, ...descriptionArray] = line.split(' ');
            const noOfItems = parseInt(countStr);
            const descriptionOfItems = descriptionArray.join(' ');
            if (!GSTRateList.has(descriptionOfItems)) {
                throw new Error('Invalid usage type');
            }
            billingItems.add(descriptionOfItems, noOfItems, (GSTRateList.get(descriptionOfItems) || 0), (ServicePriceList.get(descriptionOfItems) || 0));
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
    private GSTRateList: Map<string, number>;
    private ServicePriceList: Map<string, number>;
    private FreeConferenceHours: Map<string, number>;

    constructor(monthlyUsageByClient: string, reportFormat: ReportFormat, GstRate: Map<string, number>, ServicePriceList: Map<string, number>, FreeConferenceHours: Map<string, number>) {
        this.monthlyUsageByClient = monthlyUsageByClient;
        this.GSTRateList = GstRate;
        this.ServicePriceList = ServicePriceList;
        this.FreeConferenceHours = FreeConferenceHours;
    }

    generateInvoiceReport(): string {
        let invoiceReport:string = '';
        let reportFormat = new ReportFormat();
        let billingItems = reportFormat.generateBillingItems(this.monthlyUsageByClient, this.GSTRateList, this.ServicePriceList);
        invoiceReport = reportFormat.generateReport(billingItems);

        return invoiceReport;
    }

}
