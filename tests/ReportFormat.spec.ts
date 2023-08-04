import { ReportFormat } from '../src/ReportFormat';
import {BillingItems} from "../src/BillingItems";

describe('Billing Items test cases', function () {
    it('should add an billing item with null/0 info if the Lists of Data are not available', function () {
        let servicesOffered = ["Open Seats", "Cabin Seats", "hours of Conference Room usage", "Meals"];
        let gstRates: Map<string, number> = new Map([]);
        let servicePrices: Map<string, number>  = new Map([]);
        let freeConferenceHours: Map<string, number>  = new Map([]);

        let monthlyUsageByClient = "2 Open Seats";
        let expectedBillingItems = new BillingItems()
        expectedBillingItems.addItemWithInfo("Open Seats", 2, 0, 0, null, expectedBillingItems);

        // Act
        let actualBillingItems = new ReportFormat().generateBillingItems(monthlyUsageByClient, servicesOffered, gstRates, servicePrices, freeConferenceHours);


        // Assert
        expect(actualBillingItems).toStrictEqual(expectedBillingItems);
    });
});