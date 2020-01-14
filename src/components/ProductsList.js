import Grid from "@material-ui/core/Grid";
import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import {Input} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import Button from "@material-ui/core/Button";
import {green, red} from "@material-ui/core/colors";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {statesById} from "../enums";

const styles = (theme) => ({
	root: {
		width: '100%',
		height: '91vh',
	},
	tableContainer: {
		flexGrow: 1,
		maxWidth: '1400px',
		height: 'fit-content',
		margin: 'auto',
		marginTop: '60px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: '50px',
	},
	table: {
		minWidth: '800px',
	},
	btnCheck: {
		backgroundColor: green[200],
		marginRight: '5px'
	},
	btnTimes: {
		backgroundColor: red[200]
	}
});

class ProductsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {
				id: '',
				name: '',
				price: null,
				shippingPrice: null,
				owner: '',
				state: 'InStock'
			}
		};

		this.onInputChange = this.onInputChange.bind(this);
	}

	onInputChange = (evt, property) => {
		this.setState({ form: {
			...this.state.form,
			[property]: evt.target.value
		}});
	};

	render () {
		const { classes } = this.props;
		return (
			<Grid className={classes.root}>
				<TableContainer className={classes.tableContainer} component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="center">ID</TableCell>
								<TableCell align="center">Name</TableCell>
								<TableCell align="center">Price</TableCell>
								<TableCell align="center">Shipping Price</TableCell>
								<TableCell align="center">Owner</TableCell>
								<TableCell align="center">State</TableCell>
								<TableCell align="center">Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.props.products && this.props.products.map((product) => (
								<TableRow key={product.id}>
									<TableCell align={'center'}>{product.id}</TableCell>
									<TableCell align={'center'}>{product.name}</TableCell>
									<TableCell align={'center'}>{product.price}</TableCell>
									<TableCell align={'center'}>{product.shippingPrice}</TableCell>
									<TableCell align={'center'}>{product['owner']}</TableCell>
									<TableCell align={'center'}>{statesById[product.state]}</TableCell>
									<TableCell align={'center'}>
										{this.props.actionButtons.map((btn) => (
											(this.props.isButtonValid(product, btn) &&
											<Button key={btn.okState} disabled={btn.title === 'Delete'} onClick={() => btn.onClick(product)} className={btn.classes}>{btn.title}</Button>)
										))}
									</TableCell>
								</TableRow>
							))}
							{this.props.insertMode && (
								<TableRow>
									<TableCell/>
									<TableCell><Input type={'text'} onChange={(e) => this.onInputChange(e, 'name')}/></TableCell>
									<TableCell><Input type={'number'} onChange={(e) => this.onInputChange(e, 'price')}/></TableCell>
									<TableCell/>
									<TableCell/>
									<TableCell>
										<Select
											labelId={`list-insert-state-select`}
											id="demo-simple-select-readonly"
											value={this.state.form.state}
											inputProps={{ readOnly: true }}
											disabled={true}>
											<MenuItem value={'InStock'}>In Stock</MenuItem>
										</Select>
									</TableCell>
									<TableCell>
										<Button className={classes.btnCheck} onClick={() => this.props.handleAccept(this.state.form)}>
											<FontAwesomeIcon icon={faCheck} />
										</Button>
										<Button className={classes.btnTimes} onClick={() => this.props.handleCancel(this.state.form)}>
											<FontAwesomeIcon icon={faTimes} />
										</Button>
									</TableCell>
								</TableRow>
							)
							}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		);
	}
}

ProductsList.propTypes = {
	classes: PropTypes.object.isRequired,
	products: PropTypes.array.isRequired,
	actionButtons: PropTypes.array,
	insertMode: PropTypes.bool,
	handleAccept: PropTypes.func,
	handleCancel: PropTypes.func,
	isButtonValid: PropTypes.func
};

export default withStyles(styles)(ProductsList)