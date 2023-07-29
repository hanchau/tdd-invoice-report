import {BillingFormat} from "./BillingFormat";

export class InvoiceReport {
    private monthlyUsageByCompany: string;
    private billingFormat: BillingFormat;
    private GSTRate: number;
    private monthlyUsageByCompanyMap: { [key: string]: number } = {};

    // create  a map in typescript
    // https://stackoverflow.com/questions/14810506/map-in-typescript
    constructor(monthlyUsageByCompany: string, inputParser: any, GstRate: any) {
        this.monthlyUsageByCompany = monthlyUsageByCompany;
        this.billingFormat = inputParser;
        this.GSTRate = GstRate;
        this.monthlyUsageByCompanyMap = this.billingFormat.parse(monthlyUsageByCompany);
    }

    generageBillingForOpenSeatings(numberOfOpenSeatings: number) {
        return 5000 * numberOfOpenSeatings * (1 + this.GSTRate);
    }

    generateBillingReport() {
        let billingReport = '';
        for (let key in this.monthlyUsageByCompanyMap) {
            let numberOfOpenSeatings = this.monthlyUsageByCompanyMap[key];
            let billing = this.generageBillingForOpenSeatings(numberOfOpenSeatings);
            billingReport += `${numberOfOpenSeatings} Open Seats : ${billing}`;
        }
        return billingReport;
    }

}