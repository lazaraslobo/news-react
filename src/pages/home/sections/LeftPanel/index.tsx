import React, {useState} from 'react';
import {AccordionComponent} from "../../../../components/accordion";
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import useHomePageActions from "../../../../hooks/useHomePageActions";

type datesType = "from"|"to";

type componentProps = {
    onDateSelectionCallback: (date: string, type: datesType) => void;
}

export const LeftPanelSection: React.FC<componentProps> = ({onDateSelectionCallback}) => {
    const homeActions = useHomePageActions();
    const {homeState, authState} = useSelector((state: RootState) => ({homeState: state.homePage, authState: state.auth}));


    const componentFunctions = {
        updateUserSelection: (key: string, value: string) => homeActions.updateUserFilterSelection({key, value}),
    }

    console.log("state ", {homeState, authState})

    const saveUserPreference = (isReset : boolean = false) => {
        homeActions.updateUserPreferences({
            key: "userSelections",
            value: isReset ? {} : (homeState.userFilterSelections || {})
        });
    }

    return (
        <div className="d-grid gap-2">
            <div className="col-12 d-flex justify-content-between my-3 px-3">
                {(Object.keys(homeState.userFilterSelections).length > 0 ||
                        Object.keys(authState?.user?.preferences?.userSelections || {}).length > 0) &&
                    <span className="preferences-cta" role="button"
                          onClick={() => saveUserPreference()}>SAVE TO PREFERENCES</span>}
                <span className="preferences-cta-reset" role="button" onClick={() => saveUserPreference(true)}>RESET PREFERENCES</span>
            </div>

            <div className="d-flex date-filter-container justify-content-between">
                <div className="col-5">
                    <span>From</span>
                    <input id="startDate" className="form-control" type="date" placeholder="From"
                           onChange={e => onDateSelectionCallback(e.target.value, "from")}/>
                </div>
                <div className="col-5">
                    <span>To</span>
                    <input id="startDate" className="form-control" type="date" placeholder="To"
                           onChange={e => onDateSelectionCallback(e.target.value, "to")}/>
                </div>
            </div>

            <AccordionComponent heading={"Category"} items={homeState.articles}
                                selectionList={homeState.userFilterSelections['articles'] || []}
                                onClick={value => componentFunctions.updateUserSelection("articles", value)}/>

            <AccordionComponent heading={"Sources"} items={homeState.sources}
                                selectionList={homeState.userFilterSelections['sources'] || []}
                                onClick={value => componentFunctions.updateUserSelection("sources", value)}/>

            <AccordionComponent heading={"Authors"} items={homeState.authors}
                                selectionList={homeState.userFilterSelections['authors'] || []}
                                onClick={value => componentFunctions.updateUserSelection("authors", value)}/>
        </div>
    )
}