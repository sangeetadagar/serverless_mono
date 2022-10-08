// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "product-service",
    "version": "1"
  },
  "paths": {
    "/products": {
      "get": {
        "summary": "getProductsList",
        "description": "",
        "operationId": "getProductsList.get.products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "Successful API response",
            "schema": {
              "$ref": "#/definitions/ProductList"
            }
          }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "summary": "getProductById",
        "description": "",
        "operationId": "getProductById.get.products/{productId}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful API response",
            "schema": {
              "$ref": "#/definitions/Product"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Product": {
      "properties": {
        "\"id\"": {
          "title": "Product.\"id\"",
          "type": "number"
        },
        "\"title\"": {
          "title": "Product.\"title\"",
          "type": "string"
        },
        "\"description\"": {
          "title": "Product.\"description\"",
          "type": "string"
        },
        "\"price\"": {
          "title": "Product.\"price\"",
          "type": "number"
        }
      },
      "required": [
        "\"id\"",
        "\"title\"",
        "\"description\"",
        "\"price\""
      ],
      "additionalProperties": false,
      "title": "Product",
      "type": "object"
    },
    "ProductList": {
      "items": {
        "$ref": "#/definitions/Product"
      },
      "title": "ProductList",
      "type": "array"
    }
  },
  "securityDefinitions": {}
};