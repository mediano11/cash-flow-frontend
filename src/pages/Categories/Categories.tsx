import React, { FC, useState, ReactNode, Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { categoriesObj } from './categoriesObj';

import uuid from 'react-uuid';
//logic
import { useAppSelector } from "@hooks/storeHooks/useAppStore";
import ICategory from "@models/ICategory";
//UI
import classes from './Categories.module.css'
import CustomButton from "@components/Buttons/CustomButton/CustomButton";
import CategoriesCard from "./CategoriesCard/CategoriesCard";
import CategoryModal from "@components/ModalWindows/CategoryModal/CategoryModal";
import SmallModal from "@components/ModalWindows/SmallModal/SmallModal";



const Groups = [
    {
        "id": 0,
        "title": "Its title",
        "groups": {
            "color_code": "#FF0000",
            "icon_url": "bi bi-bank"
        }
    },
    {
        "id": 1,
        "title": "Its group",
        "groups": {
            "color_code": "#99FF00",
            "icon_url": "bi bi-camera"
        }
    },
    {
        "id": 2,
        "title": "group",
        "groups": {
            "color_code": "#FF6600",
            "icon_url": "bi bi-badge-vr"
        }
    },
    {
        "id": 3,
        "title": "-_-qwe qweqw eqweq",
        "groups": {
            "color_code": "#FF6600",
            "icon_url": "bi bi-badge-vr"
        }
    },
    {
        "id": 4,
        "title": "hahha",
        "groups": {
            "color_code": "#FF6600",
            "icon_url": "bi bi-badge-vr"
        }
    },
    {
        "id": 5,
        "title": "very long title",
        "groups": {
            "color_code": "#FF6600",
            "icon_url": "bi bi-badge-vr"
        }
    },
]
const Categories: FC = () => {

    const actualTheme = useAppSelector(state => state.persistedThemeSlice.theme);

    const [groups, setGroups] = useState<boolean>(false);
    const [categories, setCategories] = useState<ICategory[]>([])
    const [selectedGroup, setSelectedGroup] = useState<number>(0);
    const [isCreateCategoryModal, setIsCreateCategoryModal] = useState<boolean>(false);
    const [isEditCategoryModal, setIsEditCategoryModal] = useState<boolean>(false);
    const [isGroupMenuModal, setIsGroupMenuModal] = useState<boolean>(false);
    const buttonRef = useRef(null);
    const { categoriesJson } = categoriesObj;
    
    const initializeCategories = useCallback(() => {
        const newCategories = categoriesJson.find(item => item.id === selectedGroup)?.categories
        if (newCategories) {
            setCategories(newCategories);
        }
    }, [selectedGroup, categoriesJson])

    useEffect(() => {
        initializeCategories()
    }, [initializeCategories])
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setSelectedGroup(+event.target.value)
    }
    const handleGroupModalOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsGroupMenuModal(!isGroupMenuModal)
    }

    const getGroups = () => {
        let res: ReactNode[] = [];
        let groupsItems: ReactNode[] = [];
        Groups.map((el, i) => {
            return groupsItems.push(
                <div key={'12sf3' + i} className={classes.groupNavItem}>
                    <input
                        type='radio'
                        value={el.id}
                        checked={selectedGroup === el.id}
                        id={`group-item-${i}`}
                        name='group'
                        onChange={handleChange}
                        className={classes.inputItem} />
                    <label
                        htmlFor={`group-item-${i}`}
                        className={classes.groupTitle}
                    >{el.title}</label>
                </div>
            )}
        )
        res.push(groupsItems.slice(0,4))
        if (Groups.length > 4) {
            res.push(<SmallModal
                key={'qwe'}
                title={'Groups'}
                active={isGroupMenuModal}
                setActive={setIsGroupMenuModal}
                className={classes.groupsModalNav}
                children={
                    <div className={classes.groupModalWrapper}>
                        {groupsItems.slice(4)}
                    </div>
                }
                buttonRef={buttonRef}
            />)
            res.push(
                <button key={'werww1'} className={classes.moreBtn}
                    ref={buttonRef}
                    onClick={handleGroupModalOpen}>
                    <div></div>
                    <div></div>
                    <div></div>
            </button>)
        }
        return res;
    }

    const getCategories = useMemo<JSX.Element[]>(() => {
        return categories.map((item, i) =>
            <CategoriesCard
                key={uuid()}
                id={i}
                color={item.color}
                title={item.title}
                icon={item.icon}
                isEditCategoryModal={isEditCategoryModal}
                setIsEditCategoryModal={setIsEditCategoryModal}
            />
        )
    }, [categories])

    return (<>
        <CategoryModal
            setIsCategoryModalOpen={setIsCreateCategoryModal}
            isCategoryModalOpen={isCreateCategoryModal}
            mode='create'
        />
        <CategoryModal
            setIsCategoryModalOpen={setIsEditCategoryModal}
            isCategoryModalOpen={isEditCategoryModal}
            mode='edit'
        />
        <main id='CategoriesPage'>
            <div className={classes.CategoriesPage__container}>
                <h3 className={classes.pageTitle}>Categories</h3>
                <nav className={classes.groupsNav}>
                    {getGroups()}
                </nav>
                <div className={classes.addCategory}>
                    <div className={classes.upSide}>
                        <h5 className={classes.CategoryTitle}>Category</h5>
                        <CustomButton
                            isPending={false}
                            callback={()=>setIsCreateCategoryModal(!isCreateCategoryModal)}
                            icon="add"
                            type="primary"
                            children="Create new category"
                            />
                    </div>
                    <div className={classes.line}></div>
                </div>
                <ul className={classes.CategoriesBox}>
                    {getCategories}
                </ul>
            </div>
        </main>
    </>)
}

export default Categories