import Grid from "@material-ui/core/Grid";
import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import Header from "../Header";
import ProductsList from "../ProductsList";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {UpdateData} from "../../redux/actions/marketplaceAction";
import {pink} from "@material-ui/core/colors";
import {statesByName} from "../../enums";
import EtheriumService from "../../services/EtheriumService";

const SELECTION = [
	{
		name: 'Seller',
		link: '/seller'
	},
	{
		name: 'Buyer',
		link: '/buyer'
	}
];
const TITLE = {
	name: 'Shipper',
	link: '/shipper'
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
	shipButton: {
		backgroundColor: pink[500],
		color: 'white',
		fontWeight: 'bold'
	}
});

class ShipperPage extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleShip = this.handleShip.bind(this);
		this.validateButton = this.validateButton.bind(this);
	}

	handleShip = async (product) => {
		await EtheriumService.GetMarketplaceMethods()
			.shipProduct(product.id)
			.send({ from: this.props.accounts[0] })
			.once('confirmation', async () => {
				this.props.updateData(this.props.accounts[0].toString());
			})
			.catch(e => { alert(`Error: ${e.message}`) });
	};

	validateButton = (product, button) => {
		return product.state === button.okState
			&& product.shipper === this.props.accounts[0];
	};

	render () {
		const { classes } = this.props;

		const shipBtn = {
			onClick: this.handleShip,
			classes: classes.shipButton,
			title: 'Ship',
			okState: statesByName.Purchased
		};

		return (
			<Grid className={classes.root}>
				<Header title={TITLE} selection={SELECTION}/>
				<ProductsList
					products={this.props.products}
					actionButtons={[shipBtn]}
					isButtonValid={this.validateButton}/>
			</Grid>
		);
	}
}

ShipperPage.propTypes = {
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
				updateData: UpdateData
			},
			dispatch
		)
)(ShipperPage))