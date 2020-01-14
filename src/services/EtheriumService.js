import Web3 from "web3";
import Marketplace from "../abis/Marketplace";

export default class EtheriumService {

	static async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
	}

	static async loadBlockchainData() {
		const web3 = window.web3;

		// Load account
		const accounts = await web3.eth.getAccounts();
		const networkId = await web3.eth.net.getId();
		const networkData = Marketplace.networks[networkId];
		if(networkData) {
			this.marketplace = web3.eth.Contract(Marketplace.abi, networkData.address);
		} else {
			window.alert('Marketplace contract not deployed to detected network.')
		}
		return accounts;
	}

	static async init() {
		await this.loadWeb3();
		return await this.loadBlockchainData();
	}

	static GetMarketplaceMethods() {
		return this.marketplace.methods;
	}

	static createProd(product, acc, callback) {
		const name = product.name;
		const price = window.web3.utils.toWei(product.price.toString(), 'Ether');
		this.marketplace.methods.createProduct(name, price).send({ from: acc.toString() })
			.on('confirmation', async (confNo, receipt) => {
				callback();
			}).catch(e => { console.log(e); });

	}
}