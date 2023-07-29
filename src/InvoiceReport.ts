import {BillingFormat} from "./BillingFormat";

export class InvoiceReport {
    private monthlyUsageByCompany: string;
    private billingFormat: BillingFormat;
    private GSTRate: number;
    private monthlyUsageByCompanyMap: { [key: string]: number } = {};

    constructor(monthlyUsageByCompany: string, inputParser: any, GstRate: any) {
        this.monthlyUsageByCompany = monthlyUsageByCompany;
        this.billingFormat = inputParser;
        this.GSTRate = GstRate;
        this.monthlyUsageByCompanyMap = this.billingFormat.parse(monthlyUsageByCompany);
    }

    generateChargeForOpenSeatings(numberOfOpenSeatings: number) {
        return 5000 * numberOfOpenSeatings;
    }

    generageGSTForOpenSeatings(numberOfOpenSeatings: number) {
        return 5000 * numberOfOpenSeatings * this.GSTRate;
    }

    private generateChargeForCabinSeatings(numberOfCabinSeatings: number) {
        return 10000 * numberOfCabinSeatings;
    }

    private generageGSTForCabinSeatings(numberOfCabinSeatings: number) {
        return 10000 * numberOfCabinSeatings * this.GSTRate;
    }

    generateBillingReport(): string {
        let billingReport:string = '';
        let totalBilling:number = 0;
        let totalGST:number = 0;
        let index:number = 0;

        for (let key in this.monthlyUsageByCompanyMap) {
            if(index > 0 ){
                billingReport += '\n';
            }
            if (key === 'Open Seats') {
                let numberOfOpenSeatings:number = this.monthlyUsageByCompanyMap[key];
                let charge:number = this.generateChargeForOpenSeatings(numberOfOpenSeatings);
                let gstCharge: number = this.generageGSTForOpenSeatings(numberOfOpenSeatings);
                billingReport += `${numberOfOpenSeatings} Open Seats: ${charge + gstCharge}`;
                totalBilling += charge + gstCharge;
                totalGST += gstCharge;
            }
            else{
                let numberOfCabinSeatings:number = this.monthlyUsageByCompanyMap[key];
                let charge:number = this.generateChargeForCabinSeatings(numberOfCabinSeatings);
                let gstCharge: number = this.generageGSTForCabinSeatings(numberOfCabinSeatings);
                billingReport += `${numberOfCabinSeatings} Cabin Seats: ${charge + gstCharge}`;
                totalBilling += charge + gstCharge;
                totalGST += gstCharge;
            }
            index++;
        }
        billingReport += `\nTotal: ${totalBilling}`;
        billingReport += `\nTotal GST: ${totalGST}`;

        return billingReport;
    }

}