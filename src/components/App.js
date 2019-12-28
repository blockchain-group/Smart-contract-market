import React, { Component } from 'react';
import SelectionPage from "./pages/SelectionPage";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import SellerPage from "./pages/SellerPage";
import { createMuiTheme } from '@material-ui/core/styles';
import {deepOrange} from "@material-ui/core/colors";
import {MuiThemeProvider} from "@material-ui/core";
import BuyerPage from "./pages/BuyerPage";
import ShipperPage from "./pages/ShipperPage";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchAccounts} from "../redux/actions/accountsAction";
import EtheriumService from "../services/EtheriumService";
import {UpdateData} from "../redux/actions/marketplaceAction";

const theme = createMuiTheme({
	palette: {
		primary: deepOrange,
		secondary: {
			main: '#ff8a65',
		},
	},
});

class App extends Component {
	componentWillMount = async () => {
		const accounts = await EtheriumService.init();

		setInterval( async () => {
			const newAccounts = await window.web3.eth.getAccounts();
			if (newAccounts[0] !== this.props.accounts[0]) {
				this.props.handleAccountsFetch(newAccounts);
			}
		}, 500);

		this.props.handleAccountsFetch(accounts);
		this.props.updateData();
	};

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Router>
					<Switch>
						<Route path={'/seller'}>
							<SellerPage />
						</Route>
						<Route path={'/buyer'}>
							<BuyerPage />
						</Route>
						<Route path={'/shipper'}>
							<ShipperPage />
						</Route>
						<Route path={'/'}>
							<SelectionPage />
						</Route>
					</Switch>
				</Router>
			</MuiThemeProvider>
		);
	}
}

export default connect(
	state => ({
		accounts: state.accountsReducer.accounts
	}),
	dispatch =>
		bindActionCreators(
			{
				handleAccountsFetch: fetchAccounts,
				updateData: UpdateData
			},
			dispatch
		)
)(App);
