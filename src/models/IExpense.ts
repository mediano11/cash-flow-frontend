export default interface IExpense {
    id: number,
    descriptions: string,
    amount: number,
    time: string,
    category_group: {
        group: {
            id: number
            title: string
        },
        category: {
            id: number
            title: string
        }
    }
}