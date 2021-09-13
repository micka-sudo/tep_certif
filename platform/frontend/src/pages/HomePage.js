import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Container from '@material-ui/core/Container';
import Progress from "../components/CircularProgress/CircularProgress";
import Checkbox from '@material-ui/core/Checkbox';
import {getContents, deleteContent} from "../services/content.service";
import ForwardIconButton from "../components/Button/ForwardIconButton";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const columns = [
    {
        id: 'title', label: 'Title', extract: (row) => {
            return row.title;
        }
    },
    {
        id: 'project', label: 'Project', extract: (row) => {
            return row.project.name;
        }
    },
    {
        id: 'createdBy', label: 'Created By', extract: (row) => {
            return row.created_by.username;
        }
    },
    {
        id: 'modifiedDate', label: 'Last Modification', extract: (row) => {
            return new Date(row.modified_date).toLocaleString("en-EN");
        }
    },

];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(6),
    },
}));

export default function StickyHeadTable(props) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = React.useState(true);
    const [refreshData, setRefreshData] = React.useState(true);
    const [data, setData] = React.useState(null);

    const [hasSelectAll, setHasSelectAll] = React.useState(false);

    const handleLoadedData = React.useCallback((data) => {
        setData(updateAllSelection(data, false))
        setHasSelectAll(false)
    }, [setData]);

    React.useEffect(() => {
        if (data)
            setIsLoading(false)
        if (refreshData) {
            setRefreshData(false)
            getContents('/documents/', {limit: rowsPerPage, offset: page * rowsPerPage, depth: 3}, handleLoadedData)
        }
    }, [data, handleLoadedData, refreshData, setRefreshData, rowsPerPage, page, setIsLoading]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
        setRefreshData(true)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
        setRefreshData(true);
    };

    const handleDocumentClick = (documentId) => {
        return (event) => {
            window.location = "/document/" + documentId;
        }
    };

    const updateAllSelection = (data, value) => {
        const newData = data;
        newData.results = newData.results.map((item) => {
            item['isSelected'] = value;
            return item 
        });
        return newData
    };

    const handleSelectedAll = (event) => {
        setHasSelectAll(event.target.checked)
        setData(updateAllSelection(data, event.target.checked))
    };

    const handleSelect = (event, row) => {
        row.isSelected=event.target.checked
        setData({...data})
    };

    const handleDeleteDocument = (event) => {
        data.results.forEach((item) => {
            if (item.isSelected === true)
                deleteContent('/documents/' + item.id + '/', (data) => {setRefreshData(true)})
        });
    };

    if (isLoading)
        return (<div><Progress/></div>)

    return (
        <div className={classes.root}>
            <Container maxWidth="lg" className={classes.container}>
                <TableContainer className={classes.container}>  
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell><Checkbox checked={hasSelectAll} onChange={handleSelectedAll}/></TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{minWidth: column.minWidth}}
                                    >
                                        {column.label}
                                    </TableCell>))}
                                <TableCell onClick={handleDeleteDocument}>
                                    <IconButton color="primary" aria-label="Delete Selected Documents">
                                        <DeleteIcon ></DeleteIcon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.results.map((row) => {
                                return (
                                    <TableRow id={row.id} hover tabIndex={-1} key={row.id}>
                                        <TableCell>
                                            <Checkbox checked={row.isSelected} onChange={(event) => handleSelect(event, row)}/>
                                        </TableCell>
                                        {columns.map((column) => {
                                            return (
                                                <TableCell key={column.id} align={column.align}
                                                           padding={row.disablePadding ? 'none' : 'normal'}
                                                >
                                                    {column.extract(row)}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell
                                            onClick={handleDocumentClick(row.id)}><ForwardIconButton></ForwardIconButton></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={data.count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Container>
        </div>
    );
}
