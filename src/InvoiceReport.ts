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

    generageBillingForOpenSeatings(numberOfOpenSeatings: number) {
        return 5000 * numberOfOpenSeatings * (1 + this.GSTRate);
    }

    generateBillingForCabinSeatings(numberOfCabinSeatings: number) {
        let billing = 10000 * numberOfCabinSeatings * (1 + this.GSTRate);
        return billing;
    }

    generateBillingReport(): string {
        let billingReport:string = '';
        let index:number = 0;
        for (let key in this.monthlyUsageByCompanyMap) {
            if(index > 0 ){
                billingReport += '\n';
            }
            if (key === 'Open Seats') {
                let numberOfOpenSeatings = this.monthlyUsageByCompanyMap[key];
                let billing = this.generageBillingForOpenSeatings(numberOfOpenSeatings);
                billingReport += `${numberOfOpenSeatings} Open Seats : ${billing}`;
            }
            else{
                let numberOfCabinSeatings = this.monthlyUsageByCompanyMap[key];
                let billing = this.generateBillingForCabinSeatings(numberOfCabinSeatings);
                billingReport += `${numberOfCabinSeatings} Cabin Seats : ${billing}`;
            }

            index++;
        }
        return billingReport;
    }

}