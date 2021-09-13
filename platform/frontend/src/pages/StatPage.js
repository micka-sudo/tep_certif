import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PieCharts from "../components/Charts/PieCharts";
import BarChart from "../components/Charts/BarChart"
import ObjectWordCloud from "../components/Charts/ObjectWordCloud"
import Progress from "../components/CircularProgress/CircularProgress";
import {getContents} from "../services/content.service";

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        overflow: 'auto',
        paddingRight: 24,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(4),
        margin: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 384,
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [data, setData] =  React.useState (null)
    const [isLoading, setIsLoading] =  React.useState (true)

    React.useEffect(() => {
        if (data)
            setIsLoading(false)
        else {
            setIsLoading(true)
            getContents('/stats/', {}, setData)
        }
    }, [data, setData, setIsLoading]);

    if (isLoading)
        return (<div><Progress/></div>)

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container >
                {/*Recent Deposits*/}
                <Grid xs={6} sm={6}>
                    <Paper className={fixedHeightPaper}>
                        <PieCharts data={data.genders}/>
                    </Paper>
                </Grid>
                {/*Bar Chart*/}
                <Grid xs={6} sm={6}>
                    <Paper className={fixedHeightPaper}>
                        <BarChart data={data.age_by_genders} genders={data.genders} />
                    </Paper>
                </Grid>
                <Grid xs={12}>
                    <Paper className={classes.paper}>
                        <ObjectWordCloud data={data.word_frequencies}/>
                    </Paper>
                </Grid>
            </Grid>

        </Container>
    );
}