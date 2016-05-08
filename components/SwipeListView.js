'use strict';

import React, {Component} from 'react';
import {
	ListView,
	PropTypes,
	Text,
	View,
} from 'react-native';

import SwipeRow from './SwipeRow';

/**
 * ListView that renders SwipeRows.
 */
class SwipeListView extends Component {

	constructor(props){
		super(props);
		this._rows = {};
		this.openCellId = null;
	}

	setScrollEnabled(enable) {
		this._listView.setNativeProps({scrollEnabled: enable});
	}

	safeCloseOpenRow() {
		// if the openCellId is stale due to deleting a row this could be undefined
		if (this._rows[this.openCellId]) {
			this._rows[this.openCellId].closeRow();
		}
	}

	onRowOpen(id) {
		if (this.openCellId && this.openCellId !== id) {
			this.safeCloseOpenRow();
		}
		this.openCellId = id;
	}

	onRowPress(id) {
		if (this.openCellId) {
			if (this.props.closeOnRowPress) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
	}

	onScroll() {
		if (this.openCellId) {
			if (this.props.closeOnScroll) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
		this.props.onScoll && this.props.onScroll();
	}

	render() {
		return (
			<ListView
				{...this.props}
				ref={ c => this._listView = c}
				onScroll={ _ => this.onScroll() }
				renderRow={(rowData, secId, rowId) => (
					<SwipeRow
						ref={row => this._rows[`${secId}${rowId}`] = row}
						onRowOpen={ _ => this.onRowOpen(`${secId}${rowId}`) }
						onRowPress={ _ => this.onRowPress(`${secId}${rowId}`) }
						setScrollEnabled={ (enable) => this.setScrollEnabled(enable) }
						leftOpenValue={this.props.leftOpenValue}
						rightOpenValue={this.props.rightOpenValue}
						closeOnRowPress={this.props.closeOnRowPress}
						disableLeftSwipe={this.props.disableLeftSwipe}
						disableRightSwipe={this.props.disableRightSwipe}
					>
						{this.props.renderHiddenRow(rowData, secId, rowId, this._rows)}
						{this.props.renderRow(rowData, secId, rowId, this._rows)}
					</SwipeRow>
				)}
			/>
		)
	}

}

SwipeListView.propTypes = {
	/**
	 * How to render a row. Should return a valid React Element.
	 */
	renderRow: PropTypes.func.isRequired,
	/**
	 * How to render a hidden row (renders behind the row). Should return a valid React Element.
	 */
	renderHiddenRow: PropTypes.func.isRequired,
	/**
	 * TranslateX value for opening the row to the left (positive number)
	 */
	leftOpenValue: PropTypes.number,
	/**
	 * TranslateX value for opening the row to the right (negative number)
	 */
	rightOpenValue: PropTypes.number,
	/**
	 * Should open rows be closed when the listView begins scrolling
	 */
	closeOnScroll: PropTypes.bool,
	/**
	 * Should open rows be closed when a row is pressed
	 */
	closeOnRowPress: PropTypes.bool,
	/**
	 * Disable ability to swipe rows left
	 */
	disableLeftSwipe: PropTypes.bool,
	/**
	 * Disable ability to swipe rows right
	 */
	disableRightSwipe: PropTypes.bool
}

SwipeListView.defaultProps = {
	leftOpenValue: 0,
	rightOpenValue: 0,
	closeOnScroll: true,
	closeOnRowPress: true,
	disableLeftSwipe: false,
	disableRightSwipe: false
}

export default SwipeListView;
