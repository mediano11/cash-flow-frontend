import React, { FC, Dispatch, SetStateAction, ReactNode, useState, useCallback, useEffect, useMemo} from "react";

//UI
import classes from './GroupModal.module.css';
import Input from "@components/Input/Input";
import CustomButton from "@components/Buttons/CustomButton/CustomButton";
import Accordion, { AccordionTab } from "@components/Accordion/Accordion";
//logic
import UsePortal from "@hooks/layoutHooks/usePortal/usePortal";
import StatusTooltip from "@components/StatusTooltip/StatusTooltip";
import { useCreateGroupMutation, useLeaveGroupMutation, useUpdateGroupMutation } from "@store/Controllers/GroupsController/GroupsController";
import IGroupState from "@store/Group/GroupInterfaces";
import { customColors, customIcons } from "@services/UsefulMethods/UIMethods";
import { useActionCreators, useAppSelector } from "@hooks/storeHooks/useAppStore";
import { GroupSliceActions } from "@store/Group/GroupSlice";

interface IGroupModalProps{
    groupId?: number,
    setGroupId: Dispatch<SetStateAction<number>>,
    isGroupModalOpen: boolean
    setIsGroupModalOpen: Dispatch<SetStateAction<boolean>>;
    mode: 'create' | 'edit'
}

const GroupModal: FC<IGroupModalProps> = ({ isGroupModalOpen, setIsGroupModalOpen, mode, groupId, setGroupId }) => {
    
    const GroupsStore = useAppSelector<IGroupState>(state => state.persistedGroupSlice)
    const GroupsSliceDispatch = useActionCreators(GroupSliceActions);
    
    const headerIcon: ReactNode = <i className="bi bi-boxes"></i>
    const titleModal = 'Group'

    //pickers
    const [nameValue, setNameValue] = useState<string>('');
    const [descValue, setDescValue] = useState<string>('');
    const [pickedColor, setPickedColor] = useState<string>('#FF2D55');
    const changeColor = (e: React.MouseEvent<HTMLDivElement>, color: string) => {setPickedColor(color)};
    const light = <div style={{backgroundColor: pickedColor, boxShadow: '0px 0px 8px ' + pickedColor}} className={classes.colorPicked}></div>

    const [icon, setIcon] = useState<string>('bi bi-people');
    const changeIcon = (e: React.MouseEvent<HTMLDivElement>, icon: string) => {setIcon(icon)};
    const iconDisplayed = <i style={{fontSize: '24px', color: 'var(--main-text)'}} className={icon}></i>

    const [createGroup, { isLoading: isGroupCreating, isSuccess: isGroupCreated, isError: isGroupCreatingError},] = useCreateGroupMutation();
    const [updateGroup, { isLoading: isGroupUpdating, isSuccess: isGroupUpdated, isError: isGroupUpdatingError},] = useUpdateGroupMutation();
    const [disbandGroup, { isLoading: isGroupDisbanding, isSuccess: isGroupDisbanded, isError: isGroupDisbandingError},] = useLeaveGroupMutation();

    const closeModalHandler = useCallback(() => {
        if(!isGroupCreating || !isGroupUpdating){
            setGroupId(0);
            setIsGroupModalOpen(false);
        }
    }, [isGroupUpdatingError, isGroupUpdating, isGroupUpdated,
        isGroupCreatingError, isGroupCreating, isGroupCreated])

    const intitializeBaseGroup = useCallback(() => {
        if (GroupsStore.defaultGroup === 0 && !isGroupCreating && isGroupCreated && !isGroupCreatingError){
            GroupsSliceDispatch.setDefaultGroup(groupId)
        } 
    }, [createGroup, isGroupCreating, isGroupCreated, isGroupCreatingError])

    const handleSubmit = () => {
        if(mode === 'create'){
            createGroup({
                title: nameValue,
                description: descValue,
                icon_url: icon,
                color_code: pickedColor,
            })
            intitializeBaseGroup();
            closeModalHandler();
        } else if(mode === 'edit'){
            if(groupId){
                updateGroup({
                    id: groupId,
                    title: nameValue,
                    description: descValue,
                    icon_url: icon,
                    color_code: pickedColor,
                })
                intitializeBaseGroup();
                closeModalHandler();
            }
        }
    }

    const showToolTip = useMemo(() => {
        if(mode === 'create'){
            if (isGroupCreated) {
                return <StatusTooltip
                type="success" 
                title={`Group ${nameValue} successfully added`}/>
            } else if(isGroupCreatingError) {
                return <StatusTooltip
                type="error" 
                title={`Group ${nameValue} not added`}/>
            }
        } else {
            if (isGroupUpdated) {
                return <StatusTooltip
                type="success" 
                title={`Group ${nameValue} successfully updated`}/>
            } else if(isGroupUpdatingError) {
                return <StatusTooltip
                type="error" 
                title={`Group ${nameValue} not updated`}/>
            }
        }
    }, [createGroup, isGroupCreating, isGroupCreated, isGroupCreatingError, 
        updateGroup, isGroupUpdating, isGroupUpdated, isGroupUpdatingError])

    let labelText = '';
    if (mode === 'create') {
        labelText = 'Please сreate new group:'
    } else if (mode === 'edit') {
        labelText = 'Please enter the name of the group:'
    }

    useEffect(() => {
        intitializeBaseGroup()
        closeModalHandler()
    }, [intitializeBaseGroup, closeModalHandler])

    return <>
    {showToolTip}
        <UsePortal
            isModalOpen={isGroupModalOpen}
            setIsModalOpen={setIsGroupModalOpen}
            headerIcon={headerIcon}
            title={titleModal}
        >
            <form
                onSubmit={handleSubmit}>
                <div className={classes.modal__wrapper}>
                    <div className={classes.inputNameGroup}>
                        <label className={classes.title} htmlFor="groupName">{labelText}</label>
                        <div className={classes.inputWrapper}>
                            <Input
                                setFormValue={{ type: 'name', callback: setNameValue }}
                                isInputMustClear={!isGroupModalOpen}
                                inputType="name" id="groupName"
                                name="groupName" placeholder="Name" />
                        </div>
                    </div>
                    <div className={classes.textAreaGroup}>
                        <label className={classes.title} htmlFor="groupDesc">Description:</label>
                        <div className={classes.textAreaWrapper}>
                            <Input
                                setFormValue={{ type: 'area', callback: setDescValue }}
                                isInputMustClear={!isGroupModalOpen}
                                inputType="area" id="groupDesc"
                                name="groupDesc" placeholder="Description" />
                        </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <Accordion>
                            <AccordionTab title="Select color" choosedItem={light}>
                                <div className={classes.pickBody}>
                                    {
                                        customColors.map((el, i) =>
                                            <div
                                                key={i}
                                                onClick={(e) => changeColor(e, el)}
                                                style={{
                                                    width: '24px', height: '24px',
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
                                        customIcons.map((el, i) =>
                                            <div
                                                key={i}
                                                onClick={(e) => changeIcon(e, el)}
                                                style={{
                                                    fontSize: '24px',
                                                    cursor: 'pointer'
                                                }}>
                                                <i style={{ color: 'var(--main-text)' }} className={el}></i>
                                            </div>)
                                    }
                                </div>
                            </AccordionTab>
                        </Accordion>
                    </div>
                    <div className={classes.btnWrapper}
                        style={{ justifyContent: mode === 'edit' ? 'space-between' : 'center' }}>
                        {mode === 'edit' && groupId && <CustomButton
                            isPending={isGroupDisbanding}
                            children="Disband"
                            btnWidth={170}
                            btnHeight={36}
                            icon="disband"
                            type='danger'
                            background="outline"
                            disableScale={true}
                            callback={() => {disbandGroup(groupId)}}
                        />}
                        <CustomButton
                            isPending={isGroupCreating}
                            children="Confirm"
                            btnWidth={170}
                            btnHeight={36}
                            icon="submit"
                            type='primary'
                            callback={handleSubmit}
                        />
                    </div>
                </div>
            </form>
        </UsePortal>
</>};
  
export default React.memo(GroupModal);