import React, { useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'

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
    }
  });

function ImageList(props) {
    let query;
    let type;
    if (props.bin) {
        query = queries.BINNED_IMAGES;
        type = 'bin';
    } else {
        query = queries.USER_POSTED_IMAGES;
        type = 'post';
    }
    const classes = useStyles();
    const [ listType ] = useState(type);
    const { loading, error, data } = useQuery(query, { fetchPolicy: 'cache-and-network' });
    const [ updateImageBin ] = useMutation(queries.UPDATE_IMAGE)
    const [ updateImagePost ] = useMutation(queries.UPDATE_IMAGE)
    const [ deleteImage ] = useMutation(queries.DELETE_IMAGE, {
        update(cache, { data: { deleteImage } }) {
            const { userPostedImages } = cache.readQuery({ 
                query: queries.USER_POSTED_IMAGES 
            });
            cache.writeQuery({
                query: queries.USER_POSTED_IMAGES,
                data: { 
                    userPostedImages: deleteImage
                }
                
            });
        }
    });

    const buildImages = (img) => {
        let button;
        if (img.binned) {
            button = <button onClick={(e) =>{
                e.preventDefault();
                updateImageBin({
                    variables: {
                        id: img.id,
                        url: img.url,
                        posterName: img.posterName,
                        description: img.description,
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
                updateImagePost({
                    variables: {
                        id: img.id,
                        url: img.url,
                        posterName: img.posterName,
                        description: img.description,
                        userPosted: img.userPosted,
                        binned: true
                    }
                })
            }}
            className="bin-btn">
                add to bin
            </button>
        }

        let deleteBtn;
        if(img.userPosted && listType === 'post') {
           deleteBtn =  <button onClick={(e) =>{
                e.preventDefault();
                deleteImage({
                    variables: {
                        id: img.id,
                        url: img.url,
                        posterName: img.posterName,
                        description: img.description,
                        userPosted: img.userPosted,
                        binned: img.binned
                    }
                })
            }}
            className="bin-btn">
                delete post
            </button>
        } else {
            deleteBtn = <div></div>
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
                    {deleteBtn}
                    {/* <DeleteBtn img={img}/> */}
                </CardActions>
            </Card>
        )
    }

    if (data) {
        let images;
        let button;
        if (listType === 'bin') {
            images = data.binnedImages
        } else {
            images = data.userPostedImages;
            button = <Link to="/new-post"><button className="bin-btn-2">new post</button></Link>
        }

        if (images === null) { 
            images = []
            return <div className={classes.root}>Empty Bin</div>
        };

        const mappedImages = images.map((img) => {
            return buildImages(img)
        })

        return (
            <ul className={classes.imageList}>
                {button}
                {mappedImages}
            </ul>
        )
    } else if (loading) {
        return <div className={classes.root} >Loading...</div>
    } else if (error) {
        return <div className={classes.root} >{error.message}</div>
    }
}

export default ImageList;