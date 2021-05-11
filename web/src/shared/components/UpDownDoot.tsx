import React, { useState } from 'react'
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'
import { IconContext } from 'react-icons/lib'
import { RegularPostFragment, useVoteMutation } from '../../generated/graphql'

type Props = React.PropsWithChildren<{
  className: string
  post: RegularPostFragment
}>

type UpdootLoading = 'updoot-loading' | 'downdoot-loading' | 'not-loading'

export default function UpDownDoot({ className, post }: Props) {
  const [updootLoading, setUpdootLoading] = useState<UpdootLoading>(
    'not-loading'
  )
  const [, vote] = useVoteMutation()

  const completeClassName = ` ${className}`
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className={`bg-${post.voteStatus === 1 ? 'success' : 'light'}`}>
        <IconContext.Provider
          value={{ color: post.voteStatus === 1 ? 'white' : 'black' }}
        >
          <BiChevronUp
            onClick={async () => {
              console.log('is passed success')

              if (post.voteStatus === 1) return
              console.log('passed success')

              setUpdootLoading('updoot-loading')
              await vote({
                postId: post.id,
                value: 1,
              })
              setUpdootLoading('not-loading')
              console.log('clicked updoot')
            }}
            className={completeClassName}
            size='30px'
          ></BiChevronUp>
        </IconContext.Provider>
      </div>
      <div className='my-1'>{post.points}</div>
      <div className={`bg-${post.voteStatus === -1 ? 'danger' : 'light'}`}>
        <IconContext.Provider
          value={{ color: post.voteStatus === -1 ? 'white' : 'black' }}
        >
          <BiChevronDown
            className={completeClassName}
            size='30px'
            onClick={async () => {
              console.log('is passed')
              if (post.voteStatus === -1) return
              console.log('passed')
              setUpdootLoading('downdoot-loading')
              await vote({
                postId: post.id,
                value: -1,
              })

              setUpdootLoading('not-loading')
            }}
          ></BiChevronDown>
        </IconContext.Provider>
      </div>
    </div>
  )
}
