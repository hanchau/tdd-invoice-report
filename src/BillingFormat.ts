export class BillingFormat {

    parse(companyUsageFormat: string) {
        const outputUsageMap: { [key: string]: number } = {};
        const listOfCompanyUsageItems = companyUsageFormat.split('\n');
        for (let companyUsageItem of listOfCompanyUsageItems) {
            const [quantityOfItemStr, type] = companyUsageItem.split(' ');
            const quantityOfItem = parseInt(quantityOfItemStr);
            if (!isNaN(quantityOfItem)) {
                outputUsageMap[type + ' Seats'] = quantityOfItem;
            }
        }
        return outputUsageMap;
    }
}
