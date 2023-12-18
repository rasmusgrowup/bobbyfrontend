import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from "react";
import StatusContainer from "../components/StatusContainer";
import InventoryContainer from "../components/InventoryContainer";
import FormContainer from "../components/FormContainer";
import SensorContainer from "../components/SensorContainer";
import MaintenanceBar from "../components/MaintenanceBar";
import BasicTable from "../components/BasicTable";
import RefillModal from "../components/RefillModal";
import MaintenanceModal from "../components/MaintenanceModal";
import SensorWarning from "../components/SensorWarning";

interface MyData {
    'Maintenance.Counter'?: number|0;
    [key: string]: any;
}

function Home() {
    const [data, setData] = useState<MyData>({});
    const [dataStatic, setDataStatic] = useState<MyData>({});
    const [openRefill, setRefill] = useState(false);
    const [openMaintenance, setMaintenance] = useState(false);
    const [amountFromChild, setAmountFromChild] = useState(0);

    const handleAmountChange = (amount: number) => {
        setAmountFromChild(amount);
    };

    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:8080/api/read-current-state')
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then(data => {
                    setDataStatic(data);
                    setData(data);
                })
                .catch(error => {
                    setData({ error: error.toString() }); // Update state with an error message if needed
                    console.error('An error occurred:', error);
                });
        };

        // Call the function once immediately, then set the interval
        fetchData();

        // Cleanup function to clear the interval when the component unmounts
    }, []);

    console.log({dataStatic});
    console.log({data});

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8080/sse/stream');

        eventSource.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);

            // Assuming the data is in the format: { nodeId: '...', value: ... }
            const {nodeId, value} = parsedData;

            // Split the string by colons and select the parts that represent the property
            const parts = nodeId.split(':');
            const propertyName = parts.slice(3).join(''); // This will join the parts after "s="
            // Update the state with the new value
            setData(prevData => ({
                ...prevData,
                [propertyName]: value,
            }));
        };

        return () => {
            eventSource.close();
        };
    }, []);

    useEffect(()=>{
        if(data['Cube.Status.StateCurrent'] == 11){
            if(data['Cube.Admin.StopReason.ID'] == 10){
                setRefill(true);
            }
            else if(data['Cube.Admin.StopReason.ID'] == 11){
                setMaintenance(true);
            }
        }
    },[data['Cube.Status.StateCurrent'],data['Cube.Admin.StopReason.ID']]);

    return (
        <>
            <Head>
                <title>BobbyBrewer</title>
                <meta name="description" content="BobbyBrewer logo"/>
                <link rel="icon" type={"image/ico"} href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <div className={styles.headerContainer}>
                    <img className={styles.beerLogo} src="/indexlogo.png" alt="beer"/>
                    <h1>BobbyBrewer - Beer Brewing Machine</h1>
                    <img className={styles.beerLogo} src="/indexlogo.png" alt="beer"/>
                </div>
                <div className={styles.dashboard}>
                    <FormContainer data={data} onAmountChange={handleAmountChange}/>
                    <InventoryContainer data={data}/>
                    <StatusContainer data={data}/>
                    <SensorContainer data={data}/>
                    <MaintenanceBar data={data}/>
                    <BasicTable data={data} amount={amountFromChild}/>
                </div>
                <SensorWarning data={data}/>
                {openRefill && <RefillModal data={data} closeRefill={() => setRefill(false)}/>}
                {openMaintenance && <MaintenanceModal data={data} closeMaintenance={() => setMaintenance(false)}/>}
            </main>
        </>
    )
}

export default Home