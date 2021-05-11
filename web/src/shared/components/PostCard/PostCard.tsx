import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import {
  RegularPostFragment,
  useDeletePostMutation,
  useMeQuery,
} from '../../../generated/graphql'
import UpDownDoot from '../UpDownDoot'
import './postcard.css'
type PostCardProps = React.PropsWithChildren<{
  post: RegularPostFragment
}>

function PostCard({ post }: PostCardProps) {
  const [{ data: meData }] = useMeQuery()

  const [, deletePost] = useDeletePostMutation()
  return (
    <div>
      <Card key={post.id} className='mt-1'>
        <div className='mt-3 mx-3 d-flex justify-content-between'>
          <a style={{ color: 'black' }} href={`/post/${post.id}`}>
            {post.title}
          </a>
          <div>
            <Dropdown>
              <Dropdown.Toggle
                style={{ backgroundColor: '#dee2e6' }}
                variant=''
                id='dropdown-basic'
              >
                Actions
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log('share clicked')}>
                  Share
                </Dropdown.Item>
                {meData?.me?.id === post.creatorId && (
                  <>
                    <Dropdown.Item href={`/post/edit/${post.id}`}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={async () => {
                        await deletePost({ id: post.id })
                        console.log('deleted')
                      }}
                    >
                      Delete
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <Card.Body className='d-flex align-items-center'>
          <UpDownDoot post={post} className='' />
          <div>
            <Card.Text className='ml-3'>{post.text}</Card.Text>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className='float-right'>{post.creator.username}</div>
        </Card.Footer>
      </Card>
    </div>
  )
}

export default PostCard
