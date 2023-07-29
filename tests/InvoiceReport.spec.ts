import {InvoiceReport} from "../src/InvoiceReport";
import {BillingFormat} from "../src/BillingFormat";

describe('Invoice Report Tests', function () {
    it('should generate a billing of `5000 * X * (1 + GSTRate)` when X number of Open Seatings are booked by a compnay.', function () {

        let monthlyUsageByCompany = "2 Open Seats"
        let GSTRate = 0.18;
        let expectedBillingReport = monthlyUsageByCompany + ' : ' + `${5000 * 2 * (1 + GSTRate)}`;
        let billingFormat = new BillingFormat();

        // Act

        let invoiceReport = new InvoiceReport(monthlyUsageByCompany, billingFormat, GSTRate);
        let actualBilling = invoiceReport.generateBillingReport();

        // Assert
        expect(actualBilling).toBe(expectedBillingReport);

    });


});