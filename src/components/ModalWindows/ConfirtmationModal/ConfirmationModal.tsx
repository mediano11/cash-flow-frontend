import React, { FC, ReactNode, useState, useCallback, Dispatch, SetStateAction, useEffect, useMemo } from "react";

//UI
import classes from './ConfirmationModal.module.css';
import CustomButton from "@components/Buttons/CustomButton/CustomButton";
//logic
import UsePortal from "@hooks/layoutHooks/usePortal/usePortal";
import IGroup from "@models/IGroup";
import { useLeaveGroupMutation, useRemoveUserMutation } from "@store/Controllers/GroupsController/GroupsController";
import { useNavigate } from "react-router-dom";
import IUser from "@models/IUser";
import { useActionCreators } from "@hooks/storeHooks/useAppStore";
import { TooltipSliceActions } from "@store/UI_store/TooltipSlice/TooltipSlice";
import { useDeleteExpenseByGroupMutation } from "@store/Controllers/ExpensesController/ExpensesController";

type IContfirmationModalProps = {
    title?: string
    isConfirmationModalOpen: boolean
    setIsConfirmationModalOpen: Dispatch<SetStateAction<boolean>>;
} & (
    | {mode: 'kick', kickedUser: IUser, groupId: number, expenseId?: never, callback?: never, isExpense?: never}
    | {mode: 'leave' | 'disband', kickedUser?: IUser, groupId: number, expenseId?: never, callback?: never, isExpense?: never}
    | {mode: 'remove_expense', kickedUser?: never, groupId: number, expenseId: number, callback: () => void, isExpense: boolean}
)

const ConfirmationModal: FC<IContfirmationModalProps> = ({groupId, 
    expenseId, title, isConfirmationModalOpen, 
    setIsConfirmationModalOpen, mode, kickedUser,
    callback, isExpense}) => {

    const navigate = useNavigate();
    const [leaveGroup, { isLoading: isLeavingGroupLoading, isError: isLeavingGroupError, isSuccess: isLeavingGroupSuccess}] = useLeaveGroupMutation();
    const [removeUser, { isLoading: isRemovingUser, isSuccess: isRemoveUserSuccess, isError: isRemoveUserError}] = useRemoveUserMutation();
    const [removeExpense, {isError: isRemovingExpenseError, isLoading: isRemovingExpenseLoading, isSuccess: isRemovingExpenseSuccess}] = useDeleteExpenseByGroupMutation();
    const TooltipDispatch = useActionCreators(TooltipSliceActions)
    
    let headerIcon: ReactNode = <i className="bi bi-boxes"></i>
    let titleModal: string = ''
    let modalText: ReactNode = '';

    const handleSubmit = () => {
        if(mode === 'kick' && kickedUser){
            setIsConfirmationModalOpen(false)
            removeUser({group_id: groupId, user_id: kickedUser.id})
        } else if (mode === 'leave' || mode === 'disband') {
            leaveGroup(groupId)
        } else if (mode === 'remove_expense') {
            setIsConfirmationModalOpen(false)
            removeExpense({group_id: groupId, expense_id: expenseId})
        }
    }

    if (mode === 'leave') {
        headerIcon = <i className= "bi bi-box-arrow-right" ></i>
        titleModal = 'Leave group'
        modalText = <p>Are you sure you want to leave the <span>{title}</span> group?</p>
    } else if (mode === 'kick') {
        headerIcon = <i className="bi bi-person-dash"></i>
        titleModal = 'Remove user'
        modalText = <p>Are you sure you want to remove  <span>{kickedUser?.first_name} {kickedUser?.last_name}</span> from the group?</p>
    } else if (mode === 'disband') {
        headerIcon = <i className="bi bi-people"></i>
        titleModal = 'Disband group'
        modalText = <p>Are you sure you want to disband your <span>{title}</span> group?</p>
    } else if (mode === 'remove_expense') {
        headerIcon = <i className="bi bi-trash"></i>
        titleModal = 'Remove expense'
        modalText = <p>Are you sure you want to remove <span>{title}</span> {isExpense ? 'expense' : 'replenishment'}?</p>
    }

    const showToolTip = useCallback(() => {
        if(mode === 'disband'){
            if (isLeavingGroupSuccess) {
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'disband',
                    textTooltip: 'You have successfully disbanded the group',
                    status: 'success'
                })
                navigate('/groups')
                setIsConfirmationModalOpen(false)
            } else if(isLeavingGroupError) {
                setIsConfirmationModalOpen(false)
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'disband',
                    textTooltip: "You haven't disbanded the group",
                    status: 'error'
                })
            } 
        } else if (mode === 'leave'){
            if (isLeavingGroupSuccess) {
                navigate('/groups')
                setIsConfirmationModalOpen(false)
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'leave',
                    textTooltip: "You have successfully left from group",
                    status: 'success'
                })
            } else if(isLeavingGroupError) {
                setIsConfirmationModalOpen(false)
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'leave',
                    textTooltip: "You haven't left from group",
                    status: 'error'
                })
            }
        } else if(mode === 'kick'){
            if (isRemoveUserSuccess) {
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'kick',
                    textTooltip: "You have successfully removed user",
                    status: 'success'
                })
            } else if(isRemoveUserError) {
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'kick',
                    textTooltip: "You haven't removed user",
                    status: 'error'
                })
            }
        } else if(mode === 'remove_expense'){
            if (isRemoveUserSuccess) {
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'kick',
                    textTooltip: "You have successfully removed expense",
                    status: 'success'
                })
                callback()
            } else if(isRemoveUserError) {
                TooltipDispatch.setTooltip({
                    shouldShowTooltip: true,
                    modeTooltip: 'kick',
                    textTooltip: "You haven't removed expense",
                    status: 'error'
                })
                callback()
            }
        }
    }, [mode, leaveGroup, isLeavingGroupError, isLeavingGroupSuccess,
        removeUser, isRemoveUserSuccess, isRemoveUserError, removeExpense,
        isRemovingExpenseSuccess, isRemovingExpenseLoading, isRemovingExpenseError])

    useEffect(() => {
        showToolTip()
    }, [showToolTip])

    return <div>
        <UsePortal
            callback={() => {}}
            setIsModalOpen={setIsConfirmationModalOpen}
            isModalOpen={isConfirmationModalOpen}
            headerIcon={headerIcon}
            title={titleModal}
            containerWidth={500}
        >
            <form
                onSubmit={handleSubmit}>
                <div className={classes.modal__wrapper}>
                    <p className={classes.text}>{modalText}</p>
                </div>
                <div className={classes.confirmBtnWrapper}>
                    <CustomButton
                        isPending={isLeavingGroupLoading || isRemovingUser}
                        children="Confirm"
                        btnWidth={170}
                        btnHeight={36}
                        icon="submit"
                        type='primary'
                        callback={handleSubmit}
                        />
                    <CustomButton
                        isPending={false}
                        children="Cancel"
                        btnWidth={170}
                        btnHeight={36}
                        icon="refuse"
                        type='danger'
                        callback={() => { setIsConfirmationModalOpen(false) }}
                    />
                </div>
            </form>
        </UsePortal>
    </div>
};

export default React.memo(ConfirmationModal);