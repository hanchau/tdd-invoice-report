export class BillingFormat {

    parse(companyUsageFormat: string) {
        const outputUsageMap: { [key: string]: number } = {};
        const [countStr, type] = companyUsageFormat.split(' ');
        const quantityOfItem = parseInt(countStr);
        if (!isNaN(quantityOfItem)) {
            outputUsageMap[type + ' ' + type.slice(-1) === 's' ? 'Seats' : 'Seat'] = quantityOfItem;
        }
        return outputUsageMap;
    }
}