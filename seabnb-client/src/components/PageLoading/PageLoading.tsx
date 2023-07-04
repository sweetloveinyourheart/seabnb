import { FunctionComponent } from "react";
import styles from './PageLoading.module.scss'

interface PageLoadingProps {
    
}
 
const PageLoading: FunctionComponent<PageLoadingProps> = () => {
    return (  
        <div className={styles['page-loading']}>
            <div className={styles["lds-ellipsis"]}><div></div><div></div><div></div><div></div></div>
        </div>
    );
}
 
export default PageLoading;