import '@testing-library/jest-dom';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

window.reactRouterFuture = {
    v7_startTransition: true, 
    v7_relativeSplatPath: true
};
