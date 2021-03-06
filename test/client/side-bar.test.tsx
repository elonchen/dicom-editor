import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SideBar from '../../src/client/components/side-bar/side-bar';
import { ApplicationStateReducer } from '../../src/client/application-state';
import { ColorDictionary } from "../../src/client/utils/colour-dictionary";
let colorDictionary = new ColorDictionary();

describe('side-bar', () => {
    it('should render side bar with 2 tabs', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} colorDictionary={colorDictionary} />);
        expect(sideBar.find('Paper').find('Tabs').find('Tab').length).to.equal(2);
    });

    it('should render side bar with loadedFilesTab', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} colorDictionary={colorDictionary}/>);
        expect(sideBar.find('Paper').find('Tabs').childAt(0).find('LoadedFilesTab').length).to.equal(1);
    });

    it('should render side bar with savedFilesTab', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} colorDictionary={colorDictionary}/>);
        expect(sideBar.find('Paper').find('Tabs').childAt(2).length).to.equal(1);
    });

    it('should render all tabs with some of ....FilesTab', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} colorDictionary={colorDictionary}/>);
        let allHave = true;
        sideBar.find('Paper').find('Tabs').children('Tab').map((el, index) => {
            allHave = allHave && el.children().length === 1;
        });
        expect(allHave).to.equal(true);
    });
});