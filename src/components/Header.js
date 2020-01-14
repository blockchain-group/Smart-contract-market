import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import {Link} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

const styles = (theme) => ({
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
	address: {
		position: 'absolute',
		right: '24px'
	}
});

class Header extends Component {

	render () {
		const { classes } = this.props;
		return (
			<AppBar position="static">
				<Toolbar>
					<Link className={classes.link} to={this.props.title.link}>
						<Typography variant="h5" className={classes.title}>
							{this.props.title.name}
						</Typography>
					</Link>
					{this.props.selection.map(value => (
						<Link className={classes.link} key={value.name} to={value.link}>
							<Grid item>
								<Button className={classes.button}>{value.name}</Button>
							</Grid>
						</Link>
					))}
					<Typography className={classes.address}>{this.props.accounts[0]}</Typography>
				</Toolbar>
			</AppBar>
		);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.shape({
		name: PropTypes.string,
		link: PropTypes.string
	}).isRequired,
	selection: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string,
		link: PropTypes.string
	})).isRequired,
};

export default withStyles(styles)(connect(
	state => ({
		accounts: state.accountsReducer.accounts,
	}),
	dispatch =>
		bindActionCreators(
			{
			},
			dispatch
		)
)(Header))
