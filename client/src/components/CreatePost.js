import React, { useState } from 'react';
import './App.css';
import { useMutation } from '@apollo/client';
import queries from '../queries';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        backGroundColor: 'white'
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    uploadForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 15,
        padding: 0,
        fontFamily: 'monospace'
    },
    formInput: {
        margin: 5,
        padding: 5,
        width: 250,
        height: 30,
    },
    label: {
        textDecoration: "underline"
    }
}));

function CreatePost(props) {
    const classes = useStyles();
    const [uploadImage] = useMutation(queries.UPLOAD_IMAGE);
    const [ postDescription, setPostDescription ] = useState('');
    const [ postURL, setPostURL ] = useState('');
    const [ postName, setPostName ] = useState('');


    const handleChangedDesc = (e) => {
        setPostDescription(e.target.value);
    }

    const handleChangedURL = (e) => {
        setPostURL(e.target.value);
    }

    const handleChangedName = (e) => {
        setPostName(e.target.value);
    }

    return (
        <div className={classes.root}>
            <form
                className={classes.uploadForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    uploadImage({
                        variables: {
                            url: postURL,
                            posterName: postName,
                            description: postDescription
                        }
                    })
                    props.history.push('/my-posts')
                }}
            >
                <h2>
                    Create a Post
                </h2>
                <p className={classes.label}>Description</p>
                <label> 
                    <input
                    type="text"
                    name="description"
                    onChange={handleChangedDesc}
                    value={postDescription}
                    className={classes.formInput}
                    ></input>
                </label>
                <p className={classes.label}>URL</p>
                <label> 
                    <input
                    type="text"
                    name="url"
                    onChange={handleChangedURL}
                    value={postURL}
                    className={classes.formInput}
                    ></input>
                </label>
                <p className={classes.label}>Name</p>
                <label> 
                    <input
                    type="text"
                    name="name"
                    onChange={handleChangedName}
                    value={postName}
                    className={classes.formInput}
                    ></input>
                </label>
                <input className="bin-btn" type="submit" value="Submit"></input>
            </form>
        </div>
    )
}

export default CreatePost;