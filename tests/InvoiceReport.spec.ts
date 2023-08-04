import {InvoiceService} from "../src/InvoiceService";
import {ReportFormat} from "../src/ReportFormat";

describe('Invoice Report Tests', function () {
    let gstRates: Map<string, number>;
    let servicePrices: Map<string, number>;
    let reportFormat: ReportFormat;
    let freeConferenceHours: Map<string, number>;
    let servicesOffered = ["Open Seats", "Cabin Seats", "hours of Conference Room usage", "Meals"];

    beforeEach(function () {
        gstRates = new Map([
            ["Open Seats", 0.18],
            ["Cabin Seats", 0.18],
            ["hours of Conference Room usage", 0.18],
            ["Meals", 0.12]
        ]);
        servicePrices = new Map([
            ["Open Seats", 5000],
            ["Cabin Seats", 10000],
            ["hours of Conference Room usage", 200],
            ["Meals", 100]
        ]);
        freeConferenceHours = new Map([
            ["Open Seats", 5],
            ["Cabin Seats", 10],
        ]);

        reportFormat = new ReportFormat();

    });


    it('should throw an error when invalid input is given', function () {
        let monthlyUsageByClient = "2 Balcony Seats\n4 Open Seats\n3 Cabin Seats"

        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);
        // Assert
        expect(()=> {
            invoiceService.generateInvoiceReport()
        }).toThrowError('Invalid usage type');
    });

    it('should generate a billing of `5000 * X * (1 + GSTRate)` ' +
        'when X number of Open Seatings are booked by a client company.', function () {
        let GSTRate = gstRates.get('Open Seats') || 0;
        let PriceOfOpenSeating = servicePrices.get('Open Seats') || 0;
        let numberOfSeatings = 2;
        let totalBilling = PriceOfOpenSeating * numberOfSeatings * (1 + GSTRate);
        let totalGST = PriceOfOpenSeating * numberOfSeatings * GSTRate;

        let expectedInvoiceReport = '2 Open Seats: ' + `${totalBilling}`
                                            + '\nTotal: ' + `${totalBilling}`
                                            + '\nTotal GST: ' + `${totalGST}`;

        // Act
        let monthlyUsageByClient = "2 Open Seats";
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        // Assert
        expect(invoiceService.generateInvoiceReport()).toBe(expectedInvoiceReport);
    });


    it('should generate a billing of `10000 * X * (1 + GSTRate)` ' +
        'when X number of Cabin Seatings are booked by a client company.', function () {
        let GSTRate = gstRates.get('Cabin Seats') || 0;
        let PriceOfCabinSeating = servicePrices.get('Cabin Seats') || 0;
        let numberOfSeatings = 3;
        let totalBilling = PriceOfCabinSeating * numberOfSeatings * (1 + GSTRate);
        let totalGST = PriceOfCabinSeating * numberOfSeatings * GSTRate;

        let expectedInvoiceReport = '3 Cabin Seats: ' + `${totalBilling}`
            + '\nTotal: ' + `${totalBilling}`
            + '\nTotal GST: ' + `${totalGST}`;

        // Act
        let monthlyUsageByClient = "3 Cabin Seats";
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        // Assert
        expect(invoiceService.generateInvoiceReport()).toBe(expectedInvoiceReport);
    });


    it('should generate a combined billing report for Open Seatings and Cabin Seatings', function () {
        let monthlyUsageByClient = "2 Open Seats\n3 Cabin Seats"
        let GSTRate = gstRates.get('Open Seats') || 0;
        let expectedInvoiceReport = '2 Open Seats: 11800'
                                        + '\n3 Cabin Seats: 35400'
                                        + '\nTotal: ' + `${10000 * 3 * (1 + GSTRate) + 5000 * 2 * (1 + GSTRate)}`
                                        + '\nTotal GST: ' + `${10000 * 3 * GSTRate + 5000 * 2 * GSTRate}`;

        // Act
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        // Assert
        expect(invoiceService.generateInvoiceReport()).toBe(expectedInvoiceReport);
    });


    it('should generate a combined billing report for Cabin Seating and Open Seating.', function () {
        let monthlyUsageByClient = "3 Cabin Seats\n2 Open Seats"
        let GSTRate = 0.18;
        let expectedInvoiceReport = '3 Cabin Seats: 35400'
                                        + '\n2 Open Seats: 11800'
                                        + '\nTotal: ' + `${10000 * 3 * (1 + GSTRate) + 5000 * 2 * (1 + GSTRate)}`
                                        + '\nTotal GST: ' + `${10000 * 3 * GSTRate + 5000 * 2 * GSTRate}`;

        // Act
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        // Assert
        expect(invoiceService.generateInvoiceReport()).toBe(expectedInvoiceReport);
    });


    it('should generate a combined billing report for Cabin Seating ' +
        'and Open Seating and ' +
        'Extra Hours of Conference Room Usage.', function () {
        let monthlyUsageByClient = "2 Open Seats\n3 Cabin Seats\n45 hours of Conference Room usage";
        let GSTRate = 0.18;
        let expectedInvoiceReport = '2 Open Seats: 11800'
                                        + '\n3 Cabin Seats: 35400'
                                        + `\n45 hours of Conference Room usage: ${5 * 200 + (5 * 200 * GSTRate)}` // 5 hours of extra Conference Room usage
                                        + '\nTotal: ' + `${10000 * 3 * (1 + GSTRate) + 5000 * 2 * (1 + GSTRate) + (5 * 200) + (5 * 200 * GSTRate)}`
                                        + '\nTotal GST: ' + `${(10000 * 3 * GSTRate) + (5000 * 2 * GSTRate) + (5 * 200 * GSTRate)}`;

        // Act
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        let generateInvoiceReport = invoiceService.generateInvoiceReport();
        // Assert
        expect(generateInvoiceReport).toBe(expectedInvoiceReport);
    });


    it('Acceptance test 1', function () {
        let monthlyUsageByClient = "2 Open Seats\n3 Cabin Seats\n35 hours of Conference Room usage\n5 Meals";
        let GSTRate = 0.18;
        let expectedInvoiceReport = '2 Open Seats: 11800'
            + '\n3 Cabin Seats: 35400'
            + `\n35 hours of Conference Room usage: 0`
            + `\n5 Meals: 560`
            + '\nTotal: 47760'
            + '\nTotal GST: 7260';

        // Act
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        let generateInvoiceReport = invoiceService.generateInvoiceReport();
        // Assert
        expect(generateInvoiceReport).toBe(expectedInvoiceReport);
    });


    it('Acceptance test 2', function () {
        let monthlyUsageByClient = "1 Cabin Seats\n50 hours of Conference Room usage\n10 Meals";
        let GSTRate = 0.18;
        let expectedInvoiceReport = '1 Cabin Seats: 11800'
            + `\n50 hours of Conference Room usage: 9440`
            + `\n10 Meals: 1120`
            + '\nTotal: 22360'
            + '\nTotal GST: 3360';

        // Act
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        let generateInvoiceReport = invoiceService.generateInvoiceReport();
        // Assert
        expect(generateInvoiceReport).toBe(expectedInvoiceReport);
    });


    it('Acceptance test 3', function () {
        let monthlyUsageByClient = "2 Open Seats\n30 Meals";
        let GSTRate = 0.18;
        let expectedInvoiceReport = '2 Open Seats: 11800'
            + `\n30 Meals: 3360`
            + '\nTotal: 15160'
            + '\nTotal GST: 2160';

        // Act
        let invoiceService = new InvoiceService(monthlyUsageByClient, servicesOffered, reportFormat, gstRates, servicePrices, freeConferenceHours);

        let generateInvoiceReport = invoiceService.generateInvoiceReport();
        // Assert
        expect(generateInvoiceReport).toBe(expectedInvoiceReport);
    });
});

