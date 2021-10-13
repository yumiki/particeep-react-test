import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { checkCategory, deleteMovieById, selectAllCategories, selectFilteredMovies, selectSelectedCategories, selectView, toggleDislikeAction, toggleLikeAction, uncheckCategory } from './movieSlice';
import { selectAllMovies } from "./movieSlice";
import { MovieModel } from './MovieModel';
import styles from './Movie.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

const DeleteButton = ({actionOnClick, visibility}:{actionOnClick: Function, visibility: boolean}) => {
    const handleClick = () => {
        actionOnClick()
    }

    return (            
        <div className={visibility? styles.deleteButton : styles.hidden} onClick={handleClick}>
            <FontAwesomeIcon  icon={faTimesCircle} size="2x"/>
        </div>
    )
}

const LikeBar = ({like, dislike, likeAction, dislikeAction, asLikeContent, asDislikeContent}: {like: number, dislike: number, likeAction: Function, dislikeAction: Function, asLikeContent: boolean, asDislikeContent: boolean}) => {
    const percentage = `${(like/(like+dislike))*100}%`

    return (
        <div className={styles.like}>
            <div className={styles.likesCounter}> 
                <FontAwesomeIcon 
                    icon={faThumbsUp} 
                    onClick={()=> {
                        likeAction()}}
                    color={asLikeContent ? "green" : undefined}
                />{like}
            </div> 
            <div className={styles.likeBar}> 
                <div className={styles.likeCountBar} style={{width: percentage ? percentage : 0}}></div>
            </div>
            <div className={styles.dislikesCounter}> 
                <FontAwesomeIcon icon={faThumbsDown} onClick={() => {
                    dislikeAction()
                }}
                color={asDislikeContent ? "red" : undefined}
                />{dislike}
            </div>
        </div>
    )
}


const MovieInfo = ({movie}: {movie: MovieModel}) => {
    const dispatch = useAppDispatch()

    const likeMovieAction = () => {
        dispatch(toggleLikeAction(movie.id))
    }

    const dislikeMovieAction = () => {
        dispatch(toggleDislikeAction(movie.id))
    }

    return (
        <div className={styles.info}>
            <b>{movie.title}</b><br/>
            {movie.category}
            <LikeBar 
                like={movie.likes} 
                dislike={movie.dislikes} 
                likeAction={likeMovieAction} 
                dislikeAction={dislikeMovieAction}
                asDislikeContent={movie.userAsDisLike}
                asLikeContent={movie.userAsLike}
                ></LikeBar>
        </div>
    )
}


const MovieCard = ({movie}: {movie: MovieModel}) => {
    const [deleteButtonVisibility, setDeleteButtonVisibility] = useState(false);
    const dispatch = useAppDispatch();

    const deleteMovie = () => {
        dispatch(deleteMovieById(movie.id))
    }

    function renderPoster() {
        if(movie.poster)
        return <img className={styles.moviePoster} src={movie.poster} alt={`${movie.title}`}/>
    }
    
    return (
        <div className={styles.movieCard} onMouseEnter={()=>{setDeleteButtonVisibility(true)}} onMouseLeave={()=>{setDeleteButtonVisibility(false)}}>
            { renderPoster() }
            <DeleteButton actionOnClick={deleteMovie} visibility={deleteButtonVisibility}/>
            <MovieInfo movie={movie}></MovieInfo>         
        </div>)
}


export const FilterView = () => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectAllCategories)
    const selectedCategories = useAppSelector(selectSelectedCategories)

    function isSelected(category: string): boolean {
        return selectedCategories.includes(category)
    }

    function getClass(category: string): string {
        var className = styles.filterButton

        return  isSelected(category) ? `${className} ${styles.selectedFilter}` : className 
    }

    function handleClick(category: string) {
        console.error("Wrong", category)
        isSelected(category) ? dispatch(uncheckCategory(category)) : dispatch(checkCategory(category))
    }

    return (
        <div>
            <h2>Catégories</h2>
            <ul>
                {
                    categories.map((category, index) => {
                        return (
                            <li className={getClass(category)} key={index} onClick={()=> { handleClick(category) }}>{category}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}


export const MovieGrid = () => {
    const showFilteredView = useAppSelector(selectView)
    const filteredMovieList = useAppSelector(selectFilteredMovies)
    const allMovies = useAppSelector(selectAllMovies)

    const movies = showFilteredView ? filteredMovieList : allMovies


    return (
        <div className={styles.movieGrid}>
            {
                movies.map((movie: MovieModel) => {
                    return <MovieCard key={movie.id} movie={movie}></MovieCard>
                })
            }
        </div>
    )

}