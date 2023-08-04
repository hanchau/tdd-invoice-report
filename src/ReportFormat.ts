import {BillingItems} from "./BillingItems";

export class ReportFormat {

    generateBillingItems(monthlyUsageByClient: string, servicesOffered: string[], gstRates: Map<string, number>, servicePrices: Map<string, number>, freeConferenceHours: Map<string, number>) {
        const billingItems = new BillingItems();
        const lines: string[] = monthlyUsageByClient.split('\n');
        for (const line of lines) {
            const [countStr, ...descriptionArray] = line.split(' ');
            const noOfItems = parseInt(countStr);
            const descriptionOfItem = descriptionArray.join(' ');
            if (!servicesOffered.includes(descriptionOfItem)) {
                throw new Error('Invalid usage type');
            }
            billingItems.addItemWithInfo(descriptionOfItem, noOfItems, (gstRates.get(descriptionOfItem) || 0), (servicePrices.get(descriptionOfItem) || 0), (freeConferenceHours.get(descriptionOfItem) || null), billingItems);
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