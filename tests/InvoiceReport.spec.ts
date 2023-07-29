import {InvoiceReport} from "../src/InvoiceReport";
import {BillingFormat} from "../src/BillingFormat";

describe('Invoice Report Tests', function () {

    it('should throw an error when invalid input is given', function () {
        let monthlyUsageByCompany = "2 Balcony Seats\n4 Open Seats\n3 Cabin Seats"
        let GSTRate = 0.18;
        let billingFormat = new BillingFormat();

        // Assert
        expect(()=> {
            new InvoiceReport(monthlyUsageByCompany, billingFormat, GSTRate).generateBillingReport()
        }).toThrowError('Invalid usage type');
    });

    it('should generate a billing of `5000 * X * (1 + GSTRate)` ' +
        'when X number of Open Seatings are booked by a client company.', function () {
        let monthlyUsageByCompany = "2 Open Seats"
        let GSTRate = 0.18;
        let expectedBillingReport = monthlyUsageByCompany + ': ' + `${5000 * 2 * (1 + GSTRate)}`
                                            + '\nTotal: ' + `${5000 * 2 * (1 + GSTRate)}`
                                            + '\nTotal GST: ' + `${5000 * 2 * GSTRate}`;

        let billingFormat = new BillingFormat();

        // Act
        let invoiceReport = new InvoiceReport(monthlyUsageByCompany, billingFormat, GSTRate);
        let actualBillingReport = invoiceReport.generateBillingReport();

        // Assert
        expect(actualBillingReport).toBe(expectedBillingReport);
    });

    it('should generate a billing of `10000 * X * (1 + GSTRate)` ' +
        'when X number of Cabin Seatings are booked by a client company.', function () {
        let monthlyUsageByCompany = "3 Cabin Seats"
        let GSTRate = 0.18;
        let expectedBillingReport = monthlyUsageByCompany + ': ' + `${10000 * 3 * (1 + GSTRate)}`
                                            + '\nTotal: ' + `${10000 * 3 * (1 + GSTRate)}`
                                            + '\nTotal GST: ' + `${10000 * 3 * GSTRate}`;

        let billingFormat = new BillingFormat();

        // Act
        let invoiceReport = new InvoiceReport(monthlyUsageByCompany, billingFormat, GSTRate);
        let actualBillingReport = invoiceReport.generateBillingReport();

        // Assert
        expect(actualBillingReport).toBe(expectedBillingReport);
    });


    it('should generate a combined billing report for Open Seatings and Cabin Seatings', function () {
        let monthlyUsageByCompany = "2 Open Seats\n3 Cabin Seats"
        let GSTRate = 0.18;
        let expectedBillingReport = '2 Open Seats: 11800'
                                        + '\n3 Cabin Seats: 35400'
                                        + '\nTotal: ' + `${10000 * 3 * (1 + GSTRate) + 5000 * 2 * (1 + GSTRate)}`
                                        + '\nTotal GST: ' + `${10000 * 3 * GSTRate + 5000 * 2 * GSTRate}`;

        let billingFormat = new BillingFormat();

        // Act
        let invoiceReport = new InvoiceReport(monthlyUsageByCompany, billingFormat, GSTRate);
        let actualBillingReport = invoiceReport.generateBillingReport();

        // Assert
        expect(actualBillingReport).toBe(expectedBillingReport);
    });


    it('should generate a combined billing report for Cabin Seating and Open Seating.', function () {
        let monthlyUsageByCompany = "3 Cabin Seats\n2 Open Seats"
        let GSTRate = 0.18;
        let expectedBillingReport = '3 Cabin Seats: 35400'
                                        + '\n2 Open Seats: 11800'
                                        + '\nTotal: ' + `${10000 * 3 * (1 + GSTRate) + 5000 * 2 * (1 + GSTRate)}`
                                        + '\nTotal GST: ' + `${10000 * 3 * GSTRate + 5000 * 2 * GSTRate}`;
        let billingFormat = new BillingFormat();

        // Act
        let invoiceReport = new InvoiceReport(monthlyUsageByCompany, billingFormat, GSTRate);
        let actualBillingReport = invoiceReport.generateBillingReport();

        // Assert
        expect(actualBillingReport).toBe(expectedBillingReport);
    });


    it('should generate a combined billing report for Cabin Seating ' +
        'and Open Seating and ' +
        'Extra Hours of Conference Room Usage.', function () {
        let monthlyUsageByCompany = "2 Open Seats\n3 Cabin Seats\n45 hours of Conference Room usage";
        let GSTRate = 0.18;
        let expectedBillingReport = '2 Open Seats: 11800'
                                        + '\n3 Cabin Seats: 35400'
                                        + `\n45 hours of Conference Room usage: ${5 * 200 + (5 * 200 * GSTRate)}` // 5 hours of extra Conference Room usage
                                        + '\nTotal: ' + `${10000 * 3 * (1 + GSTRate) + 5000 * 2 * (1 + GSTRate) + (5 * 200) + (5 * 200 * GSTRate)}`
                                        + '\nTotal GST: ' + `${(10000 * 3 * GSTRate) + (5000 * 2 * GSTRate) + (5 * 200 * GSTRate)}`;
        let billingFormat = new BillingFormat();

        // Act
        let invoiceReport = new InvoiceReport(monthlyUsageByCompany, billingFormat, GSTRate);
        let actualBillingReport = invoiceReport.generateBillingReport();

        // Assert
        expect(actualBillingReport).toBe(expectedBillingReport);
    });

});

