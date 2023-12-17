import {Button} from "@mui/material";
import styles from '../styles/Modal.module.css'
import InventoryContainer from "./InventoryContainer";

export default function RefillModal({data, closeRefill}: {data: any, closeRefill: () => void}){

    return(
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.title}>
                    <h1>Refill Required</h1>
                </div>
                <div className={styles.body}>
                    <p> To begin refill flip the switch DI1 to ‘1’.
                        When the inventory is full: switch DI1 to ‘0’ and production will proceed.</p>
                    <div style={{marginLeft:"115px"}}><InventoryContainer data={data}/></div>
                </div>
                <div className={styles.footer}>
                    <Button className={styles.button}
                            variant={"contained"}
                            onClick={closeRefill}
                    >Close</Button>
                </div>
            </div>
        </div>
    )
}