export class BillingFormat {

    parse(companyUsageFormat: string) {
        const outputUsageMap: { [key: string]: number } = {};
        const [countStr, type] = companyUsageFormat.split(' ');
        const quantityOfItem = parseInt(countStr);
        if (!isNaN(quantityOfItem)) {
            outputUsageMap[type + (quantityOfItem !== 1 ? ' Seats' : ' Seat')] = quantityOfItem;
        }
        return outputUsageMap;
    }
}
