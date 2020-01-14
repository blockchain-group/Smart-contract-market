import Grid from "@material-ui/core/Grid";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/styles';
import Header from "../Header";
import ProductsList from "../ProductsList";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {UpdateData} from "../../redux/actions/marketplaceAction";
import {green, orange} from "@material-ui/core/colors";
import {statesByName} from "../../enums";
import EtheriumService from "../../services/EtheriumService";
import ShipperModal from "../ShipperModal";
import Web3 from "web3";

const SELECTION = [
	{
		name: 'Seller',
		link: '/seller'
	},
	{
		name: 'Shipper',
		link: '/shipper'
	}
];
const TITLE = {
	name: 'Buyer',
	link: '/buyer'
};

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	title: {
		marginRight: '50px'
	},
	button: {
		height: '100%',
		width: 30,
		color: 'white',
		marginRight: '20px'
	},
	link: {
		textDecoration: 'none',
		color: 'white',
		fontWeight: 'white',
	},
	buyBtn: {
		backgroundColor: orange[500],
		color: 'white',
		fontWeight: 'bold'
	},
	deliveredButton: {
		backgroundColor: green[500],
		color: 'white',
		fontWeight: 'bold'
	}
});

class BuyerPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			selectedProduct: {},
			shippers: []
		};
		this.handleBuy = this.handleBuy.bind(this);
		this.handleDelivered = this.handleDelivered.bind(this);
		this.getAccounts = this.getAccounts.bind(this);
	}

	handleBuy = async (shipper) => {
		const product = this.state.selectedProduct;
		product.shippingPrice = Math.floor(Math.random() * 5);
		const transactionPrice = parseInt(product.price) + product.shippingPrice;

		await EtheriumService.GetMarketplaceMethods()
			.purchaseProduct(product.id, shipper, window.web3.utils.toWei(product.shippingPrice.toString(), 'Ether'))
			.send({ from: this.props.accounts[0], value: window.web3.utils.toWei(transactionPrice.toString(), 'Ether')})
			.once('confirmation', async () => {
				this.props.updateData(this.props.accounts[0].toString());
				this.setState({ isOpen: !this.state.isOpen });
			})
			.catch(e => { alert(`Error: ${e.message}`) });
	};

	handleDelivered = async (product) => {
		await EtheriumService.GetMarketplaceMethods()
			.markProductAsDelivered(product.id)
			.send({ from: this.props.accounts[0] })
			.once('confirmation', async () => {
				this.props.updateData(this.props.accounts[0].toString());
			})
			.catch(e => { alert(`Error: ${e.message}`) });
	};

	getAccounts = async () => {
		const tempWeb3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
		const accounts = await tempWeb3.eth.getAccounts();

		const accIndex = accounts.indexOf(this.props.accounts[0]);
		if (accIndex !== -1) accounts.splice(accIndex, 1);

		return accounts;
	};

	handleModalOpen = async (product = {}) => {
		const accounts = await this.getAccounts();

		this.setState({
			selectedProduct: product,
			shippers: accounts,
			isOpen: !this.state.isOpen
		});
	};

	validateButton = (product, button) => {
		return product.state === button.okState
			&& product['owner'] !== this.props.accounts[0]
			&& product.shipper !== this.props.accounts[0];
	};

	render() {
		const {classes} = this.props;

		const buyBtn = {
			onClick: this.handleModalOpen,
			classes: classes.buyBtn,
			title: 'Buy',
			okState: statesByName.InStock
		};
		const deliveredBtn = {
			onClick: this.handleDelivered,
			classes: classes.deliveredButton,
			title: 'Mark delivered',
			okState: statesByName.Shipped
		};

		return (
			<Grid className={classes.root}>
				<Header title={TITLE} selection={SELECTION}/>
				<ProductsList
					products={this.props.products}
					actionButtons={[buyBtn, deliveredBtn]}
					isButtonValid={this.validateButton}/>
				<ShipperModal onChoose={this.handleBuy} onClose={this.handleModalOpen} isOpen={this.state.isOpen} options={this.state.shippers}/>
			</Grid>
		);
	}
}

BuyerPage.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(
	state => ({
			products: state.marketplaceOperationsReducer.products,
			accounts: state.accountsReducer.accounts
		}
	),
	dispatch =>
		bindActionCreators(
			{
				updateData: UpdateData,
			},
			dispatch
		)
)(BuyerPage))