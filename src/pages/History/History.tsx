import React, { FC, useState, ReactNode, useCallback, useEffect } from "react";
//logic
import { useAppSelector } from "@hooks/storeHooks/useAppStore";
import Pagination from "@components/Pagination/Pagination";

import { addFieldToObject, Omiter } from "@services/UsefulMethods/ObjectMethods";
//UI
import classes from './History.module.css';
import { HistoryObj } from "@pages/HistoryObj";
import { HistoryItem } from "./HistoryItem/HistoryItem";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";

type group_category_props = {
    id: number,
    title: string,
    color: string,
    icon: string
}
interface Transaction {
    id: number;
    amount: number;
    time: string;
    description: string;
    category_group?: {
        group?: group_category_props
        category?: group_category_props
    },
    type: string
}

const Groups: FC = () => {

    const [items = [], setItems] = useState<Transaction[]>();
    const [limit = 6, setLimit] = useState<number>();
    const [page = 1, setPage] = useState<number>();

    const expensesDTO: Transaction[] = [...HistoryObj.expenses.map((el: Object) =>
        Omiter(['id'], el))].map(el => addFieldToObject(el, 'type', 'expense'))
    const replenishmentsDTO: Transaction[] = [...HistoryObj.replenishments.map((el: Object) =>
        Omiter(['id'], el))].map(el => addFieldToObject(el, 'type', 'replenishment'))
    const HistoryArray: Transaction[] = [...expensesDTO, ...replenishmentsDTO]

    const getMixedHistory = (localLimit: number, localPage: number) => {     
        return (HistoryArray.sort((b, a) => {
            const dateA = new Date(a.time).getTime();
            const dateB = new Date(b.time).getTime();
            return dateA - dateB;
        })).slice(localLimit*localPage - localLimit, localLimit*localPage)
    }

    const getRecentActivities = useCallback((rowsPerPage: number, page: number) => {
        let res: ReactNode[] = getMixedHistory(rowsPerPage, page).map((el, i) => 
                <HistoryItem
                    key={i}
                    animation={'in'}
                    description={el.description}
                    type={el.type === 'expense' ? 'expense' : 'replenishment'}
                    categoryColor={el.category_group?.category?.color || '#80D667'}
                    groupColor={el.category_group?.group?.color || '#80D667'}
                    categoryTitle={el.category_group?.category?.title || '-'}
                    groupTitle={el.category_group?.group?.title || '-'}
                    amount={el.amount}
                    time={el.time} />
            )
        return res
    }, [page, limit])

    useEffect(()=>{
        getRecentActivities(limit, page)
    },[limit, page])

    return (<>
        <Header/>
        <main id='HistoryPage'>
            <div className={classes.page__container}>
                <h1 className={classes.pageTitle}>History</h1>
                <section className={classes.recentOperations}>
                    <table className={classes.recentOperations__table}>
                        <thead className={classes.tableTitle}>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Group</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody className={classes.tableText}>
                            {getRecentActivities(limit, page)}
                            <tr>
                                <td colSpan={5}>
                                    <div className={classes.paginationWrapper}>
                                        <Pagination
                                        page={page}
                                        setPage={setPage}
                                        firstAction={page*limit - limit + 1}
                                        lastAction={page*limit > HistoryArray.length ? page*limit-(page*limit-HistoryArray.length) : page*limit}
                                        totalActions={HistoryArray.length}
                                        rowsPerPage={limit}
                                        setRowsPerPage={setLimit}/>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
        <Footer/>
    </>)
}

export default Groups