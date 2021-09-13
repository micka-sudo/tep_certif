import React from 'react';
import Typography from '@material-ui/core/Typography';
import {getContents} from "../services/content.service"

export default function ApplyQueueFeedBack(props) {    
    const [queueCount, setQueueCount] = React.useState(localStorage.getItem('queueCount'));

    const handleApplySuccess = (data) => {
        setQueueCount(data.queue.count);
    }

    React.useEffect(() => {
        function getQueueCount() {
            getContents("/apply-queue-count/", {}, handleApplySuccess)
        }
        getQueueCount()
        if (queueCount && queueCount !== 0){
            const interval = setInterval(() => getQueueCount(), 10000)
            return () => {
                clearInterval(interval);
            }
        }
        }, [queueCount])
        
    if (!queueCount || queueCount <= 0)
        return (<div></div>)

    return (
        <div>
           <Typography component="span">
               Restant : {queueCount}
            </Typography>
        </div>
    )
}

