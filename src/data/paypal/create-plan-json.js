export const createPlanJson = {
  "product_id": "PROD-XXCD1234QWER65782",
  "name": "Video Streaming Service Plan",
  "description": "Video Streaming Service basic plan",
  "status": "ACTIVE",
  "billing_cycles": [
    {
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1
      },
      "tenure_type": "TRIAL",
      "sequence": 1,
      "total_cycles": 1,
      "pricing_scheme": {
        "fixed_price": {
          "value": "10",
          "currency_code": "USD"
        }
      }
    },
    {
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1
      },
      "tenure_type": "REGULAR",
      "sequence": 2,
      "total_cycles": 12,
      "pricing_scheme": {
        "fixed_price": {
          "value": "100",
          "currency_code": "USD"
        }
      }
    }
  ],
  "payment_preferences": {
    "auto_bill_outstanding": true,
    "setup_fee": {
      "value": "10",
      "currency_code": "USD"
    },
    "setup_fee_failure_action": "CONTINUE",
    "payment_failure_threshold": 3
  },
  "taxes": {
    "percentage": "10",
    "inclusive": false
  }
};