import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import {Link} from "react-router-dom";

const selection = [
	{
		name: 'Seller',
		link: '/seller'
	},
	{
		name: 'Buyer',
		link: '/buyer'
	},
	{
		name: 'Shipper',
		link: '/shipper'
	}
];

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
		overflow: 'hidden'
	},
	button: {
		height: 40,
		width: 30,
	},
	link: {
		'&:not(:first-child)': {
			marginLeft: '20px'
		},
		textDecoration: 'none'
	}
});

class SelectionPage extends Component {

	render () {
		const { classes } = this.props;
		return (
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
				className={classes.root}>

				{selection.map(value => (
					<Link className={classes.link} key={value.name} to={value.link}>
						<Grid item>
							<Button className={classes.button}>{value.name}</Button>
						</Grid>
					</Link>
				))}
			</Grid>
		);
	}
}

SelectionPage.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectionPage)