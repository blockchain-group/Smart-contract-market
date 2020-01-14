import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import {deepOrange} from "@material-ui/core/colors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
	button: {
		height: '60px',
		width: '60px',
		backgroundColor: deepOrange["400"],
		color: 'white',
		borderRadius: '100%',
		position: 'fixed',
		right: '30px',
		bottom: '20px',

		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: '25px',

		'&:hover': {
			backgroundColor: deepOrange["200"],
		}
	},
});

class AddButton extends Component {

	render () {
		const { classes } = this.props;
		return (
			<Button className={classes.button} onClick={this.props.onClick}>
				<FontAwesomeIcon icon={faPlus} />
			</Button>
		);
	}
}

AddButton.propTypes = {
	classes: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(AddButton);