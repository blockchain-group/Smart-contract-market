export default class ProductsStoreService {
	static ID = 'PRODUCTS_STORAGE';

	static _hasDuplicates(productArr) {
		const products = ProductsStoreService.getProducts();
		products.forEach(prod => {
			if (productArr.some(p => p.id === prod.id)) {
				return true;
			}
		});
		return false;
	}

	static setProducts(...products) {
		const items = JSON.parse(localStorage.getItem(this.ID) || '[]');
		if (items.length !== 0) {
			if (this._hasDuplicates(products)) return false;

			const newProducts = [...items, ...products];
			localStorage.setItem(this.ID, JSON.stringify(newProducts));
		} else {
			localStorage.setItem(this.ID, JSON.stringify(products));
		}
		return true;
	};

	static getProducts() {
		return JSON.parse(localStorage.getItem(this.ID) || '[]');
	}

	static updateProduct(product, newState) {
		const products = ProductsStoreService.getProducts();
		let selectedProduct = products.find(p => p.id === product.id);
		if (selectedProduct) {
			selectedProduct.state = newState;
			selectedProduct.shippingPrice = product.shippingPrice;

			ProductsStoreService.deleteProducts();
			ProductsStoreService.setProducts(...products);
			return {...selectedProduct};
		}
	}

	static deleteProducts() {
		localStorage.removeItem(this.ID);
	}

	static deleteProduct(product) {
		const products = ProductsStoreService.getProducts();
		let index = products.findIndex(prod => prod.id === product.id);
		products.splice(index, 1);
		ProductsStoreService.deleteProducts();
		ProductsStoreService.setProducts(...products);
		return [...products];
	}
}