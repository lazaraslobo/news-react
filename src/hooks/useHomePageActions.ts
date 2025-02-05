import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { HOME_SAGA_ACTIONS } from '../redux/home-page/actions';

const useHomePageActions = () => {
    const dispatch = useDispatch<AppDispatch>();

    const fetchAllArticles = () => dispatch(HOME_SAGA_ACTIONS.fetchArticles());
    const updateUserFilterSelection = (props: {key: string, value: string}) =>
        dispatch(HOME_SAGA_ACTIONS.updateUserFilterSelection(props));

    const updateUserPreferences = (props: {key: string, value: any}) =>
        dispatch(HOME_SAGA_ACTIONS.updateUserPreferences(props));

    return {
        fetchAllArticles,
        updateUserFilterSelection,
        updateUserPreferences
    };
};

export default useHomePageActions;
