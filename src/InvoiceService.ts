import {ReportFormat} from "./ReportFormat";


export class InvoiceService {
    private monthlyUsageByClient: string;
    private servicesOffered: string[];
    private gstRateList: Map<string, number>;
    private servicePrices: Map<string, number>;
    private freeConferenceHours: Map<string, number>;
    private reportFormat: ReportFormat;

    constructor(monthlyUsageByClient: string, servicesOffered: string[], reportFormat: ReportFormat, gstRateList: Map<string, number>, servicePrices: Map<string, number>, freeConferenceHours: Map<string, number>) {
        this.monthlyUsageByClient = monthlyUsageByClient;
        this.servicesOffered = servicesOffered;
        this.reportFormat = reportFormat;
        this.gstRateList = gstRateList;
        this.servicePrices = servicePrices;
        this.freeConferenceHours = freeConferenceHours;

    }

    generateInvoiceReport(): string {
        let invoiceReport:string = '';
        let billingItems = this.reportFormat.generateBillingItems(this.monthlyUsageByClient, this.servicesOffered, this.gstRateList, this.servicePrices, this.freeConferenceHours);
        invoiceReport = this.reportFormat.generateReport(billingItems);

        return invoiceReport;
    }

}
