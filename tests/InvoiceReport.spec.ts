class InvoiceReport {
    generateBilling(numberOfOpenSeatings: number, GSTRate: number) {
        return 5000 * numberOfOpenSeatings * (1 + GSTRate);
    }
}

describe('Invoice Report Tests', function () {
    it('should generate a billing of `5000 * X * (1 + GSTRate)` when X number of Open Seatings are booked by a compnay.', function () {

        let numberOfOpenSeatings = 2;
        let GSTRate = 0.18;
        let expectedBilling = 5000 * numberOfOpenSeatings * (1 + GSTRate);

        // Act
        let actualBilling = new InvoiceReport().generateBilling(numberOfOpenSeatings, GSTRate);

        // Assert
        expect(actualBilling).toBe(expectedBilling);

    });


});