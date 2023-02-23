import { useEffect, useContext, useState } from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import DataContext from "./context/DataContext"
import api from './api/posts'
import format from "date-fns/format"


const EditPost = () => {
    const [editTitle, setEditTitle] = useState('')
    const [editBody, setEditBody] = useState('')
    const {posts, setPosts} = useContext(DataContext)
    const{id} = useParams()
    const post = posts.find(post => (post.id).toString() === id)
    const history = useHistory()
    
    const handleEdit = async(id) =>{
        const datetime = format(new Date(), 'MMMM dd, yyyy pp')
        const updatedPost ={id, title: editTitle, datetime, body: editBody}
        console.log(updatedPost)
        try{
          const response = await api.put(`/post/${id}`, updatedPost);//This is faulty
          setPosts(posts.map(post => post.id === id? {...response.data}: post))
          setEditTitle('')
          setEditBody('')
          history.push('/')
        }catch(err){
          console.log(err.message)
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        }
      }

    useEffect(() => {
        if(post){
            setEditTitle(post.title)
            setEditBody(post.body)
        }
    },[post, setEditTitle, setEditBody])
  return (
    <main className='NewPost'>
        {editTitle &&
        <>
            <h2>New Post</h2>
            <form className='newPostForm' onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="postTitle">Title:</label>
                <input 
                    id='postTitle' 
                    type="text"
                    required
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                />
                <label htmlFor="postBody">Post:</label>
                <textarea 
                    id='postBody' 
                    required
                    value={editBody} 
                    onChange={(e) => setEditBody(e.target.value)}
                />
                <button type='submit' onClick={()=> handleEdit(post.id)}>Submit</button>
            </form>
        </>
        }
        {!editTitle &&
            <main className="Missing">
            <h2>Post not found</h2>
            <p>
              <Link to='/'>Visit Our Homepage</Link>
            </p>
        </main>
        }
    </main>
  )
}

export default EditPost