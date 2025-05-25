# Cashflow API Documentation

A RESTful API for managing personal finances, including transactions, budgets, and categories.

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Profile](#profile)
- [Categories](#categories)
  - [Create Category](#create-category)
  - [Get All Categories](#get-all-categories)
  - [Get Category](#get-category)
  - [Update Category](#update-category)
  - [Delete Category](#delete-category)
- [Transactions](#transactions)
  - [Create Transaction](#create-transaction)
  - [Get All Transactions](#get-all-transactions)
  - [Get Transaction](#get-transaction)
  - [Get Transactions by Category ID](#get-transactions-by-category-id)
  - [Get Transactions by Category Name](#get-transactions-by-category-name)
  - [Get Transactions by Type](#get-transactions-by-type)
  - [Update Transaction](#update-transaction)
  - [Delete Transaction](#delete-transaction)
- [Budgets](#budgets)
  - [Create Budget](#create-budget)
  - [Get All Budgets](#get-all-budgets)
  - [Get Budget](#get-budget)
  - [Get Budgets by Category](#get-budgets-by-category)
  - [Update Budget](#update-budget)
  - [Delete Budget](#delete-budget)

## Authentication

### Register

Register a new user account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "User registered successfully",
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "john@example.com",
        "username": "johndoe"
      }
    }
    ```

### Login

Authenticate a user and receive a token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Login successful",
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "john@example.com",
        "username": "johndoe"
      }
    }
    ```

### Profile

Get the authenticated user's profile.

- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Profile accessed successfully",
      "user": {
        "id": "user_id",
        "username": "johndoe",
        "email": "john@example.com",
        "createdAt": "2023-06-15T10:30:00.000Z",
        "updatedAt": "2023-06-15T10:30:00.000Z"
      }
    }
    ```

## Categories

### Create Category

Create a new category.

- **URL**: `/api/categories`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Request Body**:
  ```json
  {
    "name": "Groceries",
    "description": "Food and household items"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Category created successfully",
      "data": {
        "id": "category_id",
        "userId": "user_id",
        "name": "Groceries",
        "description": "Food and household items",
        "createdAt": "2023-06-15T11:00:00.000Z",
        "updatedAt": "2023-06-15T11:00:00.000Z"
      }
    }
    ```

### Get All Categories

Get all categories for the authenticated user.

- **URL**: `/api/categories`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "count": 2,
      "data": [
        {
          "id": "category_id_1",
          "userId": "user_id",
          "name": "Groceries",
          "description": "Food and household items",
          "createdAt": "2023-06-15T11:00:00.000Z",
          "updatedAt": "2023-06-15T11:00:00.000Z"
        },
        {
          "id": "category_id_2",
          "userId": "user_id",
          "name": "Entertainment",
          "description": "Movies, games, etc.",
          "createdAt": "2023-06-15T11:30:00.000Z",
          "updatedAt": "2023-06-15T11:30:00.000Z"
        }
      ]
    }
    ```

### Get Category

Get a specific category by ID.

- **URL**: `/api/categories/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
        "id": "category_id",
        "userId": "user_id",
        "name": "Groceries",
        "description": "Food and household items",
        "createdAt": "2023-06-15T11:00:00.000Z",
        "updatedAt": "2023-06-15T11:00:00.000Z"
      }
    }
    ```

### Update Category

Update an existing category.

- **URL**: `/api/categories/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Request Body**:
  ```json
  {
    "name": "Food",
    "description": "Groceries and dining out"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Category updated successfully",
      "data": {
        "id": "category_id",
        "userId": "user_id",
        "name": "Food",
        "description": "Groceries and dining out",
        "createdAt": "2023-06-15T11:00:00.000Z",
        "updatedAt": "2023-06-15T12:00:00.000Z"
      }
    }
    ```

### Delete Category

Delete a category.

- **URL**: `/api/categories/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Category deleted successfully"
    }
    ```

## Transactions

### Create Transaction

Create a new transaction. If the category doesn't exist, it will be created automatically.

- **URL**: `/api/transactions`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Request Body**:
  ```json
  {
    "amount": 50,
    "description": "Weekly grocery shopping",
    "type": "WITHDRAWAL",
    "category": "Groceries"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Transaction created successfully",
      "data": {
        "id": "transaction_id",
        "userId": "user_id",
        "amount": 50,
        "description": "Weekly grocery shopping",
        "type": "WITHDRAWAL",
        "category": "category_id",
        "createdAt": "2023-06-15T14:00:00.000Z",
        "updatedAt": "2023-06-15T14:00:00.000Z",
        "categoryData": {
          "id": "category_id",
          "name": "Groceries",
          "description": "Auto-created for transaction: Weekly grocery shopping",
          "userId": "user_id",
          "createdAt": "2023-06-15T14:00:00.000Z",
          "updatedAt": "2023-06-15T14:00:00.000Z"
        }
      }
    }
    ```

### Get All Transactions

Get all transactions for the authenticated user.

- **URL**: `/api/transactions`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "count": 2,
      "data": [
        {
          "id": "transaction_id_1",
          "userId": "user_id",
          "amount": 50,
          "description": "Weekly grocery shopping",
          "type": "WITHDRAWAL",
          "category": "category_id_1",
          "createdAt": "2023-06-15T14:00:00.000Z",
          "updatedAt": "2023-06-15T14:00:00.000Z",
          "categoryData": {
            "id": "category_id_1",
            "name": "Groceries",
            "description": "Food and household items",
            "userId": "user_id",
            "createdAt": "2023-06-15T11:00:00.000Z",
            "updatedAt": "2023-06-15T11:00:00.000Z"
          }
        },
        {
          "id": "transaction_id_2",
          "userId": "user_id",
          "amount": 1200,
          "description": "Salary deposit",
          "type": "DEPOSIT",
          "category": "category_id_2",
          "createdAt": "2023-06-14T10:00:00.000Z",
          "updatedAt": "2023-06-14T10:00:00.000Z",
          "categoryData": {
            "id": "category_id_2",
            "name": "Income",
            "description": "Salary and other income",
            "userId": "user_id",
            "createdAt": "2023-06-14T10:00:00.000Z",
            "updatedAt": "2023-06-14T10:00:00.000Z"
          }
        }
      ]
    }
    ```

### Get Transaction

Get a specific transaction by ID.

- **URL**: `/api/transactions/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
        "id": "transaction_id",
        "userId": "user_id",
        "amount": 50,
        "description": "Weekly grocery shopping",
        "type": "WITHDRAWAL",
        "category": "category_id",
        "createdAt": "2023-06-15T14:00:00.000Z",
        "updatedAt": "2023-06-15T14:00:00.000Z",
        "categoryData": {
          "id": "category_id",
          "name": "Groceries",
          "description": "Food and household items",
          "userId": "user_id",
          "createdAt": "2023-06-15T11:00:00.000Z",
          "updatedAt": "2023-06-15T11:00:00.000Z"
        }
      }
    }
    ```

### Get Transactions by Category ID

Get transactions filtered by category ID.

- **URL**: `/api/transactions/category/:categoryId`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "count": 1,
      "categoryName": "Groceries",
      "data": [
        {
          "id": "transaction_id",
          "userId": "user_id",
          "amount": 50,
          "description": "Weekly grocery shopping",
          "type": "WITHDRAWAL",
          "category": "category_id",
          "createdAt": "2023-06-15T14:00:00.000Z",
          "updatedAt": "2023-06-15T14:00:00.000Z",
          "categoryData": {
            "id": "category_id",
            "name": "Groceries",
            "description": "Food and household items",
            "userId": "user_id",
            "createdAt": "2023-06-15T11:00:00.000Z",
            "updatedAt": "2023-06-15T11:00:00.000Z"
          }
        }
      ]
    }
    ```

### Get Transactions by Category Name

Get transactions filtered by category name (case insensitive).

- **URL**: `/api/transactions/category/name/:categoryName`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "count": 1,
      "categoryName": "Groceries",
      "categoryId": "category_id",
      "data": [
        {
          "id": "transaction_id",
          "userId": "user_id",
          "amount": 50,
          "description": "Weekly grocery shopping",
          "type": "WITHDRAWAL",
          "category": "category_id",
          "createdAt": "2023-06-15T14:00:00.000Z",
          "updatedAt": "2023-06-15T14:00:00.000Z",
          "categoryData": {
            "id": "category_id",
            "name": "Groceries",
            "description": "Food and household items",
            "userId": "user_id",
            "createdAt": "2023-06-15T11:00:00.000Z",
            "updatedAt": "2023-06-15T11:00:00.000Z"
          }
        }
      ]
    }
    ```

### Get Transactions by Type

Get transactions filtered by type (DEPOSIT or WITHDRAWAL).

- **URL**: `/api/transactions/type/:type`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Parameters**:
  - `type`: Either "DEPOSIT" or "WITHDRAWAL"
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "count": 1,
      "transactionType": "DEPOSIT",
      "data": [
        {
          "id": "transaction_id",
          "userId": "user_id",
          "amount": 1200,
          "description": "Salary deposit",
          "type": "DEPOSIT",
          "category": "category_id",
          "createdAt": "2023-06-14T10:00:00.000Z",
          "updatedAt": "2023-06-14T10:00:00.000Z",
          "categoryData": {
            "id": "category_id",
            "name": "Income",
            "description": "Salary and other income",
            "userId": "user_id",
            "createdAt": "2023-06-14T10:00:00.000Z",
            "updatedAt": "2023-06-14T10:00:00.000Z"
          }
        }
      ]
    }
    ```

### Update Transaction

Update an existing transaction. If a new category is specified and doesn't exist, it will be created automatically.

- **URL**: `/api/transactions/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Request Body**:
  ```json
  {
    "amount": 45,
    "description": "Updated grocery description",
    "category": "Food"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Transaction updated successfully",
      "data": {
        "id": "transaction_id",
        "userId": "user_id",
        "amount": 45,
        "description": "Updated grocery description",
        "type": "WITHDRAWAL",
        "category": "new_category_id",
        "createdAt": "2023-06-15T14:00:00.000Z",
        "updatedAt": "2023-06-15T15:00:00.000Z",
        "categoryData": {
          "id": "new_category_id",
          "name": "Food",
          "description": "Auto-created for transaction update: Updated grocery description",
          "userId": "user_id",
          "createdAt": "2023-06-15T15:00:00.000Z",
          "updatedAt": "2023-06-15T15:00:00.000Z"
        }
      }
    }
    ```

### Delete Transaction

Delete a transaction.

- **URL**: `/api/transactions/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Transaction deleted successfully"
    }
    ```

## Budgets

### Create Budget

Create a new budget for expense tracking or saving goals.

- **URL**: `/api/budgets`
- **Method**: `POST`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Request Body**:
  ```json
  {
    "amount": 0,
    "target": 120000,
    "description": "Monthly food budget",
    "type": "EXPENSE",
    "category": "makan",
    "endDate": "2023-12-31"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Budget created successfully",
      "data": {
        "id": "budget_id",
        "userId": "user_id",
        "amount": 0,
        "target": 120000,
        "description": "Monthly food budget",
        "type": "EXPENSE",
        "category": "category_id",
        "endDate": "2023-12-31T00:00:00.000Z",
        "createdAt": "2023-06-15T14:00:00.000Z",
        "updatedAt": "2023-06-15T14:00:00.000Z",
        "categoryData": {
          "id": "category_id",
          "name": "makan",
          "description": "Auto-created for budget: Monthly food budget",
          "userId": "user_id",
          "createdAt": "2023-06-15T14:00:00.000Z",
          "updatedAt": "2023-06-15T14:00:00.000Z"
        }
      }
    }
    ```

### Get All Budgets

Get all budgets for the authenticated user.

- **URL**: `/api/budgets`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "count": 2,
      "data": [
        {
          "id": "budget_id_1",
          "userId": "user_id",
          "amount": 0,
          "target": 120000,
          "description": "Monthly food budget",
          "type": "EXPENSE",
          "category": "category_id_1",
          "endDate": "2023-12-31T00:00:00.000Z",
          "createdAt": "2023-06-15T14:00:00.000Z",
          "updatedAt": "2023-06-15T14:00:00.000Z",
          "categoryData": {
            "id": "category_id_1",
            "name": "makan",
            "description": "Food expenses",
            "userId": "user_id",
            "createdAt": "2023-06-15T11:00:00.000Z",
            "updatedAt": "2023-06-15T11:00:00.000Z"
          }
        },
        {
          "id": "budget_id_2",
          "userId": "user_id",
          "amount": 500000,
          "target": 5000000,
          "description": "Vacation savings",
          "type": "SAVINGS",
          "category": "category_id_2",
          "endDate": null,
          "createdAt": "2023-06-14T10:00:00.000Z",
          "updatedAt": "2023-06-14T10:00:00.000Z",
          "categoryData": {
            "id": "category_id_2",
            "name": "travel",
            "description": "Travel expenses and savings",
            "userId": "user_id",
            "createdAt": "2023-06-14T10:00:00.000Z",
            "updatedAt": "2023-06-14T10:00:00.000Z"
          }
        }
      ]
    }
    ```

### Get Budget

Get a specific budget by ID.

- **URL**: `/api/budgets/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "id": "budget_id",
      "userId": "user_id",
      "amount": 45000,
      "target": 120000,
      "description": "Monthly food budget",
      "type": "EXPENSE",
      "category": "category_id",
      "endDate": "2023-12-31T00:00:00.000Z",
      "createdAt": "2023-06-15T14:00:00.000Z",
      "updatedAt": "2023-06-15T14:00:00.000Z",
      "categoryData": {
        "id": "category_id",
        "name": "makan",
        "description": "Food expenses",
        "userId": "user_id",
        "createdAt": "2023-06-15T11:00:00.000Z",
        "updatedAt": "2023-06-15T11:00:00.000Z"
      }
    }
    ```

### Get Budgets by Category

Get all budgets for a specific category.

- **URL**: `/api/budgets/category/:categoryId`
- **Method**: `GET`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "count": 1,
      "categoryName": "makan",
      "data": [
        {
          "id": "budget_id",
          "userId": "user_id",
          "amount": 45000,
          "target": 120000,
          "description": "Monthly food budget",
          "type": "EXPENSE",
          "category": "category_id",
          "endDate": "2023-12-31T00:00:00.000Z",
          "createdAt": "2023-06-15T14:00:00.000Z",
          "updatedAt": "2023-06-15T14:00:00.000Z",
          "categoryData": {
            "id": "category_id",
            "name": "makan",
            "description": "Food expenses",
            "userId": "user_id",
            "createdAt": "2023-06-15T11:00:00.000Z",
            "updatedAt": "2023-06-15T11:00:00.000Z"
          }
        }
      ]
    }
    ```

### Update Budget

Update an existing budget.

- **URL**: `/api/budgets/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Request Body**:
  ```json
  {
    "amount": 45000,
    "target": 150000,
    "description": "Updated food budget",
    "endDate": "2024-01-31"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Budget updated successfully",
      "data": {
        "id": "budget_id",
        "userId": "user_id",
        "amount": 45000,
        "target": 150000,
        "description": "Updated food budget",
        "type": "EXPENSE",
        "category": "category_id",
        "endDate": "2024-01-31T00:00:00.000Z",
        "createdAt": "2023-06-15T14:00:00.000Z",
        "updatedAt": "2023-06-15T16:00:00.000Z",
        "categoryData": {
          "id": "category_id",
          "name": "makan",
          "description": "Food expenses",
          "userId": "user_id",
          "createdAt": "2023-06-15T11:00:00.000Z",
          "updatedAt": "2023-06-15T11:00:00.000Z"
        }
      }
    }
    ```

### Delete Budget

Delete a budget.

- **URL**: `/api/budgets/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Budget deleted successfully"
    }
    ```

## Error Responses

All endpoints may return the following error responses:

- **401 Unauthorized**:

  ```json
  {
    "message": "Not authorized, no token"
  }
  ```

  or

  ```json
  {
    "message": "Not authorized, token failed"
  }
  ```

- **404 Not Found**:

  ```json
  {
    "message": "Resource not found"
  }
  ```

- **500 Server Error**:
  ```json
  {
    "message": "Server error"
  }
  ```
