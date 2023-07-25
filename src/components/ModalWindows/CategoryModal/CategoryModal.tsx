import React, { FC, ReactNode, useState, useCallback, Dispatch, SetStateAction } from "react";

//UI
import classes from './CategoryModal.module.css';
import Input from "@components/Input/Input";
import CustomButton from "@components/Buttons/CustomButton/CustomButton";
import Accordion, { AccordionTab } from "@components/Accordion/Accordion";
        
//logic
import UsePortal from "@hooks/layoutHooks/usePortal/usePortal";
import StatusTooltip from "@components/StatusTooltip/StatusTooltip";

interface ICategoryModalProps{
    isCategoryModalOpen: boolean
    setIsCategoryModalOpen: Dispatch<SetStateAction<boolean>>;
    mode: 'create' | 'edit'
}
interface IModalState {
    name: string
    color: string
}

const CategoryModal: FC<ICategoryModalProps> = ({ isCategoryModalOpen, setIsCategoryModalOpen, mode }) => {

    const headerIcon: ReactNode = <i className="bi bi-boxes"></i>
    const titleModal = 'Category'
    const [nameValue, setNameValue] = useState<string>('');
    const [colorValue, setColorValue] = useState<string>('');

    //submit
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const [shouldShowTooltip, setShouldShowTooltip] = useState<boolean>(false);

    //pickers
    const [pickedColor, setPickedColor] = useState<string>('#FF2D55');
    const changeColor = (e: React.MouseEvent<HTMLDivElement>, color: string) => {setPickedColor(color)};
    const light = <div style={{backgroundColor: pickedColor, boxShadow: '0px 0px 8px ' + pickedColor}} className={classes.colorPicked}></div>
    const colors: string[] = [
        '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',
        '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',
        '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
        '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',
        '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033',
        '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00'
    ];

    const [icon, setIcon] = useState<string>('bi bi-people');
    const changeIcon = (e: React.MouseEvent<HTMLDivElement>, icon: string) => {setIcon(icon)};
    const iconDisplayed = <i style={{fontSize: '24px', color: 'var(--main-text)'}} className={icon}></i>
    const icons: string[] = [
        'bi bi-people', 'bi bi-activity', 'bi bi-alarm', 'bi bi-alipay', 'bi bi-apple', 'bi bi-android2',
        'bi bi-archive', 'bi bi-arrow-through-heart', 'bi bi-badge-3d', 'bi bi-badge-wc', 'bi bi-badge-vr', 'bi bi-bag-check',
        'bi bi-bag-heart', 'bi bi-bank', 'bi bi-bezier2', 'bi bi-basket2', 'bi bi-bandaid', 'bi bi-balloon',
        'bi bi-box-seam', 'bi bi-bookshelf', 'bi bi-boombox', 'bi bi-book', 'bi bi-binoculars', 'bi bi-bicycle',
        'bi bi-cup-hot', 'bi bi-cart', 'bi bi-camera', 'bi bi-calendar-date', 'bi bi-bus-front', 'bi bi-briefcase',
        'bi bi-airplane', 'bi bi-globe', 'bi bi-emoji-smile', 'bi bi-display', 'bi bi-database', 'bi bi-credit-card-2-front',
    ]

    const postObject: IModalState = {
        name: nameValue,
        color: colorValue
    };

    const handleSubmit = async() => {
        setIsSubmiting(true)
        await setTimeout(() => {
            setShouldShowTooltip(true)
            setIsSubmiting(false);
            alert(JSON.stringify(postObject, null, 2));
            setIsCategoryModalOpen(false);
        }, 3000);
    }
    const showToolTip = useCallback(() => {
        if (shouldShowTooltip) {
            return <StatusTooltip
            type="success" 
            title="Category successfully added"/>
        }
    }, [shouldShowTooltip])
    let labelText = '';
    if (mode === 'create') {
        labelText = 'Please сreate new category:'
    } else if (mode === 'edit') {
        labelText = 'Please enter the name of the category:'
    }
    return <>
    {showToolTip()}
    <UsePortal
        setIsModalOpen={setIsCategoryModalOpen}
        isModalOpen={isCategoryModalOpen}
        headerIcon={headerIcon}
        title={titleModal}
        containerWidth={500}
        >
            <form
            onSubmit={handleSubmit}>
                <div className={classes.modal__wrapper}>
                    <div className={classes.inputNameCategory}>
                        <label className={classes.title} htmlFor="categoryName">{labelText}</label>
                        <div className={classes.inputWrapper}>
                            <Input 
                            setFormValue={{type: 'name', callback: setNameValue}}
                            isInputMustClear={!isCategoryModalOpen} 
                            inputType="name" id="categoryName" 
                            name="categoryName" placeholder="Name"/>
                        </div>
                    </div>
                    <div style={{marginTop: '16px'}}>
                        <Accordion>
                            <AccordionTab title="Select color" choosedItem={light}>
                                <div className={classes.pickBody}>
                                    {
                                        colors.map((el,i) => 
                                            <div
                                                key={i}        
                                                onClick={(e) => changeColor(e, el)}
                                                style={{width: '24px', height: '24px', 
                                                borderRadius: '100%', backgroundColor: el, 
                                                    cursor: 'pointer'
                                                }}>
                                            </div>)
                                    }
                                </div>
                            </AccordionTab>
                            <AccordionTab title="Select icon" choosedItem={iconDisplayed}>
                                <div className={classes.pickBody}>
                                    {
                                        icons.map( (el,i) => 
                                            <div 
                                                key={i}
                                                onClick={(e) => changeIcon(e, el)}
                                                style={{fontSize: '24px', 
                                                cursor: 'pointer'}}>
                                                <i  style={{color: 'var(--main-text)'}}
                                                    className={el}></i>
                                            </div>)
                                    }
                                </div>
                            </AccordionTab>
                        </Accordion>
                    </div>
                </div>
                <div className={classes.confirmBtnWrapper}>
                    <CustomButton
                        isPending={isSubmiting}
                        children="Confirm"
                        btnWidth={170}
                        btnHeight={36}
                        icon="submit"
                        type='primary'
                        callback={handleSubmit}
                        className={`btn-primary`} />
                </div>
            </form>
    </UsePortal>
</>};
  
export default React.memo(CategoryModal);