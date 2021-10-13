export class MovieModel {
    id!: string
    title!: string
    category!: string
    likes!: number
    dislikes!: number
    poster?: string
    userAsLike: boolean = false
    userAsDisLike: boolean = false
}