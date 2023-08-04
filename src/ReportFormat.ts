import {BillingItems} from "./BillingItems";

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
        let invoiceReport: string = '';
        for (const billingItem of billingItems.getBillingItems()) {
            invoiceReport += `${billingItem.getQuantity()} ${billingItem.getDescription()}: ${billingItem.getTotalCost()}\n`;
        }
        invoiceReport += 'Total: ' + billingItems.getTotalCost() + '\n';
        invoiceReport += 'Total GST: ' + billingItems.getTotalGSTCost();
        return invoiceReport;
    }
}