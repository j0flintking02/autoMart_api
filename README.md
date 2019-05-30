# autoMart_api
A web application that allows one to quickly, affordably and safely transact in car dealership

[![Build Status](https://travis-ci.org/j0flintking02/autoMart_api.svg?branch=develop)](https://travis-ci.org/j0flintking02/autoMart_api)
[![Coverage Status](https://coveralls.io/repos/github/j0flintking02/autoMart_api/badge.svg?branch=develop)](https://coveralls.io/github/j0flintking02/autoMart_api?branch=develop)

**View App:** [AutoMart](https://automart2019.herokuapp.com/)


## Features

### Users
- Signup and Login
- User can view a specific car
- get all available cars
- get all cars of a specific price range
#### Buyer
- make a purchase order
- update purchase order
  
#### Seller
  - add a new car
  - update the price of a specific car
  - mark his/her posted AD as sold
  - update the price of his/her posted AD
### Admin

- Admin can view posted ads if sold or unsold
- Admin can delete a posted AS record

## Installation

Clone repo to your local machine:

```console
git clone https://github.com/j0flintking02/autoMart_api.git
```

**Install dependencies and run locally**<br/>

Then run:

```npm
npm init
npm install
```

Create .env with your own enviroment variables.

Now start the server:

```npm
npm run prestart
npm start
```

## Testing

To run tests:

```npm
npm test
```

## API

API is deployed at [here](https://automart2019.herokuapp.com/) on heroku.

### API Routes

<table>
	<tr>
		<th>HTTP VERB</th>
		<th>ENDPOINT</th>
		<th>FUNCTIONALITY</th>
	</tr>
	<tr>
		<td>POST</td>
		<td>[ users ] /api/v1/auth/signup</td> 
		<td>Create user account</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>[ users ] /api/v1/auth/signin</td> 
		<td>Sign in to user account</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>[ users ] /api/v1/car?status=available</td> 
		<td>Get all available cars</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>[ users ] /api/v1/car?min_price=200&max_price=300</td> 
		<td>Get all available cars within a price range</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>[ seller ] /api/v1/car</td> 
		<td>add a new car</td>
	</tr>
	<tr>
		<td>PUT</td>
		<td>[ seller ] /api/v1/car/5/price</td> 
		<td>update the price of a car</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>[ users ] /api/v1/car/5</td> 
		<td>get a specific car</td>
	</tr>
    <tr>
		<td>DELETE</td>
		<td>[ admin ] /api/v1/car/5</td> 
		<td>delete a specific car</td>
	</tr>
    <tr>
		<td>POST</td>
		<td>[ buyer ] /api/v1/order</td> 
		<td>make an order</td>
	</tr>
    <tr>
		<td>PUT</td>
		<td>[ buyer ] /api/v1/order/5/price</td> 
		<td>update the price of the purchase order</td>
	</tr>
    <tr>
		<td>GET</td>
		<td>[ admin ] /api/v1/all</td> 
		<td>get the all cars sold and unsold</td>
	</tr>
</table>
