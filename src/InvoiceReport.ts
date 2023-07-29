export class BillingFormat {

    parse(inputString: string) {
        const resultMap: { [key: string]: number } = {};

        const lines: string[] = inputString.split('\n');
        for (const line of lines) {
            const [countStr, ...descriptionArray] = line.split(' ');
            const count = parseInt(countStr);
            if (!isNaN(count)) {
                const description = descriptionArray.join(' ');
                resultMap[description] = count;
            }
        }
        return resultMap
    }
}

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

        for (let descriptionOfBillingItem in this.monthlyUsageByCompanyMap) {
            if(index > 0 ){
                billingReport += '\n';
            }
            if (descriptionOfBillingItem === 'Open Seats') {
                let numberOfOpenSeatings:number = this.monthlyUsageByCompanyMap[descriptionOfBillingItem];
                let chargeForUnitsOfBillingItem:number = this.generateChargeForOpenSeatings(numberOfOpenSeatings);
                let gstChargeForUnitsOfBillingItem: number = this.generageGSTForOpenSeatings(numberOfOpenSeatings);
                billingReport += `${numberOfOpenSeatings} ${descriptionOfBillingItem}: ${chargeForUnitsOfBillingItem + gstChargeForUnitsOfBillingItem}`;
                totalBilling += chargeForUnitsOfBillingItem + gstChargeForUnitsOfBillingItem;
                totalGST += gstChargeForUnitsOfBillingItem;
            }
            else if (descriptionOfBillingItem === 'Cabin Seats'){
                let numberOfCabinSeatings:number = this.monthlyUsageByCompanyMap[descriptionOfBillingItem];
                let chargeForUnitsOfBillingItem:number = this.generateChargeForCabinSeatings(numberOfCabinSeatings);
                let gstChargeForUnitsOfBillingItem: number = this.generageGSTForCabinSeatings(numberOfCabinSeatings);
                billingReport += `${numberOfCabinSeatings} ${descriptionOfBillingItem}: ${chargeForUnitsOfBillingItem + gstChargeForUnitsOfBillingItem}`;
                totalBilling += chargeForUnitsOfBillingItem + gstChargeForUnitsOfBillingItem;
                totalGST += gstChargeForUnitsOfBillingItem;
            }
            else if (descriptionOfBillingItem === 'hours of Conference Room usage') {
                let numberOfConferenceHours:number = this.monthlyUsageByCompanyMap[descriptionOfBillingItem];
                let chargeForUnitsOfBillingItem:number = this.generateChargeForConferenceRoomUsage(numberOfConferenceHours);
                let gstChargeForUnitsOfBillingItem: number = this.generateGSTForConferenceRoomUsage(numberOfConferenceHours);
                billingReport += `${numberOfConferenceHours} ${descriptionOfBillingItem}: ${chargeForUnitsOfBillingItem + gstChargeForUnitsOfBillingItem}`;
                totalBilling += chargeForUnitsOfBillingItem + gstChargeForUnitsOfBillingItem;
                totalGST += gstChargeForUnitsOfBillingItem;
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