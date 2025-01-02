#!/bin/bash

# Stripe Secret Key
STRIPE_SK="sk_test_51QaR7XDQyO648ofbKHnZw2lqGMP1a7KPp879I6ni5TR8ABOyqJO1NLB8rGg8ChiLtNakJCjHWviWNFDYpXdNvKxt00SbUlWU3Z"

# Function to create a price
create_price() {
    local product_id=$1
    local amount=$2
    local interval=$3
    local nickname=$4

    echo "Creating $interval price for $nickname..."
    curl -X POST https://api.stripe.com/v1/prices \
        -u "$STRIPE_SK:" \
        -d "product=$product_id" \
        -d "unit_amount=$amount" \
        -d "currency=usd" \
        -d "recurring[interval]=$interval" \
        -d "nickname=$nickname-$interval" | cat
    echo -e "\n"
}

# E-Commerce Add-on
echo "Creating E-Commerce Add-on prices..."
create_price "prod_RVvQxMVLf8PMSH" 3500 "month" "ecommerce"
create_price "prod_RVvQxMVLf8PMSH" 35000 "year" "ecommerce"

# User Accounts Add-on
echo "Creating User Accounts Add-on prices..."
create_price "prod_RVvZvqnovpUx6k" 2500 "month" "user-accounts"
create_price "prod_RVvZvqnovpUx6k" 25000 "year" "user-accounts"

# Content Manager Add-on
echo "Creating Content Manager Add-on prices..."
create_price "prod_RVvZAEurUI3Rl4" 2000 "month" "content-manager"
create_price "prod_RVvZAEurUI3Rl4" 20000 "year" "content-manager"

# Booking System Add-on
echo "Creating Booking System Add-on prices..."
create_price "prod_RVvZoFpc8JveGf" 2500 "month" "booking"
create_price "prod_RVvZoFpc8JveGf" 25000 "year" "booking"

# Extra Changes Add-on
echo "Creating Extra Changes Add-on prices..."
create_price "prod_RVvZuEBB7JEZ8s" 1500 "month" "extra-changes"
create_price "prod_RVvZuEBB7JEZ8s" 15000 "year" "extra-changes"

echo "All prices created!" 