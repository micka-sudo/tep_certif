import React from 'react';
import SignIn from "./components/SignIn";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer"
import HomePage from './pages/HomePage'
import Docpage from "./pages/DocPage"
import StatPage from "./pages/StatPage"
import ProjectPage from "./pages/ProjectPage"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme , ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import deepPurple from '@material-ui/core/colors/deepPurple'

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
    const primaryColor = deepPurple;
    const theme = React.useMemo(() =>
    createTheme ({
        palette: {
          type: prefersDarkMode ? 'light' : 'dark',
            primary: primaryColor,
            secondary: primaryColor,
        },
      }),
      [prefersDarkMode]// eslint-disable-line react-hooks/exhaustive-deps,
    );

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
            <CssBaseline/>
            {window.location.pathname !== '/' && <Header/>}
            <Router>
                <Switch>
                    <Route path="/" exact component={SignIn}/>
                    <Route path="/HomePage" exact component={HomePage}/>
                    <Route path="/document/:id" exact component={Docpage}/>
                    <Route path="/StatPage" exact component={StatPage}/>
                    <Route path="/projects" exact component={ProjectPage}/>
                </Switch>
            </Router>
            {window.location.pathname !== '/' && <Footer/>}
            </ThemeProvider>
        </div>
    );
}

export default App;
