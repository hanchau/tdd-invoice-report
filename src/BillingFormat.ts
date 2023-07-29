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

// console.log(new BillingFormat().parse('10 Open Seats\n20 Cabin Seats\n30 hours of Conference Room usage'));