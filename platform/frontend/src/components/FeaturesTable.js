import React, {forwardRef} from "react";
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { capitalize } from '@material-ui/core';
import FeatureDeleteDialog from './FeatureDeleteDialog'

const PREVIEW_MAX_LENGTH = 35

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

export default React.memo(function FeaturesTable(props) {

    const { examId, text, features, onHighlight, onAddFeature, onDeleteFeature } = props;
    const [toDelete, setToDelete] = React.useState(null)

    const parseFeatures = (data) => {
        const parsed = [];
        let c = 0;
        data.forEach((feature) => {
            const currentFeature = {id:c, label:capitalize(feature.name), onDelete:(data) => data};
            parsed.push(currentFeature);
            feature.sources.forEach((source) => {
                c++;
                const currentSource = {id:c, label:source.name, parentId:currentFeature.id, onDelete:(data) => data};
                parsed.push(currentSource);
                source.items.forEach((item) => {
                    c++;
                    let span = (item.hasOwnProperty("start") && item.hasOwnProperty("end")) ? [item.start, item.end] : '' 
                    span = (span === '' && item.hasOwnProperty("value")) ? item.value : span 
                    const probability = item.hasOwnProperty('probability') ? item.probability : ''
                    const currentItem = {
                        id:c, label:item.label, span, probability, 
                        parentId:currentSource.id
                    }
                    parsed.push(currentItem)
                    
                    const userOnDelete = (data) => {
                        let newData = data
                        source.items = source.items.filter((value, index, arr) => {
                            return value !== item
                        })
                        if (source.items.length === 0) {
                            feature.sources = feature.sources.filter((value, index, arr) => {
                                return value !== source
                            })
                            if (feature.sources.length === 0) {
                                newData = newData.filter((value, index, arr) => {
                                    return value !== feature
                                })
                            }
                        }
                        return newData
                    }
                    currentItem.onDelete = source.type === 'user' ? userOnDelete : (data) => data

                });
            });
            c++;
        });

        return parsed
    }   

    const handleMouseEnter = (value) => {
        onHighlight(value)
    }
    const handleMouseLeave = () => {
        onHighlight(null)
    }
    
    const handDeleteFeatureEnd = (data) => {
        setToDelete(null)
        if (data)
            onDeleteFeature(data)
    }

    const [columns] = React.useState([
        {title: 'Label', field: 'label'},
        {
            title: "Span/Value",
            field: "span",
            render: (rowData) => {
                
                if (!rowData.hasOwnProperty("span") || rowData.span === '')
                    return (<span></span>)

                if (typeof rowData.span === 'string')
                    return (<span>{rowData.span}</span>)

                const start = rowData.span[0]
                const end = rowData.span[1]

                let preview = ''
                if (end - start > PREVIEW_MAX_LENGTH)
                    preview = text.substring(start, start + PREVIEW_MAX_LENGTH) + " [...]"
                else 
                    preview = text.substring(start, end)
                return (
                    <span onMouseEnter={()=>handleMouseEnter([start, end])}
                          onMouseLeave={()=>handleMouseLeave(null)}>({start}, {end}) "{preview}"`</span>)}
        },
        {title: 'Probability', field: 'probability'},
    ]);

    return (
        <div>
            <MaterialTable
                options={{selection: true}}
                title="Résultats"
                icons={tableIcons}
                columns={columns}
                data={parseFeatures(features)}
                actions={[
                    {
                        icon: 'add',
                        tooltip: 'Add Feature',
                        isFreeAction: true,
                        onClick: () => onAddFeature(true)
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Delete Feature',
                        onClick: (e, rows) => setToDelete(rows)
                    }
                ]}
                parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
            />
            <FeatureDeleteDialog examId={examId} features={features} toDelete={toDelete} onClose={handDeleteFeatureEnd} />
        </div>
    )
})
