import * as React from 'react';
import { HeavyweightFile } from '../../model/file-interfaces';
import { ListItem, Checkbox } from 'material-ui';
import { ApplicationStateReducer } from '../../application-state';
import './element-selectable-list.css';
import './side-bar.css';
import { ColorDictionary } from '../../utils/colour-dictionary';
import {
    storeSelectedFileToDB, deleteSelectedFileFromDB,
    deleteFileFromLoaded, storeComparisonActive
} from '../../utils/loaded-files-store-util';
var ClearIcon = require('react-icons/lib/md/clear');

interface ElementOfSelectableListProps {
    reducer: ApplicationStateReducer;
    selectFunction: Function;
    item: HeavyweightFile;
    colorDictionary: ColorDictionary;
    checked: boolean;
    color: string;
    checkInform: Function;
}

interface ElementOfSelectableListState {
}

export class ElementOfSelectableList extends
    React.Component<ElementOfSelectableListProps, ElementOfSelectableListState> {

    constructor(props: ElementOfSelectableListProps) {
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleColorChanging = this.handleColorChanging.bind(this);
    }

    handleCheck(e: object, isInputChecked: boolean) {

        if (isInputChecked) {
            let newColor = this.props.colorDictionary.getFirstFreeColor();
            this.props.reducer.addSelectedFile(this.props.item.fileName, newColor);
            this.props.checkInform(true);
            storeSelectedFileToDB(this.props.reducer.getState()
                .selectedFiles[this.props.reducer.getState().selectedFiles.length - 1]);
        } else {
            this.handleColorChanging();
            deleteSelectedFileFromDB(this.props.item);
        }
    }

    render() {

        if (!this.props.item) {
            return (<div/>);
        }
        let bckgcolor = this.isCurrentFile() ? { backgroundColor: '#c7d5ed' } : { backgroundColor: 'white' };
        let fileLabel = (this.props.item.unsavedChanges === undefined || this.props.item.unsavedChanges.length === 0)
            ? this.props.item.fileName
            : this.props.item.fileName + '*';
        return (
            <div className="container-selectable-list" style={bckgcolor}>
                <div className="checkbox">
                    <Checkbox
                        onCheck={this.handleCheck}
                        checked={this.props.checked}
                    />
                </div>
                <div className="truncate">
                    <ListItem
                        onClick={() => this.props.selectFunction(this.props.item)}
                        primaryText={fileLabel}
                        style={
                            this.props.reducer.getState().comparisonActive ?
                                { color: this.props.color } :
                                { color: 'black' }
                        }
                    />
                </div>

                <div className="clear-icon-container">
                    <ClearIcon
                        className="clearIcon"
                        onClick={() => this.handleRemoveClick()}
                    />
                </div>

            </div>
        );
    }

    private isCurrentFile() {
        let currFile = this.props.reducer.getState().currentFile;
        if (currFile && currFile !== undefined && currFile.fileName === this.props.item.fileName &&
            currFile.fileSize === this.props.item.fileSize) {
            return true;
        } else {
            return false;
        }
    }

    private handleRemoveClick() {
        this.handleColorChanging();
        this.props.reducer.removeLoadedFiles([this.props.item]);
        if (this.props.color !== 'black') {
            this.props.reducer.setComparisonActive(false);
            storeComparisonActive(false);
        }
        deleteSelectedFileFromDB(this.props.item);
        deleteFileFromLoaded(this.props.item, this.props.reducer);
    }

    private handleColorChanging() {
        let selectedFiles = this.props.reducer.getSelectedFiles();
        let indexOfFile = selectedFiles.indexOf(this.props.item);
        let freeColor = this.props.reducer.removeSelectedFile(this.props.item.fileName);
        
        this.props.colorDictionary.freeColor(freeColor);
        this.props.checkInform(false);

        if (indexOfFile !== -1 && this.props.reducer.getState().comparisonActive) {
            this.props.reducer.setComparisonActive(false);
            storeComparisonActive(false);
            this.props.reducer.updateCurrentFile(this.props.reducer.getSelectedFiles()[0]);
        }
    }
}