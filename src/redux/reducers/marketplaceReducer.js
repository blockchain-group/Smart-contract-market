import {
	BOUGHT_PRODUCT,
	CREATED_PRODUCT,
	DELETED_PRODUCT,
	DELIVERED_PRODUCT,
	PRODUCTS_LIST_UPDATED,
	SHIPPED_PRODUCT
} from "../actions/types";
import ProductsStoreService from "../../services/storeService";

const initialState = {
	products: ProductsStoreService.getProducts()
};

export default (state = initialState, action) => {
	function modifyProduct() {
		const index = state.products.findIndex(item => item.id === action.product.id);
		let newProducts = JSON.parse(JSON.stringify(state.products));
		newProducts[index].state = action.product.state;
		newProducts[index].shippingPrice = action.product.shippingPrice;
		return newProducts;
	}

	switch (action.type) {
		case PRODUCTS_LIST_UPDATED:
			return {
				...state,
				products: action.products
			};
		case CREATED_PRODUCT:
			return {
				...state,
				products: action.products
			};
		case BOUGHT_PRODUCT:
		case SHIPPED_PRODUCT:
		case DELIVERED_PRODUCT:
			return {
				...state,
				products: modifyProduct()
			};
		case DELETED_PRODUCT:
			return {
				...state,
				products: action.products
			};
		default:
			return state
	}
}