Basic Assumptions
`````````````````
1. GST Rates, Service Prices, Free Conference Hours for each service are given in a list.
2. BillingItem is one entity which has all the details of the service availed by the customer.
3. BillingItems holds all the billing items and generates aggregates like total amount, total tax, total discount, total payable amount.
4. InvoiceService is the main service which generates the invoice for the customer/client-company based on the usage input.


Instructions to Run Code
````````````````````````

1. Clone the repository. (git@github.com:hanchau/tdd-invoice-report.git)
2. Run `npm install` to install all the dependencies.
3. Run `npm run test` to run the test cases.


Tree Structure
``````````````
├── README.md
├── Readme.txt
├── jest.config.js
├── package-lock.json
├── package.json
├── src
│ ├──
│ └── InvoiceService.ts
├── tests
│ └── InvoiceReport.spec.ts
└── tsconfig.json

