# Personal Automation

## Deployments

### Allowance Calculation

``` bash
gcloud functions deploy allowance-calculation \
  --gen2 \
  --region=us-central1 \
  --runtime=nodejs22 \
  --source=./ \
  --entry-point=calculateAllowance \
  --trigger-http
```
