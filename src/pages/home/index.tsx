import React, { useEffect, useState } from 'react';
import { InputBoxComponent } from "../../components/user-controlls/input-box";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useHomePageActions from "../../hooks/useHomePageActions";
import { ArticleCardComponent } from "../../components/article-card";
import { EachArticleInformationType } from "../../redux/home-page/dataTypes";
import { LeftPanelSection } from "./sections/LeftPanel";
import './styles.scss';
type datesType = "from"|"to";

export const HomePage: React.FC = () => {
    const {homeState, authState} = useSelector((state: RootState) => ({homeState: state.homePage, authState: state.auth}));
    const [userSearchTerm, setSearchTerm] = useState<string>("");
    const [visibleArticlesCount, setVisibleArticlesCount] = useState<number>(30);
    const [filterDates, setFilterDates] = useState<Record<datesType, string>>({
        from: '',
        to: ''
    });

    console.log("here ", filterDates);

    const homeActions = useHomePageActions();

    useEffect(() => {
        (authState.isAuthenticated && !Object.keys(homeState.articles || {}).length && !homeState.isProcessing && !authState.isProcessing) &&
        homeActions.fetchAllArticles();
    }, [authState.isAuthenticated]);

    const allArticles = Object.keys(homeState.articles).flatMap(topicName =>
        Object.keys(homeState.articles[topicName]).flatMap(authorName =>
            (homeState.articles[topicName][authorName] as EachArticleInformationType[])
        )
    );

    const filteredArticles = allArticles.filter(article => {
        const { userFilterSelections = {} } = homeState;

        const hasUserSearchTermMatch =
            article.source.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.title.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.url.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.imageSrc.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.publishedAt.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.topic.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            article.author.toLowerCase().includes(userSearchTerm.toLowerCase());

        const isSelectedByFilters =
            (userFilterSelections["articles"] || []).includes(article.topic) ||
            (userFilterSelections["authors"] || []).includes(article.author) ||
            (userFilterSelections["sources"] || []).includes(article.source);

        const isFilterSelectionsEmpty = Object.keys(userFilterSelections).length === 0;

        const isWithinDateRange = () => {
            if (filterDates.from || filterDates.to) {
                const publishedDate = new Date(article.publishedAt);
                const fromDate = filterDates.from ? new Date(filterDates.from) : null;
                const toDate = filterDates.to ? new Date(filterDates.to) : null;

                // Check if the article's published date is between from and to dates
                if (fromDate && publishedDate < fromDate) return false;
                if (toDate && publishedDate > toDate) return false;
            }
            return true;
        };

        const shouldRender =
            (userSearchTerm.length > 0 && hasUserSearchTermMatch) ||
            (isSelectedByFilters && !isFilterSelectionsEmpty) ||
            (isFilterSelectionsEmpty && !userSearchTerm);

        // Final check to include date filtering
        return shouldRender && isWithinDateRange();
    });

    const handleViewMore = () => {
        setVisibleArticlesCount(prevCount => prevCount + 30);
    };

    const onDateFilterChange = (date: string, type: datesType) => {
        setFilterDates({...filterDates, [type]: date});
    }

    return (
        <div className="home-page-container container-fluid d-flex flex-wrap p-0">
            <div className="col-12 col-lg-3 left-panel-section">
                <LeftPanelSection onDateSelectionCallback={onDateFilterChange}/>
            </div>
            <div className="col-12 col-lg-9">
                <div className="d-flex flex-wrap justify-content-around gap-5">
                    <div className="d-flex col-12 search-bar p-3">
                        <InputBoxComponent
                            isRequired={false}
                            placeholder="Search..." type="text" className="search-bar"
                            value={userSearchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-wrap justify-content-around gap-5">
                        {filteredArticles.slice(0, visibleArticlesCount).map((article, index) => (
                            <ArticleCardComponent
                                key={`${article.url}--${index}`}
                                {...article}
                            />
                        ))}

                        {!filteredArticles.length && <span className="no-results">No Results 😔 </span>}
                    </div>
                    {filteredArticles.length > visibleArticlesCount && (
                        <div className="col-12 d-flex justify-content-center mt-3">
                            <button onClick={handleViewMore} className="view-more-cta">
                                VIEW MORE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
