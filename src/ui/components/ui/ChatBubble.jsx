import React from 'react'


function ChatBubble({
    message,
    messageDate,
    messageTime,
    direction,
    status,
    statusDate,
    statusTime,
    senderName
})
{

    return (

        <div className={`chat ${direction=='left'?"chat-start":"chat-end"}`}>

            <div className="chat-header">
                <div className='text-xs opacity-50'>
                    {senderName && <span>{senderName}, </span>}{messageDate} {messageTime}
                </div>
            </div>

            <div className="chat-bubble">
                {message}
            </div>

            {status &&
            
            <div className="chat-footer opacity-50">
                {status}, {statusDate}, {statusTime}
            </div>

            }

        </div>

    )

}


export default ChatBubble;