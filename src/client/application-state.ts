import { FileStorage } from './utils/file-storage';
import { HeavyweightFile, LightweightFile } from './model/file-interfaces';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface SelectedFile {
    selectedFile: HeavyweightFile;
    colourIndex: number;
}

export interface ApplicationState {
    recentFiles: LightweightFile[];
    loadedFiles: HeavyweightFile[];
    currentFile?: HeavyweightFile;
    currentIndex?: number;
    selectedFiles: SelectedFile[];
}

export class ApplicationStateReducer {
    private currentState: ApplicationState;
    private stateSubject$: BehaviorSubject<ApplicationState>;

    public get state$(): Observable<ApplicationState> {
        return this.stateSubject$;
    }

    public constructor() {
        this.currentState = {
            recentFiles: [],
            loadedFiles: [],
            currentFile: undefined,
            currentIndex: undefined,
            selectedFiles: []
        };

        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

    public addLoadedFiles(files: HeavyweightFile[]) {
        files.forEach(element => {
            this.addOneLoadedFile(element);
        });
        this.currentState.currentFile = files[0];
        this.currentState.currentIndex = this.currentState.loadedFiles.indexOf(files[0]);
        this.stateSubject$.next(this.currentState);
    }

    public getState(): ApplicationState {
        return this.currentState;
    }

    public updateRecentFiles(files: LightweightFile[]) {
        this.currentState.recentFiles = files;

        this.stateSubject$.next(this.currentState);
    }

    public updateCurrentFile(file: HeavyweightFile) {
        this.currentState.currentFile = file;
        this.stateSubject$.next(this.currentState);
    }

    public updateCurrentFromRecentFile(file: LightweightFile) {
        let fileStorage = new FileStorage(this);
        fileStorage.getData(file).then(data => {
            this.addLoadedFiles([data]);
        });
    }

    public addSelectedFile(fileName: string) {
        let file = this.findLoadedFileByName(fileName);
        if (file) {
            this.currentState.selectedFiles.push({ selectedFile: file, colourIndex: 1 });
            this.stateSubject$.next(this.currentState);
        }
    }

    public removeSelectedFile(fileName: string) {
        let indexToRemove = this.findSelectedFileIndexByName(fileName);

        this.currentState.selectedFiles.splice(indexToRemove, 1);
        this.stateSubject$.next(this.currentState);
    }

    private findLoadedFileByName(fileName: string): (HeavyweightFile | undefined) {
        for (var index = 0; index < this.currentState.loadedFiles.length; index++) {
            if (this.currentState.loadedFiles[index].fileName === fileName) {
                return this.currentState.loadedFiles[index];
            }
        }

        return undefined;
    }

    private findSelectedFileIndexByName(fileName: string): number {
        for (var index = 0; index < this.currentState.selectedFiles.length; index++) {
            if (this.currentState.selectedFiles[index].selectedFile.fileName === fileName) {
                return index;
            }
        }

        return -1;
    }

    private addOneLoadedFile(file: HeavyweightFile) {
        this.currentState.loadedFiles.forEach((e, index) => {
            if (e.fileName === file.fileName) {
                this.currentState.loadedFiles.splice(index, 1);
            }
        });
        this.currentState.loadedFiles.unshift(file);
    }
}