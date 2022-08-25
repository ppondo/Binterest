import React, { useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      minHeight: 500,
      paddingLeft: 30,
      paddingRight: 30,
      marginBottom: 30,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    image: {
        maxWidth: 500,
        height: "auto"
    },
    imageList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 0,
        padding: 0,
    },
    desc: {
        fontFamily: 'monospace',
    },
  });

function UnsplashList(props) {
    const classes = useStyles();
    const [ pagenum, setPageNum ] = useState(1);
    const { loading, error, data } = useQuery(queries.UNSPLASH_IMAGES, {
        fetchPolicy: 'cache-and-network', 
        variables: { pagenum },
    });
    const [updateImage] = useMutation(queries.UPDATE_IMAGE, { 
        update(cache, { data: { updateImage } }) {
            const { unsplashImages } = cache.readQuery({ 
                query: queries.UNSPLASH_IMAGES,
                variables: {
                    pagenum: pagenum 
                }
            });
            cache.writeQuery({
                query: queries.UNSPLASH_IMAGES,
                variables: {
                    pagenum: pagenum 
                },
                data: { 
                    unsplashImages: unsplashImages.filter((e) => e.id !== updateImage.id).concat([updateImage]) 
                }
            });
        }
    });

    const buildImages = (img) => {
        let button;
        if (img.binned) {
            button = <button onClick={(e) =>{
                e.preventDefault();
                updateImage({
                    variables: {
                        id: img.id,
                        url: img.url,
                        posterName: img.posterName,
                        description: img.description || " ",
                        userPosted: img.userPosted,
                        binned: false
                    }
                })
            }}
            className="bin-btn">
                remove from bin
            </button>       
        } else if(img.binned === false) {
            button = <button onClick={(e) =>{
                e.preventDefault();
                updateImage({
                    variables: {
                        id: img.id,
                        url: img.url,
                        posterName: img.posterName,
                        description: img.description || " ",
                        userPosted: img.userPosted,
                        binned: true
                    }
                })
            }}
            className="bin-btn">
                add to bin
            </button>
        }
        return (
            <Card key={img.id}className={classes.root} variant="outlined">
                <Typography className={classes.desc} component="p">
                    {img.description || "no description"}
                </Typography>
                <div>{img.posterName}</div>
                <img className={classes.image}src={img.url} alt={img.posterName} />
                <CardActions>
                    {button}
                </CardActions>
            </Card>
        )
    }

    if (data) {
        let images = data.unsplashImages;
        const mappedImages = images.map((img) => {
            return buildImages(img)
        })

        console.log(images);
        return (
            <div>
                <ul className={classes.imageList}>
                    {mappedImages}
                </ul>
                <div className='float'>
                    <AddCircleIcon 
                    onClick={(e) => {
                        e.preventDefault();
                        setPageNum(pagenum + 1);
                    }}
                    className='icon' 
                    style={{ fontSize: 30 }}>add_circle</AddCircleIcon>
                </div>
            </div>
        )
    } else if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>{error.message}</div>
    }
}

export default UnsplashList;