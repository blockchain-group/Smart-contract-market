import {BOUGHT_PRODUCT, CREATED_PRODUCT, DELETED_PRODUCT, DELIVERED_PRODUCT, SHIPPED_PRODUCT, PRODUCTS_LIST_UPDATED} from "./types";
import ProductsStoreService from "../../services/storeService";
import EtheriumService from "../../services/EtheriumService";

export const markCreated = (products) => ({
	type: CREATED_PRODUCT,
	products
});

export const markDeleted = (products) => ({
	type: DELETED_PRODUCT,
	products
});

export const updateProductsList = (products) => ({
	type: PRODUCTS_LIST_UPDATED,
	products
});

export const UpdateData = (acc) => async dispatch => {
	const productsCountBN = await EtheriumService.GetMarketplaceMethods().productCount().call();
	const productsCount = productsCountBN !== null ? productsCountBN.toNumber() : 0;
	const products = [];
	for (let i = 1; i <= productsCount; i++) {
		const goodObj = await EtheriumService.GetMarketplaceMethods().products(i).call();
		products.push({
			id: goodObj.id.toNumber(),
			name: goodObj.name,
			price: window.web3.utils.fromWei(goodObj.price.toString(), 'ether' ),
			shipper: goodObj.shipper,
			buyer: goodObj.buyer,
			shippingPrice: window.web3.utils.fromWei(goodObj.shippingPrice.toString(), 'ether' ),
			owner: goodObj.owner,
			state: goodObj.state,
		});
	}

	dispatch(updateProductsList(products));
};

export const DeleteProduct = product => dispatch => {
	const products = ProductsStoreService.deleteProduct(product);
	dispatch(markDeleted(products))
};
