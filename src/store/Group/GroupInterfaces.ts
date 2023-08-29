export interface ITooltip{
    shouldShowTooltip: false,
    modeTooltip: 'leave' | 'kick' | 'disband' | 'create' | 'update',
    textTooltip: '',
    status: 'success' | 'error'
}
export default interface IGroupState { 
    defaultGroup: number,
    tooltip: ITooltip
}