import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/tag-viewer';
import ImageViewer from '../components/image-viewer';
import './main-view.css';
import { ApplicationStateReducer, SelectedFile } from '../application-state';
import { DicomSimpleData } from '../model/dicom-entry';
import { HeavyweightFile } from '../model/file-interfaces';
import { TableMode } from '../model/table-enum';

interface MainViewProps {
  reducer: ApplicationStateReducer;
}

interface MainViewState {
  dicomData: DicomSimpleData;
  loadedFiles: HeavyweightFile[];
  selectedFiles: SelectedFile[];
  tableMode: TableMode;
  actualBufferData: Uint8Array;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

  public constructor(props: MainViewProps) {
    super(props);
    this.state = {
      dicomData: {
        entries: [],
        
      },
      selectedFiles: [],
      loadedFiles: [],
      actualBufferData: new Uint8Array(0),
      tableMode: TableMode.SIMPLE
    };
  }

  public componentDidMount() {
    this.props.reducer.state$.subscribe(state => {
      this.setState({
        dicomData: state.currentFile ? state.currentFile.dicomData : { entries: []},
        selectedFiles: state.selectedFiles ? state.selectedFiles : [],
        loadedFiles: state.loadedFiles ? state.loadedFiles : [],
        actualBufferData: state.currentFile ? state.currentFile.bufferedData : new Uint8Array(0)      
      });
    });
  }

  render() {
    let files: HeavyweightFile[] = [];
    this.state.selectedFiles.forEach(selectedFile => {
      files.push(this.state.loadedFiles[selectedFile.fileIndex]);
    });

    return (
      <Tabs className="tabs" initialSelectedIndex={1}>
        <Tab
          label="Image viewer"
        >
          <div className="container">
            <ImageViewer data={this.state.actualBufferData}/>
          </div>
        </Tab>
        <Tab
          label="Tags"
        >
          <div className="container">
            <h1>TagViewer</h1>
            <div id="simpleOrHierarchical">
              <Tabs>
<<<<<<< HEAD
                <Tab label="Simple" onClick={() => this.setState({tableMode: TableMode.SIMPLE})} />
                <Tab label="Hierarchical" onClick={() => this.setState({tableMode: TableMode.EXTENDED})} />
=======
                <Tab label="Simple" onClick={() => this.setState({tableMode: TableMode.SIMPLE})}/>
                <Tab label="Hierarchical" onClick={() => this.setState({tableMode: TableMode.EXTENDED})}/>
>>>>>>> tiny syntax changes (aby lint nepistal)
              </Tabs>
            </div>
          </div>

          <div className="container">
            <TagViewer files = {files} tableType = {this.state.tableMode} />
          </div>
        </Tab>
      </Tabs>
    );
  }
}