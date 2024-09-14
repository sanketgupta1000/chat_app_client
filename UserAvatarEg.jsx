import UserAvatar from "./ui/components/ui/UserAvatar"

function App() {

    return (
        <>
            <div>
                {/* Hello World */}

                {/* my preview */}
                <UserAvatar
                
                    userId={"user1"}
                    name={"Sanket Gupta"}
                    imgSrc={"https://placehold.jp/100x100.png"}
                    email={"sanketgupta@gmail.com"}

                />

                {/* private chat */}
                <UserAvatar
                
                    userId={"user1"}
                    name={"Sumit Gohil"}
                    imgSrc={"https://placehold.jp/100x100.png"}
                    lastMessage={"Hi SanketHi SanketHi SanketHi SanketHi SanketHi SanketHi SanketHi Sanket"}
                    lastMessageFrom={"Sumit"}
                    to={"/private-chats/chat1"}

                />

                {/* request */}
                <UserAvatar
                    userId={"user1"}
                    requestId={"request1"}
                    name={"Harshpalsinh Zala"}
                    imgSrc={"https://placehold.jp/100x100.png"}
                    email={"abc123@gmail.com"}
                    matchingInterests={["Reading", "Writing"]}
                    rating={6}
                    showRequestActions
                />

                {/* preview as a suggested user */}
                <UserAvatar
                    userId={"user1"}
                    name={"Harshpalsinh Zala"}
                    imgSrc={"https://placehold.jp/100x100.png"}
                    email={"abc123@gmail.com"}
                    matchingInterests={["Reading", "Writing"]}
                    rating={6}
                    showSendRequestBtn
                />

            </div>
        </>
    )
}

export default App;
