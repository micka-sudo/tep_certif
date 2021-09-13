import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import TextArea from "../components/Text/TextArea"
import FeaturesTable from '../components/FeaturesTable'
import Progress from "../components/CircularProgress/CircularProgress"
import CloudWord from "../components/Charts/WordCloud"

import {getContents} from "../services/content.service"
import FeatureForm from '../components/FeatureForm';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        paddingLeft:theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    panel : {
        height:'78vh',
        overflowY: 'auto'
    }
}));

export default function CollapsibleTable({match}) {
    const classes = useStyles();

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState(null);

    const [highlight, setHighlight] = React.useState(null)
    const [newFeatureValue, setNewFeatureValue] = React.useState(false)
    const [onEndSelection, setOnEndSelection] = React.useState(() => () => {})

    React.useEffect(() => {
        if (data)
            setIsLoading(false)
        else
            getContents("/documents/" + match.params.id + "/", {depth: 2}, setData)
    }, [match, isLoading, data, setData, setIsLoading]);

    const handleTextSelection = (span, onEndSelection) => {
        setNewFeatureValue(span)
        setOnEndSelection(() => () => onEndSelection())
    }

    const handleAddFeatureEnd = (data) => {
        onEndSelection()
        setNewFeatureValue(false)
        if (data)
            setData(data);
    }

    if (isLoading)
        return (<div><Progress/></div>)

    return (
        <div className={classes.container}>
            <Container className={classes.container} maxWidth="xl" >
                <Grid container spacing={6}>
                    <Grid className={classes.panel} item xs={12} sm={7}>
                        <TextArea text={data.text} highlight={highlight} onSelectText={handleTextSelection} />
                    </Grid>
                    <Grid className={classes.panel} item xs={12} sm={5}>
                        <FeaturesTable examId={data.id} features={data.features} 
                        text={data.text} onHighlight={setHighlight} onAddFeature={setNewFeatureValue} onDeleteFeature={setData}/>
                        <CloudWord data={data.stats.word_frequencies} minCount={2}/>
                    </Grid>
                </Grid>
            </Container>
            <FeatureForm newFeatureValue={newFeatureValue} onAddFeatureEnd={handleAddFeatureEnd} features={data.features} examId={data.id}/>
        </div>
    );
}
