# serverless_mono
Backend services for aws

#### getProductsList - https://dzqnp79bsj.execute-api.us-west-2.amazonaws.com/dev/products
#### getProductsById - https://dzqnp79bsj.execute-api.us-west-2.amazonaws.com/dev/products/{productId}
#### Swagger Documentation - https://awal3zrmd2.execute-api.us-west-2.amazonaws.com/swagger
#### GET - https://awal3zrmd2.execute-api.us-west-2.amazonaws.com/swagger.json

1. Product Service Serverless.ts contains configuration for 2 lambda functions-> Done 
2. getProductsList lambda function returns a correct response code of 200 -> Done
3. getProductsById lambda functions return a correct response code of 200 using postman -> Done
4. Frontend application is integrated with Product Service (/products API) and products from Product Service are represented on Frontend -> Done

######  +1 - Async/await is used in lambda functions -> Done
######  +1 - ES6 modules are used for Product Service implementation-> Done
###### +1 - Custom Webpack/ESBuild/etc is manually configured for Product Service. Not applicable for preconfigured/built-in bundlers that come with templates, plugins, etc. -> Done
###### +1 (All languages) - SWAGGER documentation is created for Product Service-> Done
###### +1 (All languages) - Lambda handlers are covered by basic UNIT tests (NO infrastructure logic is needed to be covered)-> Done
###### +1 (All languages) - Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase. -> Done
###### +1 (All languages) - Main error scenarios are handled by API ("Product not found" error).-> Done

#### To run jest test cases
###### run inside product-service folder -> npm run test:local

#### To deploy API
###### run inside product-service folder -> sls deploy