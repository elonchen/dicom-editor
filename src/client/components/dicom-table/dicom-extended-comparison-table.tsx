import * as React from 'react';
import { List, ListItem } from 'material-ui';
import { DicomExtendedComparisonData, DicomComparisonData } from '../../model/dicom-entry';
import './dicom-table.css';
import { sortDicomComparisonEntries } from '../../utils/dicom-entry-converter';
import { DicomSimpleComparisonTable } from './dicom-simple-comparison-table';

interface TableData {
    groups: DicomComparisonData[];
    moduleName: string;
}

interface DicomExtendedComparisonProps {
    data: DicomExtendedComparisonData;
    showOnlyDiffs: boolean;
}

interface DicomExtendedComparisonState {
}

export class DicomExtendedComparisonTable extends React.Component<
    DicomExtendedComparisonProps, DicomExtendedComparisonState> {

    constructor(props: DicomExtendedComparisonProps) {
        super(props);
    }

    render() {
        let moduleArray: TableData[] = [];

        if (this.props.data) {

            for (var moduleName in this.props.data) {
                if (moduleName) {
                    let data: TableData = {
                        groups: sortDicomComparisonEntries(this.props.data[moduleName]),
                        moduleName: moduleName
                    };
                    if (!this.props.showOnlyDiffs
                        || this.atLeastOneDifference(data.groups)) {
                        moduleArray.push(data);
                    }

                }
            }

            moduleArray.sort((elementA: TableData, elementB: TableData) => {
                return elementA.moduleName.localeCompare(elementB.moduleName);
            });
            return (
                <List>
                    {/* iterates over modules */}
                    {moduleArray.map((module, moduleIndex) => {
                        return (
                            <ListItem
                                primaryText={module.moduleName}
                                key={moduleIndex}
                                primaryTogglesNestedList={true}
                                nestedItems={[

                                    <ListItem disabled={true} key={moduleIndex}>
                                        <DicomSimpleComparisonTable
                                            comparisonData={module.groups}
                                            showOnlyDiffs={this.props.showOnlyDiffs}
                                        />
                                    </ListItem>

                                ]}
                            />
                        );
                    })}
                </List>
            );
        } else {
            return (<div />);
        }
    }
/**
 * 
 * @param dicomData data to be checked
 * @description checks if data has at least one difference. If no difference is found application should
 * hide the whole sequence if user selected that kind of option
 */
    private atLeastOneDifference(dicomData: DicomComparisonData[]) {
        let result = false;
        
        dicomData.forEach(sequence => {
            if (sequence.group.length > 1 || this.atLeastOneDifferenceInSequence(sequence.sequence)) {
                result = true;
            }
        });
        return result;
    }

/**
 * 
 * @param dicomData data to be checked
 * @description checks if data has at least one difference. If no difference is found application should
 * hide the whole sequence if user selected that kind of option
 */
    private atLeastOneDifferenceInSequence(sequence: DicomComparisonData[] | undefined) {
        let result = false;
        if (sequence === undefined) {
            return false;
        }
        sequence.forEach(group => {
            if (group.group.length > 1) {
                result = true;
            }
        });
        return result;
    }
}