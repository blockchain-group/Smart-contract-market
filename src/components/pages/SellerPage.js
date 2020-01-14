import Grid from "@material-ui/core/Grid";
import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import Header from "../Header";
import AddButton from "../AddButton";
import ProductsList from "../ProductsList";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {DeleteProduct, UpdateData} from "../../redux/actions/marketplaceAction";
import {red} from "@material-ui/core/colors";
import EtheriumService from "../../services/EtheriumService";
import {statesByName} from "../../enums";

const SELECTION = [
	{
		name: 'Buyer',
		link: '/buyer'
	},
	{
		name: 'Shipper',
		link: '/shipper'
	}
];
const TITLE = {
	name: 'Seller',
	link: '/seller'
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
	deleteButton: {
		backgroundColor: red[500],
		color: 'white',
		fontWeight: 'bold'
	}
});

class SellerPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			insertMode: false,
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleAccept = this.handleAccept.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.validateButton = this.validateButton.bind(this);
	}

	handleClick = () => {
		this.setState({ insertMode: !this.state.insertMode });
	};

	handleAccept = async (form) => {
		// Here should be form's validation

		const name = form.name;
		const price = window.web3.utils.toWei(form.price.toString(), 'Ether');
		await EtheriumService.GetMarketplaceMethods().createProduct(name, price).send({ from: this.props.accounts[0].toString() })
			.on('confirmation', async () => {
				this.props.updateData(this.props.accounts[0].toString());
				this.handleClick();
			}).catch(e => { alert(`Error: ${e}`) });
	};

	handleDelete = (product) => {
		this.props.handleProductDelete(product)
	};

	validateButton = (product, button) => {
		return button.okState === product.state;
	};

	render () {
		const { classes } = this.props;

		// Future functionality could contain delete operation
		// const deleteBtn = {
		// 	onClick: this.handleDelete,
		// 	classes: classes.deleteButton,
		// 	title: 'Delete',
		// 	okState: statesByName.InStock
		// };

		return (
			<Grid className={classes.root}>
				<Header title={TITLE} selection={SELECTION}/>
				<AddButton onClick={this.handleClick}/>
				<ProductsList
					products={this.props.products}
					insertMode={this.state.insertMode}
					handleAccept={this.handleAccept}
					handleCancel={this.handleClick}
					actionButtons={[]}
					isButtonValid={this.validateButton}/>
			</Grid>
		);
	}
}

SellerPage.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(
	state => ({
		products: state.marketplaceOperationsReducer.products,
		accounts: state.accountsReducer.accounts
	}),
	dispatch =>
		bindActionCreators(
			{
				updateData: UpdateData,
				handleProductDelete: DeleteProduct
			},
			dispatch
		)
)(SellerPage))