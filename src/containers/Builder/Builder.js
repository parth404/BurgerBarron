import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 10.00,
    cheese: 20.50,
    meat: 40,
    bacon: 30.50
}

class Builder extends Component {
    state = {
        ingredients: null,
        totalPrice: 20.00,
        canOrder: false,
        ordering: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://burger-barron-react.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState({error: true});
        });
    }

    updateOrderState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {return ingredients[igKey]})
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({canOrder: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updateOrderState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updateOrderState(updatedIngredients);
    }
    
    orderHandler = () => {
        this.setState({ordering: true});
    }

    orderCancelHandler = () => {
        this.setState({ordering: false});
    }

    orderContinueHandler = () => {
        // alert('Order Added to Cart');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Parth',
                address: {
                    street: 'Teststreet 1',
                    zipcode: '560068',
                    country: 'India'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'express delivery'
        }
        axios.post('/orders.json', order)
            .then(response =>{
                this.setState({loading: false, ordering: false});
            })
            .catch(error => {
                this.setState({loading: false, ordering: false});
            });
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key]<= 0
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>There was a problem loading the ingredients</p> : <Spinner />

        if (this.state.ingredients !== null) {
            burger = (
                <Aux>
                    <Burger ingredients={ this.state.ingredients } />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        canOrder={this.state.canOrder}
                        ordered={this.orderHandler}
                        price={this.state.totalPrice} />
                </Aux>
            );

            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            cancel={this.orderCancelHandler}
            continue={this.orderContinueHandler}/>
        }
        
        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.ordering} modalClosed={this.orderCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(Builder, axios);