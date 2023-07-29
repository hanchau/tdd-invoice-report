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

    private generateChargeForConferenceRoomUsage(numberOfConferenceHours: number) {
        let numberOfCabinSeatings = this.monthlyUsageByCompanyMap['Cabin Seats'];
        let numberOfOpenSeatings = this.monthlyUsageByCompanyMap['Open Seats'];
        let freeConferenceRoomUsageLimit = + numberOfOpenSeatings * 5 + numberOfCabinSeatings * 10;
        return Math.max(numberOfConferenceHours - freeConferenceRoomUsageLimit, 0) * 200;
    }

    private generateGSTForConferenceRoomUsage(numberOfConferenceHours: number) {
        let numberOfCabinSeatings = this.monthlyUsageByCompanyMap['Cabin Seats'];
        let numberOfOpenSeatings = this.monthlyUsageByCompanyMap['Open Seats'];
        let freeConferenceRoomUsageLimit = + numberOfOpenSeatings * 5 + numberOfCabinSeatings * 10;
        return Math.max(numberOfConferenceHours - freeConferenceRoomUsageLimit, 0) * 200 * this.GSTRate;
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
                billingReport += `${numberOfOpenSeatings} ${key}: ${charge + gstCharge}`;
                totalBilling += charge + gstCharge;
                totalGST += gstCharge;
            }
            else if (key === 'Cabin Seats'){
                let numberOfCabinSeatings:number = this.monthlyUsageByCompanyMap[key];
                let charge:number = this.generateChargeForCabinSeatings(numberOfCabinSeatings);
                let gstCharge: number = this.generageGSTForCabinSeatings(numberOfCabinSeatings);
                billingReport += `${numberOfCabinSeatings} ${key}: ${charge + gstCharge}`;
                totalBilling += charge + gstCharge;
                totalGST += gstCharge;
            }
            else if (key === 'hours of Conference Room usage') {
                let numberOfConferenceHours:number = this.monthlyUsageByCompanyMap[key];
                let charge:number = this.generateChargeForConferenceRoomUsage(numberOfConferenceHours);
                let gstCharge: number = this.generateGSTForConferenceRoomUsage(numberOfConferenceHours);
                billingReport += `${numberOfConferenceHours} ${key}: ${charge + gstCharge}`;
                totalBilling += charge + gstCharge;
                totalGST += gstCharge;
            }
            else{
                throw new Error('Invalid usage type');
            }
            index++;
        }
        billingReport += `\nTotal: ${totalBilling}`;
        billingReport += `\nTotal GST: ${totalGST}`;

        return billingReport;
    }

}