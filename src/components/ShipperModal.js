import React, {Component} from "react";
import {withStyles} from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import {orange} from "@material-ui/core/colors";
import PropTypes from "prop-types";

const styles = (theme) => ({
	avatar: {
		backgroundColor: orange[100],
		color: orange[600],
	},
});

class ShipperModal extends Component {
	render() {
		const { classes } = this.props;
		return (
			<Dialog onClose={this.props.onClose} aria-labelledby="simple-dialog-title" open={this.props.isOpen}>
				<DialogTitle id="simple-dialog-title">Select shipper</DialogTitle>
				<List>
					{this.props.options.map(acc => (
						<ListItem button onClick={() => this.props.onChoose(acc)} key={acc}>
							<ListItemAvatar>
								<Avatar className={classes.avatar} />
							</ListItemAvatar>
							<ListItemText primary={acc} />
						</ListItem>
					))}
				</List>
			</Dialog>
		);
	}
}

ShipperModal.propTypes = {
	classes: PropTypes.object.isRequired,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChoose: PropTypes.func,
	options: PropTypes.array
};

export default withStyles(styles)(ShipperModal);